# Deployment Guide

## Deploying to Vercel (Recommended)

Vercel是 Next.js 的最佳部署平台，提供零配置部署。

### 步骤：

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Migrate to Next.js"
   git push origin main
   ```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的 `the-unlived` 仓库
   - Vercel 会自动检测 Next.js 项目

3. **配置构建设置**
   - Framework Preset: Next.js (自动检测)
   - Build Command: `npm run build` (默认)
   - Output Directory: `.next` (默认)
   - Install Command: `npm install` (默认)

4. **环境变量 (如果需要)**
   在 Vercel 项目设置中添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL` (未来添加)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (未来添加)
   - 其他 API 密钥

5. **部署**
   - 点击 "Deploy"
   - Vercel 会自动构建并部署你的应用
   - 每次推送到 GitHub 都会自动重新部署

## 本地测试生产构建

在部署前，你应该本地测试生产构建：

```bash
npm run build
npm start
```

访问 http://localhost:3000 查看生产版本

## 故障排除

### 构建失败

1. 确保所有依赖已安装：
   ```bash
   rm -rf node_modules
   npm install
   ```

2. 清除缓存：
   ```bash
   rm -rf .next
   npm run build
   ```

### 路由问题

确保所有页面都有正确的文件结构：
- `app/page.tsx` - 首页
- `app/write/page.tsx` - 写信页
- `app/exhibition/page.tsx` - 展览页
- `app/about/page.tsx` - 关于页
- `app/result/page.tsx` - 结果页
- `app/letters/[id]/page.tsx` - 动态详情页

### 性能优化

1. **图片优化**: 使用 Next.js `<Image>` 组件
2. **字体优化**: 已通过 CSS @import 加载 Google Fonts
3. **代码分割**: Next.js 自动处理
4. **静态生成**: 大部分页面已预渲染为静态内容

## 自定义域名

在 Vercel 项目设置中：
1. 进入 "Domains"
2. 添加你的自定义域名
3. 按照 DNS 配置说明操作
