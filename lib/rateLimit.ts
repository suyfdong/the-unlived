/**
 * IP限流系统 - 防止恶意刷接口
 * 使用内存存储，适合单服务器部署
 *
 * 双层限流策略：
 * 1. 小时限流：防止短时间爆刷
 * 2. 每日限流：防止全天薅羊毛
 */

interface RateLimitRecord {
  count: number
  resetTime: number
  lastRequest: number
}

// 内存存储，重启后清空
const ipStore = new Map<string, RateLimitRecord>()
const dailyIpStore = new Map<string, RateLimitRecord>()

// 定期清理过期记录（每小时）
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of ipStore.entries()) {
    if (now > record.resetTime) {
      ipStore.delete(ip)
    }
  }
  for (const [ip, record] of dailyIpStore.entries()) {
    if (now > record.resetTime) {
      dailyIpStore.delete(ip)
    }
  }
}, 60 * 60 * 1000)

export interface RateLimitConfig {
  /** 时间窗口内允许的最大请求数 */
  maxRequests: number
  /** 时间窗口（毫秒） */
  windowMs: number
  /** 被限流后的提示消息 */
  message?: string
  /** 每日最大请求数（可选，不设置则不启用每日限流） */
  maxRequestsPerDay?: number
}

/**
 * 检查IP是否超过限流（支持双层限流：小时+每日）
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number; message?: string } {
  const now = Date.now()

  // 1. 先检查每日限流（如果启用）
  if (config.maxRequestsPerDay) {
    const dailyKey = `${ip}:daily`
    const dailyRecord = dailyIpStore.get(dailyKey)

    if (!dailyRecord || now > dailyRecord.resetTime) {
      // 创建新的每日记录（24小时窗口）
      dailyIpStore.set(dailyKey, {
        count: 1,
        resetTime: now + 24 * 60 * 60 * 1000, // 24小时
        lastRequest: now,
      })
    } else if (dailyRecord.count >= config.maxRequestsPerDay) {
      // 达到每日限制
      const hoursRemaining = Math.ceil((dailyRecord.resetTime - now) / 1000 / 60 / 60)
      return {
        allowed: false,
        remaining: 0,
        resetTime: dailyRecord.resetTime,
        message: `您今日的请求次数已用完，请 ${hoursRemaining} 小时后再试`,
      }
    } else {
      // 增加每日计数
      dailyRecord.count++
      dailyRecord.lastRequest = now
      dailyIpStore.set(dailyKey, dailyRecord)
    }
  }

  // 2. 检查小时限流
  const record = ipStore.get(ip)

  // 没有记录或已过期，创建新记录
  if (!record || now > record.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + config.windowMs,
      lastRequest: now,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    }
  }

  // 已达到小时限制
  if (record.count >= config.maxRequests) {
    const minutesRemaining = Math.ceil((record.resetTime - now) / 1000 / 60)
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      message: config.message || `请求过于频繁，请 ${minutesRemaining} 分钟后再试`,
    }
  }

  // 增加小时计数
  record.count++
  record.lastRequest = now
  ipStore.set(ip, record)

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * 获取客户端真实IP
 * 考虑代理、CDN等情况
 */
export function getClientIp(request: Request): string {
  // Vercel会设置这些header
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Cloudflare
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp
  }

  return 'unknown'
}

/**
 * 获取当前IP的使用统计
 */
export function getIpStats(ip: string): RateLimitRecord | null {
  return ipStore.get(ip) || null
}

/**
 * 手动重置某个IP的限流记录（管理功能）
 */
export function resetIpLimit(ip: string): void {
  ipStore.delete(ip)
}

/**
 * 获取所有活跃IP数量（监控用）
 */
export function getActiveIpCount(): number {
  return ipStore.size
}
