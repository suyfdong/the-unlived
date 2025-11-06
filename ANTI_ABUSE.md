# 防滥用保护策略

本文档说明了The Unlived Project实施的防护措施，防止恶意用户薅羊毛和刷爆接口。

## 🛡️ 已实施的防护措施

### 1. IP限流（Rate Limiting）

**实现位置**: `lib/rateLimit.ts`

#### 生成AI回信限流
- **限制**: 每个IP每小时最多10次请求
- **窗口**: 1小时滚动窗口
- **配置**: 通过环境变量 `MAX_REQUESTS_PER_HOUR` 调整
- **提示**: 被限流后会显示剩余等待时间

#### 提交到展览墙限流
- **限制**: 每个IP每小时最多20次请求
- **窗口**: 1小时滚动窗口
- **配置**: 通过环境变量 `MAX_SUBMIT_PER_HOUR` 调整

**工作原理**:
- 使用内存存储追踪每个IP的请求次数
- 自动识别代理和CDN的真实IP（x-forwarded-for, x-real-ip, cf-connecting-ip）
- 超过限制返回HTTP 429状态码
- 响应头包含限流信息（X-RateLimit-*）
- 定期清理过期记录（每小时）

### 2. 内容验证

**实现位置**: `app/api/generate/route.ts`

#### 长度限制
- **最小长度**: 10个字符
- **最大长度**: 2000个字符（可通过`MAX_TEXT_LENGTH`环境变量调整）
- **目的**: 防止无意义的超短或超长内容

#### 质量检查
- **唯一字符数**: 至少5个不同字符，防止"aaaaaaa"这类垃圾内容
- **词汇重复率**: 对于长文本（>20词），不同词汇比例需大于30%
- **目的**: 过滤机器生成的垃圾内容

#### 关键词过滤
- 过滤测试用词: `testing`, `spam`
- 过滤不当词汇: 可根据需要扩展
- **目的**: 防止滥用和不当内容

### 3. 请求验证

**实现位置**: 所有API路由

- 验证必需字段（userText, recipientType, letterId）
- 验证recipient类型合法性
- 防止重复提交（检查is_public状态）
- JSON格式验证

## 📊 监控和调整

### 查看限流状态

限流系统提供了监控函数（在`lib/rateLimit.ts`中）:

```typescript
// 获取某个IP的使用情况
getIpStats(ip: string)

// 获取当前活跃IP数量
getActiveIpCount()

// 手动重置某个IP的限流（管理功能）
resetIpLimit(ip: string)
```

### 调整限流参数

在Vercel环境变量中设置：

```bash
# 每小时AI生成次数（默认10）
MAX_REQUESTS_PER_HOUR=10

# 每小时提交展览墙次数（默认20）
MAX_SUBMIT_PER_HOUR=20

# 最大文本长度（默认2000字符）
MAX_TEXT_LENGTH=2000
```

**建议的调整时机**:
- 初期严格（10次/小时），观察使用情况
- 如果真实用户抱怨限制太严，逐步放宽到15-20次/小时
- 发现滥用迹象时收紧限制

## ⚠️ 已知限制

### 内存存储的局限性

当前限流使用**内存存储**，有以下限制：

1. **服务器重启后清空**: Vercel重新部署时限流记录会丢失
2. **多服务器不共享**: 如果Vercel横向扩展，每个实例有独立的限流记录
3. **无法持久化**: 没有跨会话的封禁功能

### 升级方案

如果需要更强的防护，可以考虑：

1. **使用Redis存储限流数据**
   - Vercel KV (Vercel官方Redis服务)
   - Upstash (免费层每天10k请求)
   - 优点: 持久化、多实例共享、可实现永久封禁

2. **使用Vercel Edge Config**
   - 存储IP黑名单
   - 超低延迟读取
   - 适合小规模封禁列表

3. **使用Cloudflare**
   - 在Vercel前添加Cloudflare代理
   - 使用Cloudflare的Rate Limiting规则
   - DDoS防护
   - Bot检测

## 🚨 紧急应对

### 如果遇到攻击

1. **立即降低限流阈值**
   ```bash
   # 在Vercel环境变量中设置
   MAX_REQUESTS_PER_HOUR=3
   MAX_SUBMIT_PER_HOUR=5
   ```

2. **查看Vercel日志**
   - Vercel Dashboard → Logs
   - 查找异常高频的IP地址
   - 查看429错误的频率

3. **临时封禁IP（手动）**
   - 在`app/api/generate/route.ts`顶部添加IP黑名单
   ```typescript
   const BLOCKED_IPS = ['123.456.789.0', '111.222.333.444'];

   if (BLOCKED_IPS.includes(clientIp)) {
     return NextResponse.json(
       { error: 'Access denied' },
       { status: 403 }
     );
   }
   ```

4. **限制OpenRouter API额度**
   - 在OpenRouter Dashboard设置每日/每月预算上限
   - 避免成本失控

5. **考虑添加验证码**
   - 使用hCaptcha或Cloudflare Turnstile
   - 仅在检测到可疑流量时展示

## 💡 成本控制建议

1. **设置OpenRouter API预算上限**
   - 在OpenRouter后台设置每月预算
   - 达到限额后自动停止

2. **监控成本**
   - 定期查看OpenRouter使用情况
   - Vercel Analytics监控流量

3. **考虑逐步收费**
   - 前N次免费，之后收费
   - 或者仅允许注册用户使用（添加简单认证）

## 📈 效果评估

**预期效果**:
- 阻止99%的自动化脚本攻击
- 限制单个用户的滥用（每小时10次足够正常使用）
- 保持良好的用户体验（真实用户很少遇到限流）

**需要监控的指标**:
- 429错误率（应该<1%）
- 平均每IP请求次数（正常应该<3次/小时）
- API成本趋势
- 用户反馈（是否觉得限制太严）

## 🔄 持续优化

随着项目发展，可以逐步添加：

1. ✅ 基础IP限流（已完成）
2. ✅ 内容验证（已完成）
3. ⬜ 用户行为分析（检测异常模式）
4. ⬜ 简单的邮箱验证（可选）
5. ⬜ Redis持久化限流
6. ⬜ Cloudflare防护

---

**最后更新**: 2024年11月

**维护建议**: 每周检查一次Vercel日志和成本，根据实际情况调整限流参数。
