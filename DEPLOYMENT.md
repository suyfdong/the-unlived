# 🚀 部署指南

## 部署到 Vercel

### 步骤 1: 准备 GitHub 仓库
✅ 已完成 - 代码已推送到: https://github.com/suyfdong/the-unlived

### 步骤 2: 在 Vercel 上导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 找到 `the-unlived` 仓库并点击 "Import"

### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://eteilyxixzvyqdsjywlr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0ZWlseXhpeHp2eXFkc2p5d2xyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjc4ODAsImV4cCI6MjA3NzkwMzg4MH0.h0biXDKJIy9J9YqR7Wy6mLRFbHyFMYBSCDfF0sUnDHk
OPENROUTER_API_KEY=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
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### 步骤 4: 部署
1. 点击 "Deploy"
2. 等待构建完成（2-3分钟）
3. 访问生成的域名测试

## 验证清单
- ✅ 首页加载正常
- ✅ 写信功能正常
- ✅ AI 生成回复正常
- ✅ 展览墙显示正常
- ✅ 导出图片功能正常
