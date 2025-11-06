# The Unlived Project - 开发文档

> AI情绪博物馆 - 写下未寄出的信，收到AI的回复

**项目地址**: https://github.com/suyfdong/the-unlived
**最后更新**: 2024年11月

---

## 📋 项目概述

The Unlived Project 是一个基于AI的情感表达平台，用户可以：
1. 写下从未寄出的信件（给恋人、朋友、父母、过去的自己等）
2. 收到AI生成的温柔回复
3. 选择性地将AI回复提交到公开展览墙
4. **隐私保护**：原始信件永不公开，仅AI回复可被展示

---

## 🏗️ 技术栈

### 前端框架
- **Next.js 16.0.1** (Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (动画)

### 后端服务
- **Supabase** (PostgreSQL数据库)
- **OpenRouter API** (Claude 3.5 Sonnet)
- **Vercel** (部署平台)

---

## 🗄️ 数据库结构

### letters_private (私密表)
- 用户原始信件永不公开
- 包含ai_reply、recipient_type等
- is_public标记是否已提交展览

### letters_public (公开展览表)
- 仅展示AI回复
- exhibit_number展览编号
- views浏览次数

---

## 🔐 环境变量配置

### 必需变量
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
OPENROUTER_API_KEY=your_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 防护配置（可选，有默认值）
```bash
# 双层限流 ⭐ 核心防护
MAX_REQUESTS_PER_HOUR=10       # 每小时10次
MAX_REQUESTS_PER_DAY=20        # 每天20次
MAX_SUBMIT_PER_HOUR=20
MAX_SUBMIT_PER_DAY=30
MAX_TEXT_LENGTH=2000
```

---

## 🛡️ 防滥用保护系统

### 双层限流策略（核心特性）

**AI生成限流**:
- 小时限制: 10次/小时（防止短时爆刷）
- 每日限制: 20次/天 ⭐（防止全天薅羊毛）
- **成本降低**: 从240次/天降至20次/天（降低92%）

**工作原理**:
```
请求 → 检查每日限制 → 检查小时限制 → 内容验证 → 通过✅
        ↓超限20次      ↓超限10次       ↓不合格
        拒绝❌         拒绝❌          拒绝❌
```

**内容验证**:
- ✅ 长度限制: 10-2000字符
- ✅ 重复检测: 至少5个不同字符
- ✅ 词汇重复率检测
- ✅ 关键词过滤

详见: [ANTI_ABUSE.md](ANTI_ABUSE.md) | [RATE_LIMIT_UPDATE.md](RATE_LIMIT_UPDATE.md)

---

## 🎨 核心功能

### 1. AI回信生成
- 位置: `/api/generate`
- 使用OpenRouter API (Claude 3.5 Sonnet)
- 针对不同收信人定制prompt
- 支持中英日韩多语言
- 4段式结构: 共感→共处→察觉→柔软结尾

### 2. 打字机动画
- 每字符30ms逐字显示
- 带闪烁光标效果
- 位置: `components/ResultPage.tsx`

### 3. 沉浸式加载
- 全屏加载动画
- 文案每3秒轮换
- "Someone is writing back to you..."
- 位置: `components/WritePage.tsx`

### 4. 图片导出
- 使用html2canvas
- 2倍高清导出
- 位置: `components/ResultPage.tsx`

### 5. 展览墙分页
- 每页24条
- Load More按钮
- 位置: `components/ExhibitionPage.tsx`

---

## 🎯 SEO优化

### 已实施
- ✅ 页面专属元数据
- ✅ Open Graph标签
- ✅ Twitter Card标签
- ✅ 动态Sitemap (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)

### 需要创建
- ⏳ `/public/og-image.png` (1200x630px)

---

## 📱 页面路由

```
/                   - 首页（精选回信）
/write             - 写信页面
/result            - AI回复展示
/exhibition        - 展览墙
/letters/[id]      - 回信详情
/about             - 关于
/privacy           - 隐私政策
```

---

## 🚀 部署流程

### 1. 推送到GitHub
```bash
git add .
git commit -m "message"
git push origin main
```

### 2. Vercel自动部署
- 连接GitHub仓库
- 设置环境变量
- 自动部署

### 3. 验证
- ✅ 访问首页
- ✅ 测试写信功能
- ✅ 测试限流（连续11次应被拒绝）
- ✅ 检查sitemap.xml
- ✅ 检查robots.txt

---

## 🔍 监控维护

### 日常检查
1. **Vercel日志**: 查看429错误率（应<1%）
2. **OpenRouter成本**: 每周检查，设置预算上限
3. **异常IP**: 查找高频请求IP

### 预期指标
- 首页加载: <2秒
- AI生成: 10-15秒
- 429错误率: <1%
- 每IP平均: 2-5次/天

### 异常处理
- ⚠️ 429错误率>5%: 放宽限流
- ⚠️ 成本突增: 收紧限流
- ⚠️ 某IP>50次/天: 可能恶意

---

## 🐛 常见问题

### Q: 用户反馈"请求频繁"
**A**: 放宽每日限制 `MAX_REQUESTS_PER_DAY=30`

### Q: 成本过高
**A**: 收紧限流 `MAX_REQUESTS_PER_DAY=10`

### Q: 添加IP黑名单
**A**: 在 `app/api/generate/route.ts` 添加:
```typescript
const BLOCKED_IPS = ['123.456.789.0'];
if (BLOCKED_IPS.includes(clientIp)) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 });
}
```

---

## 📊 开发进度

### ✅ 已完成 (MVP)
- [x] 核心功能（写信、AI回复、展览墙）
- [x] 打字机动画
- [x] 图片导出
- [x] 沉浸式加载
- [x] 双层限流保护（降低92%成本风险）
- [x] 内容验证过滤
- [x] SEO优化
- [x] 首页动态精选
- [x] 分页加载
- [x] Vercel部署

### 🔄 可选优化
- [ ] Google AdSense
- [ ] 移动端优化
- [ ] Redis持久化限流
- [ ] Cloudflare CDN

---

## 📝 重要文件

```
lib/rateLimit.ts              - 限流系统
app/api/generate/route.ts     - AI生成API
app/api/submit-to-exhibition/route.ts - 提交展览API
components/ResultPage.tsx     - 打字机动画
components/WritePage.tsx      - 沉浸式加载
app/sitemap.ts                - SEO sitemap
app/robots.ts                 - SEO robots
ANTI_ABUSE.md                 - 防护详细文档
RATE_LIMIT_UPDATE.md          - 双层限流说明
```

---

## 🤝 贡献

- **开发**: Claude (Anthropic)
- **产品**: susu
- **GitHub**: https://github.com/suyfdong/the-unlived

---

**版本**: v1.0.0 (MVP)
**最后更新**: 2024年11月

🤖 Generated with [Claude Code](https://claude.com/claude-code)
