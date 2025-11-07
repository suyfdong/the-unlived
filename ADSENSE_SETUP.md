# Google AdSense 集成配置指南

## 📋 当前状态

✅ **已完成**:
- ads.txt 文件已创建
- AdSense 脚本已集成到 layout.tsx
- 广告位组件已创建（AdSenseAd.tsx）
- 展览详情页广告位已添加
- 展览墙页面广告位已添加

⚠️ **需要你手动配置**:
1. 替换 AdSense 发布商 ID
2. 创建广告单元并获取广告位 ID
3. 更新环境变量
4. 重新部署到 Vercel

---

## 🔧 配置步骤

### 步骤 1: 获取你的 AdSense 发布商 ID

1. 登录 [Google AdSense](https://www.google.com/adsense/)
2. 进入 **账号 > 设置 > 账号信息**
3. 找到你的**发布商 ID**，格式类似：`pub-1234567890123456`

### 步骤 2: 更新 ads.txt 文件

打开 `public/ads.txt`，将占位符替换为你的实际发布商 ID：

```
# 将这一行：
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0

# 替换为（示例）：
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

### 步骤 3: 在 AdSense 创建广告单元

1. 在 AdSense 控制台，进入 **广告 > 按网站 > theunlived.art**
2. 点击 **获取代码** 或 **自动广告**
3. 建议创建 **2个自动广告单元**：
   - **广告单元 1**: 用于展览详情页（`/letters/[id]`）
   - **广告单元 2**: 用于展览墙（`/exhibition`）

4. 创建后，你会获得 **广告位 ID (ad-slot)**，格式类似：`1234567890`

### 步骤 4: 更新代码中的占位符

#### 4.1 更新 `components/AdSenseAd.tsx`

找到第 52 行：
```tsx
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // 第 52 行
```

替换为你的实际发布商 ID：
```tsx
data-ad-client="ca-pub-1234567890123456"
```

#### 4.2 更新 `components/DetailPage.tsx`

找到第 174 行：
```tsx
<AdSenseAd
  adSlot="YOUR_AD_SLOT_1"  // 替换这里
  adFormat="auto"
  fullWidthResponsive={true}
/>
```

替换为你在 AdSense 创建的第一个广告位 ID：
```tsx
<AdSenseAd
  adSlot="1234567890"  // 你的广告位 1 ID
  adFormat="auto"
  fullWidthResponsive={true}
/>
```

#### 4.3 更新 `components/ExhibitionPage.tsx`

找到第 462 行：
```tsx
<AdSenseAd
  adSlot="YOUR_AD_SLOT_2"  // 替换这里
  adFormat="auto"
  fullWidthResponsive={true}
/>
```

替换为你的第二个广告位 ID：
```tsx
<AdSenseAd
  adSlot="0987654321"  // 你的广告位 2 ID
  adFormat="auto"
  fullWidthResponsive={true}
/>
```

### 步骤 5: 配置环境变量（可选，推荐）

在 Vercel 项目设置中添加环境变量：

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
```

然后修改 `app/layout.tsx` 第 60 行使用这个环境变量（已配置，无需修改）。

### 步骤 6: 提交代码并部署

```bash
git add .
git commit -m "feat: integrate Google AdSense"
git push origin main
```

Vercel 会自动部署。

### 步骤 7: 验证 ads.txt

部署完成后，访问：
```
https://www.theunlived.art/ads.txt
```

确保显示你的实际发布商 ID。

### 步骤 8: 在 AdSense 请求审核

1. 回到 AdSense 控制台
2. 点击 **按网站 > theunlived.art**
3. 点击 **请求审核** 或等待自动检测
4. Google 通常需要 **1-2 周**审核你的网站

---

## 📍 广告展示位置

| 页面 | 位置 | 广告位 ID | 文件路径 |
|------|------|-----------|---------|
| 展览详情页 (`/letters/[id]`) | 信件内容下方，推荐信件上方 | YOUR_AD_SLOT_1 | `components/DetailPage.tsx:174` |
| 展览墙 (`/exhibition`) | Load More 按钮下方 | YOUR_AD_SLOT_2 | `components/ExhibitionPage.tsx:462` |

---

## ✅ AdSense 审核要求检查清单

根据你的 MVP，检查以下项目：

### 内容要求
- ✅ 网站有原创内容（AI 生成的回信）
- ✅ 内容符合 AdSense 政策（情感表达，无违规内容）
- ✅ 有足够的内容量（展览墙已有展品）
- ✅ 内容易于导航

### 技术要求
- ✅ 域名已绑定（theunlived.art）
- ✅ HTTPS 已启用（Vercel 默认）
- ⚠️ ads.txt 文件已创建（需要你更新发布商 ID）
- ✅ 网站响应式设计
- ✅ 页面加载速度良好

### 用户体验要求
- ✅ 导航清晰（Navigation 组件）
- ✅ 隐私政策页面（`/privacy`）
- ✅ 关于页面（`/about`）
- ⚠️ 建议添加：联系方式、使用条款

### 流量要求
- ⚠️ 建议在申请前有一定自然流量
- 💡 建议：先推广网站，获得 100+ 日访问后再申请

---

## 🎯 AdSense 最佳实践

### 1. 广告密度
- ✅ **已优化**: 每个页面只放置 1 个广告位
- 不要在首页放置广告（保持用户体验）
- 不要在写信页放置广告（避免打断创作流程）

### 2. 广告位置
- ✅ 展览详情页：内容后（用户阅读完后）
- ✅ 展览墙：底部（不影响浏览）

### 3. 用户体验优先
- ✅ 广告仅在生产环境显示（开发环境显示占位符）
- ✅ 使用 `strategy="afterInteractive"`（不阻塞页面加载）
- ✅ 响应式广告（适配移动端）

### 4. 监控指标（AdSense 控制台）
- **CTR** (点击率): 目标 >1%
- **CPM**: 预计 $1.5-6（欧美流量）
- **页面 RPM**: 监控每千次展示收益
- **无效流量**: 保持 <5%

---

## 🐛 常见问题

### Q1: 部署后广告不显示？

**A**: 检查以下项目：
1. 确认已替换所有占位符（`pub-XXXXXXXX` 和 `YOUR_AD_SLOT_X`）
2. 确认 AdSense 账号已审核通过
3. 打开浏览器控制台，查看是否有 AdSense 相关错误
4. 等待 10-30 分钟（AdSense 有缓存延迟）

### Q2: 审核被拒绝？

**A**: 常见原因：
- 内容不足：增加展览内容（建议 >30 条）
- 流量太低：推广网站，获得自然流量
- 违反政策：检查是否有敏感内容（需要内容审核）

### Q3: ads.txt 显示 404？

**A**: 确保：
1. `public/ads.txt` 文件存在
2. 已提交代码并部署到 Vercel
3. 清除浏览器缓存或使用无痕模式测试

### Q4: 收益很低？

**A**: 优化方向：
- 提升流量（SEO、社交媒体推广）
- 提升停留时间（优质内容）
- 优化广告位置（A/B 测试）
- 吸引欧美流量（CPM 更高）

---

## 📊 预期收益估算（仅供参考）

基于文档目标：

| 月流量 | 页面浏览量 (PV) | 广告展示 | 预计收益 (CPM $3) |
|--------|----------------|---------|------------------|
| 5,000 访问 | 15,000 PV | 15,000 | $45/月 |
| 50,000 访问 | 150,000 PV | 150,000 | $450/月 |
| 100,000 访问 | 300,000 PV | 300,000 | $900/月 |

**注意**: 实际收益取决于：
- 流量来源地域（欧美 > 亚洲）
- CTR（点击率）
- 内容类别
- 季节性波动

---

## 🎨 其他 MVP 优化建议

### 必需项（影响 AdSense 审核）

#### 1. **创建 OG 图片** ⚠️ 重要
当前 `layout.tsx` 引用了 `/og-image.png`，但文件不存在。

**建议**:
- 尺寸: 1200x630px
- 内容: 网站名称 + Slogan + 视觉元素
- 保存到: `public/og-image.png`
- 工具: Canva、Figma、或 AI 生成

#### 2. **完善隐私政策页面**
AdSense 要求明确的隐私政策，需要包含：
- ✅ 用户数据收集说明（已在 CLAUDE.md 中说明）
- ⚠️ 添加：Google AdSense Cookie 使用说明
- ⚠️ 添加：Google Analytics（如果使用）

**建议添加到 `/privacy` 页面**:
```
## 广告和 Cookie

本网站使用 Google AdSense 展示广告。Google 可能会使用 Cookie
来根据用户先前对本网站或其他网站的访问记录展示相关广告。

您可以通过访问 Google 的广告设置停用个性化广告。
```

#### 3. **添加 Google Analytics**（可选但推荐）
用于监控流量和用户行为：
- 了解用户来源
- 优化 SEO
- 监控跳出率
- 追踪转化率（生成回信 → 提交展览）

---

## 📝 快速配置检查清单

部署前，确保完成：

- [ ] 更新 `public/ads.txt` 中的发布商 ID
- [ ] 更新 `components/AdSenseAd.tsx` 中的 `data-ad-client`
- [ ] 更新 `components/DetailPage.tsx` 中的 `adSlot`
- [ ] 更新 `components/ExhibitionPage.tsx` 中的 `adSlot`
- [ ] （可选）在 Vercel 添加 `NEXT_PUBLIC_ADSENSE_CLIENT_ID` 环境变量
- [ ] 创建 `public/og-image.png` (1200x630px)
- [ ] 提交代码并部署
- [ ] 验证 `https://www.theunlived.art/ads.txt` 可访问
- [ ] 在 AdSense 控制台提交审核

---

## 🚀 下一步行动

1. **立即执行**:
   - 替换 AdSense 发布商 ID 和广告位 ID
   - 部署到生产环境
   - 验证 ads.txt

2. **审核通过前**:
   - 创建 OG 图片
   - 完善隐私政策
   - 推广网站，获得自然流量（建议 100+ 日访问）

3. **审核通过后**:
   - 监控 AdSense 控制台数据
   - 优化广告位置（如果 CTR 太低）
   - 添加 Google Analytics 跟踪
   - 考虑 Phase 2 开发（Museum of Lost Days）

---

## 📚 相关文档

- [Google AdSense 帮助](https://support.google.com/adsense/)
- [AdSense 计划政策](https://support.google.com/adsense/answer/48182)
- [ads.txt 指南](https://support.google.com/adsense/answer/7532444)

---

**最后更新**: 2025-11-07
**版本**: v1.0.0

🤖 Generated with [Claude Code](https://claude.com/claude-code)
