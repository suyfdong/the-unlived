/**
 * IP限流系统 - 防止恶意刷接口
 * 使用内存存储，适合单服务器部署
 */

interface RateLimitRecord {
  count: number
  resetTime: number
  lastRequest: number
}

// 内存存储，重启后清空
const ipStore = new Map<string, RateLimitRecord>()

// 定期清理过期记录（每小时）
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of ipStore.entries()) {
    if (now > record.resetTime) {
      ipStore.delete(ip)
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
}

/**
 * 检查IP是否超过限流
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number; message?: string } {
  const now = Date.now()
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

  // 已达到限制
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      message: config.message || '请求过于频繁，请稍后再试',
    }
  }

  // 增加计数
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
