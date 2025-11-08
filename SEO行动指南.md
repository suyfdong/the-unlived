# 🚀 SEO 行动指南 - The Unlived Project

**更新时间**: 2025-11-08
**网站**: https://www.theunlived.art/

---

## 📊 当前状态

### ✅ 已完成
- [x] Google Search Console 验证
- [x] Sitemap 提交
- [x] 5 个页面已索引
- [x] 基础 SEO 元数据配置
- [x] Google Analytics 集成

### ⏰ 等待中
- [ ] 在 Google 搜索中出现 (预计 **2-4 周**)
- [ ] Google AdSense 审核通过 (1-2 周)

---

## 🕐 时间线预期

| 阶段 | 时间 | 你能做什么 |
|------|------|-----------|
| **首次索引** | ✅ 已完成 | - |
| **搜索结果出现** | 2-4 周 | 继续发布内容、分享网站 |
| **排名提升** | 1-3 个月 | 持续优化内容、获取外链 |
| **稳定流量** | 3-6 个月 | 保持更新频率 |

⚠️ **不要着急!** 所有新网站都需要这个过程,这是正常的。

---

## 🔍 如何检查收录状态?

### 方法 1: Site 搜索
在 Google 搜索框输入:
```
site:theunlived.art
```

**预期结果**:
- 现在: 可能看到 5-10 个页面
- 1 周后: 应该看到更多展览页面
- 1 个月后: 看到大部分页面

### 方法 2: 直接搜索品牌名
```
The Unlived Project
theunlived.art
unsent letters AI
```

### 方法 3: Google Search Console
登录 https://search.google.com/search-console
- 查看「覆盖率」看已索引页面数
- 查看「效果」看搜索展示次数和点击

---

## ✅ 刚才完成的优化

### 1. 动态 Sitemap ⭐ 重要!
**改进内容**:
- 原来只有 5 个静态页面
- 现在会自动包含所有展览详情页 (`/letters/[id]`)
- 每次有新展览提交,sitemap 会自动更新

**影响**:
- Google 能发现更多页面
- 展览内容能被搜索到
- 增加网站页面数量(有利于 SEO)

### 2. 展览页面动态 SEO 元数据
**改进内容**:
每个展览详情页现在有:
- 独特的标题: "Exhibit #10234 - Letter to Lover"
- 独特的描述: 信件内容前 150 字
- 关键词标签
- Open Graph 图片(社交分享)
- Twitter Card 支持

**影响**:
- 每个展览页面都是独特的 SEO 资产
- 社交媒体分享时有漂亮的卡片
- 更容易被长尾关键词搜索到

---

## 🎯 接下来你应该做的事(按优先级)

### 🔥 高优先级 (立即做)

#### 1. 重新提交 Sitemap
因为刚才更新了 sitemap,需要告诉 Google:

1. 登录 [Google Search Console](https://search.google.com/search-console)
2. 左侧点击「Sitemap」
3. 删除旧的 sitemap (如果有)
4. 输入: `https://www.theunlived.art/sitemap.xml`
5. 点击「提交」

**检查**: 访问 https://www.theunlived.art/sitemap.xml 确认能看到你的展览页面

#### 2. 鼓励用户提交展览
**为什么重要**:
- 更多展览 = 更多可索引页面
- 更多内容 = 更好的 SEO

**行动**:
- 在结果页面加强「Submit to Exhibition」的引导
- 可以考虑在首页展示展览数量统计

#### 3. 社交媒体分享
**在这些平台分享你的网站**:
- Reddit (r/SideProject, r/InternetIsBeautiful)
- Twitter/X
- Hacker News
- Product Hunt
- 小红书 (如果想要中文用户)

**分享技巧**:
```
标题: "I built an AI emotion museum where you can write unsent letters"
链接: https://www.theunlived.art/
描述: 讲述创作动机、技术栈、开发过程
```

### ⚡ 中优先级 (本周内)

#### 4. 创建博客/关于页面内容
在 `/about` 页面添加更多文字内容:
- 项目背后的故事
- 为什么做这个项目
- 如何使用(详细教程)
- 常见问题 FAQ

**SEO 好处**:
- 更多文字内容 = 更多关键词
- Google 喜欢内容丰富的页面

#### 5. 获取外部链接(最重要的 SEO 因素)
**方法**:
- 在 Reddit 分享,让别人链接你
- 提交到网站收藏夹(如 alternativeTo, ProductHunt)
- 写一篇 Medium/Dev.to 文章介绍项目
- 联系 AI/情感健康相关博客,请求报道

**外链清单**:
- [ ] Product Hunt 提交
- [ ] Hacker News Show HN
- [ ] Reddit 5+ 相关社区
- [ ] Medium 文章
- [ ] Dev.to 技术文章

#### 6. 结构化数据(Schema.org)
添加 JSON-LD 结构化数据,帮助 Google 理解你的内容:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "The Unlived Project",
  "description": "AI Emotion Museum",
  "url": "https://www.theunlived.art/"
}
```

### 🔮 低优先级 (未来 1-2 个月)

#### 7. 长尾关键词内容
创建针对特定搜索的内容页面:
- "how to write an unsent letter"
- "closure after breakup"
- "writing to deceased loved ones"

#### 8. 多语言版本
如果想要全球流量:
- 中文版 (潜在用户多)
- 日文版 (情感表达文化契合)
- 韩文版

#### 9. 定期更新首页精选
- 每周更换首页展示的信件
- 增加新鲜度(Google 喜欢更新的网站)

---

## 📈 监控指标

### 每周检查一次

登录 [Google Search Console](https://search.google.com/search-console):

1. **覆盖率(Coverage)**:
   - 已索引页面数是否增长?
   - 有错误吗?

2. **效果(Performance)**:
   - 总点击次数
   - 总展示次数
   - 平均排名位置

3. **哪些关键词带来流量**:
   - 在「效果 > 查询」查看

### Google Analytics

查看:
- 每日用户数
- 流量来源(社交/搜索/直接)
- 用户停留时间
- 跳出率

**目标**:
- 第 1 个月: 100+ 访问
- 第 2 个月: 500+ 访问
- 第 3 个月: 1000+ 访问

---

## 🎯 关键词策略

### 主要关键词(现在排名)
- "The Unlived Project"
- "theunlived.art"

### 目标关键词(希望排名)
- "unsent letters"
- "AI letter reply"
- "emotional closure online"
- "write unsent letter AI"
- "anonymous confessions"
- "emotional healing app"

### 长尾关键词(容易排名)
- "write letter to ex never send"
- "AI emotional support letters"
- "unsent love letter generator"
- "closure letter AI"

**优化方法**:
- 在页面标题、描述中自然使用这些词
- 在展览页面内容中出现
- 在博客文章中使用

---

## ❌ 常见误区(不要做)

### 1. 过度优化
- ❌ 堆砌关键词
- ❌ 购买外链
- ❌ 使用黑帽 SEO 技巧

### 2. 着急
- ❌ 期望 1 周内排名第一
- ❌ 看不到流量就放弃

### 3. 忽视内容质量
- ❌ 只关注 SEO,不关注用户体验
- ❌ 为了 SEO 牺牲网站美观

---

## 💡 快速收录技巧

### 1. 手动请求索引
在 Google Search Console:
1. 顶部输入具体页面 URL
2. 点击「请求编入索引」
3. 等待 1-2 天

**建议索引的页面**:
- 首页
- /exhibition
- 3-5 个优质展览详情页

### 2. 从高权重网站链接
- 在 Reddit 发帖(高权重)
- Medium 文章链接到你的网站
- GitHub README 添加链接

### 3. 社交信号
- Twitter 分享
- Facebook 分享
- LinkedIn 发帖

---

## 🔥 本周行动清单

按重要性排序,建议你**本周**完成:

- [ ] 1. 重新提交更新后的 Sitemap
- [ ] 2. 在 Reddit 3 个社区分享网站
- [ ] 3. 提交到 Product Hunt
- [ ] 4. 完善 /about 页面内容(500+ 字)
- [ ] 5. 写一篇 Medium 文章介绍项目
- [ ] 6. 在首页添加「已收录 X 封信」统计
- [ ] 7. 手动请求索引 5 个重要页面

---

## 📞 需要帮助?

如果有任何问题:
1. 检查 Google Search Console 的「覆盖率」报告
2. 查看是否有爬取错误
3. 确认 sitemap 正确生成: https://www.theunlived.art/sitemap.xml
4. 等待 2-4 周让 Google 完成索引

**记住**: SEO 是一场马拉松,不是短跑。耐心和持续优化是关键! 🚀

---

**下次更新**: 2 周后检查进展
