# 🚀 一键部署到 Vercel 指南

## 方法一：通过 Vercel 网站部署（推荐，最简单）

### 步骤 1：访问 Vercel
打开浏览器访问：**https://vercel.com**

### 步骤 2：登录/注册
- 点击右上角 **"Sign Up"** 或 **"Login"**
- 选择 **"Continue with GitHub"** （用 GitHub 账号登录）
- 授权 Vercel 访问你的 GitHub 账户

### 步骤 3：导入项目
1. 登录后，点击 **"Add New..."** 按钮
2. 选择 **"Project"**
3. 在 "Import Git Repository" 页面，找到 **"suyfdong/the-unlived"** 仓库
4. 点击 **"Import"** 按钮

### 步骤 4：配置项目（通常无需修改）
Vercel 会自动检测到这是一个 Next.js 项目，并自动填写：

- **Framework Preset**: Next.js ✅（自动检测）
- **Root Directory**: `./` ✅（默认）
- **Build Command**: `npm run build` ✅（自动）
- **Output Directory**: `.next` ✅（自动）
- **Install Command**: `npm install` ✅（自动）

> 💡 **好消息**：Next.js 项目在 Vercel 上是零配置的！

### 步骤 5：部署
1. 确认配置无误后，点击 **"Deploy"** 按钮
2. 等待 2-3 分钟，Vercel 会：
   - 安装依赖
   - 构建项目
   - 部署到全球 CDN
3. 看到 🎉 **"Congratulations!"** 页面就成功了！

### 步骤 6：访问你的网站
- Vercel 会自动分配一个域名，格式类似：
  - `https://the-unlived.vercel.app`
  - 或 `https://the-unlived-suyfdong.vercel.app`
- 点击 **"Visit"** 按钮即可查看你的网站！

---

## 方法二：通过 Vercel CLI 部署（开发者推荐）

### 步骤 1：安装 Vercel CLI
```bash
npm install -g vercel
```

### 步骤 2：登录
```bash
vercel login
```
按照提示使用 GitHub 账号登录

### 步骤 3：部署
在项目目录中运行：
```bash
vercel
```

按照提示操作：
- `Set up and deploy "~/the-unlived"?` → **Y**
- `Which scope do you want to deploy to?` → 选择你的账号
- `Link to existing project?` → **N** (第一次部署)
- `What's your project's name?` → **the-unlived** (或按 Enter 使用默认)
- `In which directory is your code located?` → **./** (按 Enter)

等待部署完成，会显示：
```
✅  Production: https://the-unlived.vercel.app
```

### 步骤 4：后续部署
以后每次修改代码后，只需运行：
```bash
vercel --prod
```

---

## 自动部署设置

一旦连接成功，**每次推送到 GitHub 都会自动部署**！

### 自动部署流程：
1. 你修改代码
2. `git add .`
3. `git commit -m "更新说明"`
4. `git push origin main`
5. ✨ Vercel 自动检测并部署（1-2分钟）

### 查看部署状态：
访问 Vercel Dashboard：https://vercel.com/dashboard

---

## 绑定自定义域名

### 步骤 1：进入项目设置
1. 在 Vercel Dashboard 中，点击你的项目
2. 点击顶部的 **"Settings"** 标签
3. 点击左侧的 **"Domains"**

### 步骤 2：添加域名
1. 输入你的域名（如 `theunlived.com`）
2. 点击 **"Add"**
3. Vercel 会显示 DNS 配置说明

### 步骤 3：配置 DNS
在你的域名注册商处添加以下记录：

**方式 A：使用 A 记录**
```
类型: A
名称: @
值: 76.76.21.21
```

**方式 B：使用 CNAME 记录**
```
类型: CNAME
名称: @
值: cname.vercel-dns.com
```

### 步骤 4：等待生效
- DNS 配置通常需要 10 分钟到 48 小时生效
- Vercel 会自动配置 HTTPS 证书

---

## 环境变量配置（未来使用）

当你需要添加 Supabase 或其他 API 密钥时：

### 步骤 1：进入环境变量设置
1. 项目页面 → **Settings** → **Environment Variables**

### 步骤 2：添加变量
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: 你的 Supabase URL
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- 点击 **"Save"**

### 常用环境变量：
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
OPENAI_API_KEY=sk-xxx...
```

> ⚠️ **注意**：以 `NEXT_PUBLIC_` 开头的变量会暴露给客户端，敏感信息不要加这个前缀！

---

## 部署预览（Preview Deployments）

### 特性
- 每个 Pull Request 都会自动生成预览环境
- 每个 git 分支都有独立的预览 URL
- 适合测试新功能

### 如何使用
1. 创建新分支：`git checkout -b feature/new-feature`
2. 推送到 GitHub：`git push origin feature/new-feature`
3. Vercel 自动生成预览 URL（如 `the-unlived-git-feature-xxx.vercel.app`）

---

## 性能优化建议

Vercel 会自动优化，但你可以：

### 1. 检查性能
访问：https://pagespeed.web.dev/
输入你的 Vercel URL 检查性能

### 2. 启用 Analytics（可选）
在 Vercel Dashboard：
- 项目 → **Analytics**
- 免费计划包含基础分析

### 3. 查看构建日志
- 项目 → **Deployments**
- 点击任意部署查看详细日志

---

## 故障排除

### 部署失败？
1. 检查 Vercel 的部署日志（Deployments → 点击失败的部署）
2. 确认本地构建成功：`npm run build`
3. 检查 `package.json` 中的依赖版本

### 页面 404？
1. 确认文件路径正确（Next.js 对大小写敏感）
2. 检查 `app/` 目录结构
3. 查看 Vercel 的 "Functions" 标签，确认路由生成

### 样式丢失？
1. 确认 `app/layout.tsx` 中导入了 `globals.css`
2. 检查 Tailwind 配置
3. 清除 Vercel 缓存：Settings → General → Clear Cache

---

## 快速链接

- **Vercel 官网**: https://vercel.com
- **你的项目**: https://github.com/suyfdong/the-unlived
- **Vercel 文档**: https://vercel.com/docs
- **Next.js 文档**: https://nextjs.org/docs

---

## 🎉 恭喜！

你的项目现在已经：
- ✅ 部署到全球 CDN
- ✅ 自动 HTTPS 证书
- ✅ 自动部署（每次 push）
- ✅ 零配置运维
- ✅ 无限带宽（免费版）

享受你的 AI 情绪博物馆吧！ 💌
