# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# The Unlived Project - Development Guide

> AI Emotion Museum - Write unsent letters, receive AI replies

**Live Site**: https://www.theunlived.art/
**GitHub**: https://github.com/suyfdong/the-unlived
**Last Updated**: November 2024

---

## 📋 Project Overview

The Unlived Project is an AI-powered emotional expression platform where users:
1. Write unsent letters (to lovers, friends, parents, past selves, or no one)
2. Receive empathetic AI-generated replies
3. Optionally submit AI replies to a public exhibition wall
4. **Privacy-First**: Original letters are NEVER public; only AI-generated replies can be exhibited

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
NEXT_PUBLIC_APP_URL=https://www.theunlived.art
```

### 监控与分析（可选）
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Google Analytics 4 测量ID
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXX  # Google AdSense 发布商ID
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
- ✅ **动态Sitemap** (`/sitemap.xml`) - 自动包含所有展览页面 ⭐ NEW
- ✅ Robots.txt (`/robots.txt`)
- ✅ OG Image (`/public/og-image.png` - 1200x630px)
- ✅ **展览详情页动态SEO元数据** - 每个展览有独特的标题和描述 ⭐ NEW

### Dynamic Sitemap Implementation (2025-11-08)
**Location**: [app/sitemap.ts](app/sitemap.ts:1)

**Features**:
- Automatically includes all exhibition detail pages (`/letters/[id]`)
- Fetches up to 1000 most recent letters from `letters_public` table
- Each exhibition page gets unique metadata with:
  - Dynamic title: "Exhibit #XXXXX - Letter to [Recipient]"
  - Content excerpt (first 150 characters)
  - Recipient-specific keywords
  - OpenGraph and Twitter Card support

**Impact**:
- Google can discover and index all exhibition pages
- Each letter becomes a searchable SEO asset
- Better long-tail keyword coverage

**Implementation**: [app/letters/[id]/page.tsx](app/letters/[id]/page.tsx:6-66)

---

## 📊 Analytics & Monitoring

### Google Analytics 4 Integration
**Configuration Status**:
- ✅ Measurement ID: `G-X64N5PF0X0`
- ✅ Analytics component: [components/GoogleAnalytics.tsx](components/GoogleAnalytics.tsx:1)
- ✅ Integrated in [app/layout.tsx](app/layout.tsx:76-79) (in `<head>` tag)
- ✅ Only loads in production environment
- ✅ Real-time data collection verified (2025-11-07)

**Event Tracking** (9 custom events):
1. `generate_letter_start` - User initiates AI generation
2. `generate_letter_success` - AI reply generated successfully
3. `generate_letter_error` - Generation failed
4. `generate_letter_rate_limited` - Rate limit triggered
5. `copy_letter_text` - User copied text
6. `save_letter_image` - User saved image
7. `submit_to_exhibition_start` - Exhibition submission initiated
8. `submit_to_exhibition_success` - Successfully submitted
9. `submit_to_exhibition_error` - Submission failed

**Implementation**:
- Events tracked in [components/WritePage.tsx](components/WritePage.tsx:44-83)
- Events tracked in [components/ResultPage.tsx](components/ResultPage.tsx:83-163)
- Uses `sendGAEvent()` helper function
- All events include `recipient_type` parameter for segmentation

**Key Metrics to Monitor**:
- Generation success rate: `generate_letter_success` / `generate_letter_start` (target >85%)
- Save image rate: `save_letter_image` / `generate_letter_success` (target >20%)
- Exhibition submission rate: `submit_to_exhibition_success` / `generate_letter_success` (target >15%)

### Google Search Console
**Status**: ✅ Verified (2025-11-07)
- Sitemap submitted: `https://www.theunlived.art/sitemap.xml`
- 5 pages discovered and indexed
- Verification file: `/public/google9b410392de760fe0.html`

---

## 💰 Google AdSense Integration

### Configuration Status
- ✅ Publisher ID: `pub-9041836440635279`
- ✅ ads.txt deployed at `/public/ads.txt`
- ✅ AdSense script integrated in `app/layout.tsx`
- ✅ Ad components created (`components/AdSenseAd.tsx`)

### Ad Placement Strategy (User Experience Optimized)
**Ads ONLY on content consumption pages**:
- ✅ Exhibition Detail Page (`/letters/[id]`) - After letter content (Ad Slot: 2424741566)
- ✅ Exhibition Wall (`/exhibition`) - Below Load More button (Ad Slot: 6413632624)

**NO ads on creation/interaction pages** (preserves immersive experience):
- ❌ Homepage (/) - Maintains visual appeal
- ❌ Write Page (/write) - No interruption during creation
- ❌ Result Page (/result) - Protects typewriter animation experience

### Implementation Details
- Ad component location: [components/AdSenseAd.tsx](components/AdSenseAd.tsx:1)
- Displays placeholder in development, real ads in production
- Only loads after AdSense approval
- See [ADSENSE_SETUP.md](ADSENSE_SETUP.md) for complete configuration guide

---

## 🔐 Legal & Compliance

### Privacy & Terms (Effective: November 7, 2024)
- ✅ Privacy Policy (`/privacy`) - GDPR/CCPA compliant
  - Data collection disclosure
  - Google AdSense cookie usage
  - EU/EEA user rights
  - Children's privacy (13+ requirement)
  - Contact: hello@theunlived.art
- ✅ Terms of Use (`/terms`) - Content licensing
  - Service description and guidelines
  - **Exhibition license grant** (non-exclusive, worldwide, royalty-free)
  - Professional advice disclaimers
  - Age restrictions (13+)

### Consent Flow
- ✅ **Exhibition submission requires explicit consent** ([components/ResultPage.tsx:248-262](components/ResultPage.tsx#L248))
  - Checkbox must be checked before submission
  - Links to Terms of Use for transparency
  - Clear explanation of license grant
  - Consent state resets on modal close

---

## 📱 页面路由

```
/                   - 首页（精选回信）
/write             - 写信页面
/result            - AI回复展示
/exhibition        - 展览墙
/letters/[id]      - 回信详情
/about             - 关于
/privacy           - 隐私政策 (新增)
/terms             - 使用条款 (新增)
```

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Development server (with Turbopack)
npm run dev
# Access at http://localhost:3000

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint

# Database seeding (populate exhibition with sample data)
npm run seed
```

---

## 🏛️ Architecture & Key Patterns

### Data Flow: User Journey
```
Write Letter → AI Generation → Private Storage → Optional Publication → Exhibition Wall
     ↓              ↓                ↓                    ↓                    ↓
  WritePage    /api/generate   letters_private    /api/submit    letters_public
```

### Privacy Architecture (CRITICAL)
- **Two-Table System**: `letters_private` (user+AI) vs `letters_public` (AI only)
- **One-Way Flow**: Can publish private→public, but NEVER expose user text publicly
- **No User Auth (MVP)**: Uses session storage for letter tracking

### Rate Limiting System
**Dual-Layer Protection** ([lib/rateLimit.ts](lib/rateLimit.ts:1)):
1. **Hourly Limit**: 10 requests/hour (prevents burst attacks)
2. **Daily Limit**: 20 requests/day (prevents sustained abuse)

**Implementation**:
- In-memory store (resets on server restart)
- IP-based tracking via `x-forwarded-for` headers
- Separate limits for `/api/generate` vs `/api/submit-to-exhibition`

**Cost Impact**: Reduced abuse from potential 240 requests/day to 20 (92% savings)

### AI Generation Pipeline
**Location**: [app/api/generate/route.ts](app/api/generate/route.ts:1)

**Flow**:
```
1. Rate limit check (IP-based)
2. Content validation (length, quality, banned words)
3. Language detection (CN/EN/JP/KR)
4. Prompt selection (5 recipient types × 4 languages)
5. OpenRouter API call (Claude 3.5 Sonnet)
6. Save to letters_private
7. Return letterId + aiReply
```

**Recipient-Specific Prompts** ([line 14-89](app/api/generate/route.ts#L14)):
- `lover`: Tender, restrained, 2am intimacy
- `friend`: Warm nostalgia, honest without harsh
- `parent`: Complex, no justifications, soft
- `past-self`: Time-blurred, gentle knowing
- `no-one`: Dreamlike, cosmic void whispers

**Critical Details**:
- Temperature: 0.8 (creative but coherent)
- Max tokens: 500 (~180 words)
- 4-part structure: Shared feeling → Being with → Quiet realization → Soft close
- Anti-patterns: No therapy speak, no "be kind to yourself", no AI self-reference

---

## 🚀 Deployment

### Vercel Auto-Deploy
1. Push to `main` branch on GitHub
2. Vercel automatically builds and deploys
3. Environment variables set in Vercel dashboard

### Domain Configuration (Namecheap + Vercel)

**Current Setup**:
- Domain registrar: Namecheap (`theunlived.art`)
- Hosting: Vercel
- DNS: Configured at Namecheap

**Required DNS Records** (in Namecheap Advanced DNS):
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

**Important Notes**:
- Namecheap may be blocked in mainland China - use VPN/proxy to access
- After DNS changes, propagation takes 1-48 hours (usually 1-2 hours)
- Check propagation: https://www.whatsmydns.net/#A/theunlived.art
- Vercel default domain: `the-unlived.vercel.app` (always accessible)

**Environment Variables** (must be set in Vercel Dashboard):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
OPENROUTER_API_KEY=sk-or-v1-[your-key]
NEXT_PUBLIC_APP_URL=https://www.theunlived.art  # ⚠️ Important for SEO
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-X64N5PF0X0
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-9041836440635279
```

**After changing environment variables**: Always redeploy from Vercel dashboard (Settings → Deployments → Redeploy)

### Post-Deploy Verification
```bash
# Test homepage
curl https://www.theunlived.art/

# Test rate limiting (should fail on 11th request in 1 hour)
for i in {1..11}; do curl -X POST https://www.theunlived.art/api/generate -d '{"userText":"test","recipientType":"lover"}'; done

# Check SEO
curl https://www.theunlived.art/sitemap.xml
curl https://www.theunlived.art/robots.txt

# Check DNS resolution
nslookup theunlived.art 8.8.8.8
dig theunlived.art +short
```

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

### ✅ 已完成 (MVP + Compliance)
- [x] 核心功能（写信、AI回复、展览墙）
- [x] 打字机动画
- [x] 图片导出
- [x] 沉浸式加载
- [x] 双层限流保护（降低92%成本风险）
- [x] 内容验证过滤
- [x] SEO优化（Sitemap、Robots.txt、OG标签）
- [x] OG图片（1200x630px）
- [x] 首页动态精选
- [x] 分页加载
- [x] Vercel部署
- [x] Google AdSense 集成（等待审核通过）
- [x] **隐私政策页面** (`/privacy`) - GDPR/CCPA合规
- [x] **使用条款页面** (`/terms`) - 内容许可协议
- [x] **展览提交同意流程** - 强制勾选同意框
- [x] **Google Analytics** - 已完成集成（2025-11-07）
- [x] **动态 Sitemap** - 自动包含所有展览页面（2025-11-08）
- [x] **展览详情页动态 SEO 元数据** - 独特标题和描述（2025-11-08）

### 🚨 紧急待修复 (Critical Issues)
- [x] **网站无法访问问题** - DNS 配置已修复，等待生效（2025-11-08）
  - **问题原因**:
    - Namecheap 域名被封控后重新购买了相同域名
    - DNS 记录需要重新配置
  - **已完成的修复步骤** ✅:
    1. ✅ 在 Cloudflare 中删除旧的 A 记录（216.198.79.1）
    2. ✅ 在 Cloudflare 中添加 CNAME 记录：`@` → `cname.vercel-dns.com`（DNS only）
    3. ✅ 在 Cloudflare 中修改 CNAME 记录：`www` → `cname.vercel-dns.com`（DNS only）
    4. ✅ 在 Namecheap 中设置 Nameserver 指向 Cloudflare（已保存）
    5. ✅ 在 Vercel 中确认自定义域名配置
  - **当前状态** ⏰:
    - Cloudflare DNS 配置：✅ 完成
    - Namecheap Nameserver：✅ 已保存（DNS 服务器更新需 48 小时，通常 10分钟-2小时）
    - Vercel 域名状态：⚠️ Invalid Configuration（等待 DNS 传播生效）
  - **待确认事项** 🔍:
    - [ ] 检查 Vercel Domains 页面，确认 `theunlived.art` 和 `www.theunlived.art` 显示为 **✅ Valid Configuration**
    - [ ] 测试访问 https://www.theunlived.art/ 确认网站可正常打开
    - [ ] 使用 https://www.whatsmydns.net/#CNAME/theunlived.art 检查全球 DNS 传播进度
  - **预计生效时间**: 10分钟 - 2小时（最晚 24 小时）
  - **检查频率**: 每 10-15 分钟在 Vercel 点击「Refresh」按钮检查状态
  - **备用域名**: `the-unlived.vercel.app` (Vercel 默认域名，始终可访问)

### 🔄 可选优化
- [ ] 移动端深度优化
- [ ] Redis持久化限流
- [ ] Cloudflare CDN

---

## 🎨 Key Features & Implementation

### 1. Typewriter Animation
**Location**: [components/ResultPage.tsx](components/ResultPage.tsx:1)
- Character-by-character reveal at 30ms/char
- Blinking cursor effect
- Immersive reading experience

### 2. Immersive Loading States
**Location**: [components/WritePage.tsx](components/WritePage.tsx:1)
- Fullscreen overlay during AI generation
- Rotating messages every 3 seconds
- Examples: "Someone is writing back to you...", "Words are being chosen carefully..."

### 3. Image Export
**Technology**: html2canvas library
- Export AI replies as 2x resolution images
- Preserves letter paper aesthetic
- Shareable on social media

### 4. Exhibition Wall Pagination
**Location**: [components/ExhibitionPage.tsx](components/ExhibitionPage.tsx:1)
- 24 items per page
- "Load More" button for progressive loading
- View count tracking per exhibit

---

## 📝 Critical Files Reference

| File | Purpose | Key Details |
|------|---------|-------------|
| [lib/rateLimit.ts](lib/rateLimit.ts:1) | Dual-layer rate limiting | In-memory IP tracking, hourly+daily limits |
| [app/api/generate/route.ts](app/api/generate/route.ts:1) | AI generation endpoint | 5 prompt templates × 4 languages, OpenRouter integration |
| [app/api/submit-to-exhibition/route.ts](app/api/submit-to-exhibition/route.ts:1) | Publish to exhibition | Creates public record, generates exhibit number |
| [components/WritePage.tsx](components/WritePage.tsx:1) | Letter writing UI | Loading states, error handling, recipient selection |
| [components/ResultPage.tsx](components/ResultPage.tsx:1) | AI reply display | Typewriter animation, image export, submit to exhibition |
| [app/layout.tsx](app/layout.tsx:1) | Root layout | SEO metadata, AdSense script, hydration fix |
| [components/AdSenseAd.tsx](components/AdSenseAd.tsx:1) | Ad display component | Shows ads in production, placeholders in dev |
| [components/GoogleAnalytics.tsx](components/GoogleAnalytics.tsx:1) | GA4 integration | Analytics tracking and event helper functions |
| [ANTI_ABUSE.md](ANTI_ABUSE.md:1) | Abuse prevention docs | Detailed explanation of rate limiting strategy |
| [ADSENSE_SETUP.md](ADSENSE_SETUP.md:1) | AdSense configuration | Complete setup guide for Google AdSense |
| [MVP_OPTIMIZATION.md](MVP_OPTIMIZATION.md:1) | Optimization roadmap | Prioritized improvements and best practices |
| [小白指南-监控与SEO.md](小白指南-监控与SEO.md:1) | 监控与SEO指南 | Google Analytics和SEO优化完整教程（中文） |
| [VERCEL部署指南.md](VERCEL部署指南.md:1) | Vercel配置 | 环境变量和部署详细步骤（中文） |

---

## 🔐 Database Schema (Supabase)

### letters_private
```sql
- id (uuid, primary key)
- user_text (text) - NEVER SHOWN PUBLICLY
- ai_reply (text)
- recipient_type (text)
- is_public (boolean)
- public_letter_id (uuid, nullable)
- created_at (timestamp)
```

### letters_public
```sql
- id (uuid, primary key)
- exhibit_number (text, unique) - Generated via RPC
- ai_reply (text) - ONLY AI text
- recipient_type (text)
- views (integer)
- private_letter_id (uuid)
- created_at (timestamp)
```

**Critical RPC Function**: `generate_exhibit_number()` - Creates unique exhibit IDs

---

## 🚨 Common Pitfalls & Solutions

### When modifying AI prompts:
- ❌ DON'T add motivational language ("you deserve", "be kind to yourself")
- ❌ DON'T make prompts too long (affects response quality)
- ✅ DO maintain the 4-part structure (Shared feeling → Being → Realization → Soft close)
- ✅ DO test with multiple languages (CN/EN/JP/KR)

### When changing rate limits:
- Check [lib/rateLimit.ts](lib/rateLimit.ts:1) for in-memory store implications
- Update both hourly AND daily limits for consistency
- Consider cost impact: Each request ≈ $0.05 via OpenRouter
- Monitor 429 error rates in Vercel logs (should be <1%)

### When adding new routes:
- Add metadata for SEO in page files
- Update [app/sitemap.ts](app/sitemap.ts:1) if route should be indexed
- Consider if route needs rate limiting

---

## 🎯 Future Roadmap (Not Yet Implemented)

### Product Expansion (From [AI情绪博物馆.md](../AI情绪博物馆.md))
- **Phase 2**: Museum of Lost Days (upload photos → AI generates memory stories)
- **Phase 3**: What If You Stayed (describe life choice → AI simulates parallel timeline)

### Monetization Roadmap
- **Current**: Google AdSense (pending approval) - passive income via content page ads
- **Phase 1 (3-6 months)**: Premium Letter Paper Skins 💌
  - **Validation first**: Add analytics to track "Save Image" button click rate
  - **Target metrics**: If click rate > 20% and retention > 3min, proceed to development
  - **Features**:
    - Beautiful letter paper templates (Vintage, Starry Night, Minimal, Watercolor, etc.)
    - Handwritten font styles (English cursive, Chinese calligraphy)
    - Real-time preview before download
    - Pay-per-template or subscription model
  - **Pricing strategy** (for international users):
    - Single template: $0.99
    - Template pack (5 designs): $2.99
    - Premium membership: $4.99/month (unlimited access)
  - **User scenario**: Users writing to deceased loved ones, ex-partners, or past selves have strong "keepsake ritual" needs
  - **Technical approach**:
    - Extend existing `html2canvas` export with CSS overlay layers
    - Integrate Stripe/Lemon Squeezy for payment
    - No impact on free experience (default paper remains beautiful)
  - **Philosophy**: "Emotional keepsakes - pay to preserve your digital letter"
  - **Risk mitigation**: Keep free version beautiful, only upsell gently on result page, never on creation flow

- **Phase 2 (6-12 months)**: Physical Print Service 📮
  - Partner with print-on-demand services
  - Mail physical letter cards to users
  - Pricing: $9.99/letter including worldwide shipping

---

## 🤝 Contributors

- **Product**: susu
- **Development**: Claude (Anthropic)
- **GitHub**: https://github.com/suyfdong/the-unlived
- **Live Site**: https://www.theunlived.art/

---

**Version**: v1.3.1 (MVP + Analytics + SEO + DNS Fix)
**Last Updated**: November 8, 2025

---

## 📚 Additional Documentation

### English Documentation
- [ADSENSE_SETUP.md](ADSENSE_SETUP.md) - Complete Google AdSense integration guide
- [MVP_OPTIMIZATION.md](MVP_OPTIMIZATION.md) - Prioritized optimization roadmap
- [ANTI_ABUSE.md](ANTI_ABUSE.md) - Detailed abuse prevention strategy

### Chinese Documentation (中文文档)
- [SEO行动指南.md](SEO行动指南.md) - **NEW** Complete SEO action plan and timeline (2025-11-08)
- [小白指南-监控与SEO.md](小白指南-监控与SEO.md) - Complete monitoring and SEO guide for beginners
- [VERCEL部署指南.md](VERCEL部署指南.md) - Detailed Vercel deployment and environment setup
- [Sitemap修复指南.md](Sitemap修复指南.md) - Sitemap configuration troubleshooting
- [修复说明.md](修复说明.md) - Google Analytics integration fix explanation
- [AI情绪博物馆.md](../AI情绪博物馆.md) - Original product requirements document

🤖 Generated with [Claude Code](https://claude.com/claude-code)
