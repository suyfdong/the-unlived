# 🗺️ Sitemap 修复指南

## ❌ 问题

Google Search Console 显示：
- ✅ 站点地图可读取（已发现5个网页）
- ❌ **但存在错误**："此位置的 Sitemap 不允许此网址"

**原因**：Sitemap 中的网址是 `https://the-unlived.vercel.app`，但实际域名是 `https://www.theunlived.art`

---

## ✅ 解决方案

### 步骤1：在 Vercel 更新环境变量

#### 1.1 登录 Vercel
- 访问 https://vercel.com/
- 找到项目 `the-unlived`

#### 1.2 进入环境变量设置
- 点击项目名称进入项目页面
- 点击顶部菜单的 **「Settings」**
- 左侧菜单点击 **「Environment Variables」**

#### 1.3 找到并编辑 NEXT_PUBLIC_APP_URL
在环境变量列表中，找到：
```
NEXT_PUBLIC_APP_URL
```

当前值可能是：
```
https://the-unlived.vercel.app
```

**点击右侧的三个点 `...` → 选择「Edit」**

#### 1.4 修改为正确的域名
将值修改为：
```
https://www.theunlived.art
```

**重要**：
- 不要带尾部斜杠 `/`
- 确保是 `https://` 开头
- 确保是 `www.theunlived.art`（你实际使用的域名）

#### 1.5 保存
点击 **「Save」** 保存

---

### 步骤2：重新部署（必须！）

**环境变量修改后不会立即生效，必须重新部署！**

#### 2.1 进入部署页面
- 点击顶部菜单的 **「Deployments」**

#### 2.2 重新部署最新版本
- 找到最新的部署（列表第一条）
- 点击右侧的三个点 `...`
- 选择 **「Redeploy」**
- 确认弹窗中再次点击 **「Redeploy」**

#### 2.3 等待部署完成
- 状态从 `Building...` 变成 ✅ `Ready`
- 通常需要 **1-2 分钟**

---

### 步骤3：验证 Sitemap 是否修复

#### 3.1 检查 Sitemap 内容
部署完成后，在浏览器访问：
```
https://www.theunlived.art/sitemap.xml
```

#### 3.2 确认网址正确
你应该看到所有网址都是：
```xml
<url>
  <loc>https://www.theunlived.art</loc>
  ...
</url>
<url>
  <loc>https://www.theunlived.art/write</loc>
  ...
</url>
<url>
  <loc>https://www.theunlived.art/exhibition</loc>
  ...
</url>
```

**如果还是 `the-unlived.vercel.app`，说明：**
- 环境变量没保存成功
- 或者没有重新部署

---

### 步骤4：重新提交到 Google Search Console

#### 4.1 访问 Google Search Console
- 打开 https://search.google.com/search-console/

#### 4.2 删除旧的 Sitemap（可选）
- 左侧菜单：**「站点地图」**
- 找到 `sitemap.xml`
- 点击右侧的三个点 → **「删除站点地图」**

#### 4.3 重新提交
- 在"添加新的站点地图"输入框中输入：
  ```
  sitemap.xml
  ```
- 点击 **「提交」**

#### 4.4 等待处理
- 状态会显示"已提交"
- 几小时后变成"成功"
- 不会再显示错误

---

## 🔍 如何验证成功？

### 立即验证（部署后）
访问 `https://www.theunlived.art/sitemap.xml`，所有网址应该是：
- ✅ `https://www.theunlived.art/`
- ✅ `https://www.theunlived.art/write`
- ✅ `https://www.theunlived.art/exhibition`
- ✅ `https://www.theunlived.art/about`
- ✅ `https://www.theunlived.art/privacy`

### 24小时后验证
在 Google Search Console：
- 左侧菜单：**「站点地图」**
- 找到 `sitemap.xml`
- 状态应该显示 ✅ **成功**
- 不会有错误信息

---

## ⚠️ 常见问题

### Q1: 修改了环境变量，但 Sitemap 还是旧网址？
**A**: 记得重新部署！环境变量修改后必须 Redeploy。

### Q2: 重新部署后还是不对？
**A**:
1. 检查 Vercel 环境变量是否真的保存了
2. 确认修改的是 `Production` 环境
3. 清除浏览器缓存后再访问 sitemap.xml

### Q3: Google Search Console 还是显示错误？
**A**:
1. 等待 24 小时让 Google 重新抓取
2. 或者删除旧的 sitemap，重新提交

### Q4: 我有多个环境变量要改吗？
**A**: 只需要改 `NEXT_PUBLIC_APP_URL` 一个变量就可以了。

---

## ✅ 检查清单

部署前：
- [ ] 在 Vercel 找到 `NEXT_PUBLIC_APP_URL`
- [ ] 修改为 `https://www.theunlived.art`
- [ ] 点击 Save 保存
- [ ] 点击 Redeploy 重新部署

部署后：
- [ ] 访问 `https://www.theunlived.art/sitemap.xml`
- [ ] 确认所有网址都是 `www.theunlived.art`
- [ ] 在 Google Search Console 重新提交 sitemap
- [ ] 等待 24 小时查看是否还有错误

---

## 🎯 预期结果

修复成功后：
- ✅ Sitemap 中所有网址都是 `https://www.theunlived.art/...`
- ✅ Google Search Console 显示"成功"（无错误）
- ✅ Google 开始正确收录你的网站
- ✅ 1-2 周后网站出现在 Google 搜索结果中

---

**按照这个指南操作，问题一定能解决！** 💪

如果遇到任何问题，随时找我！
