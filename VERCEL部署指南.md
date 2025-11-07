# 🚀 Vercel 部署指南 - Google Analytics 配置

> 最后更新：2025-11-07
> 你的测量ID：**G-X64N5PF0X0**

---

## ✅ 本地配置已完成

我已经帮你在本地 `.env.local` 文件中添加了Google Analytics ID：

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-X64N5PF0X0
```

---

## 🌐 Vercel 生产环境配置（必做）

**重要：本地配置只在你自己电脑上生效。要让线上网站收集访客数据，必须在 Vercel 添加环境变量！**

---

### 📋 详细步骤（跟着截图操作）

#### 第1步：登录 Vercel

1. 访问 https://vercel.com/
2. 使用你的账号登录（应该是用GitHub登录的）

---

#### 第2步：找到你的项目

1. 登录后，你会看到项目列表
2. 找到项目：**`the-unlived`**
3. 点击项目名称，进入项目详情页

---

#### 第3步：进入设置页面

1. 在项目页面，点击顶部菜单栏的 **「Settings」**（设置）
2. 左侧菜单中，点击 **「Environment Variables」**（环境变量）

---

#### 第4步：添加新变量

1. 点击右上角的 **「Add New」** 按钮（或「Add」按钮）
2. 会弹出一个表单，填写以下信息：

---

### 📝 填写内容（一字不差地复制）

| 字段 | 填写内容 |
|------|---------|
| **Key** (变量名) | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| **Value** (值) | `G-X64N5PF0X0` |
| **Environment** (环境) | ✅ 勾选 **Production** |

**重要提示：**
- Key 必须是 `NEXT_PUBLIC_GA_MEASUREMENT_ID`（区分大小写）
- Value 是 `G-X64N5PF0X0`（你的测量ID）
- Environment 只勾选 Production（生产环境）就够了

---

#### 第5步：保存

1. 检查填写是否正确
2. 点击 **「Save」** 按钮

你会看到环境变量列表中多了一条：
```
NEXT_PUBLIC_GA_MEASUREMENT_ID: G-X64N5PF0X0
```

---

#### 第6步：重新部署（关键！）

**添加环境变量后，必须重新部署才能生效！**

1. 点击顶部菜单栏的 **「Deployments」**（部署）
2. 找到最新的部署（列表第一条）
3. 点击右侧的 **三个点** `⋯`
4. 在下拉菜单中选择 **「Redeploy」**（重新部署）
5. 会弹出确认对话框，再次点击 **「Redeploy」** 确认

---

#### 第7步：等待部署完成

1. 部署通常需要 **1-2分钟**
2. 你会看到部署状态：`Building...` → `Ready`
3. 当状态变成 ✅ **Ready** 时，说明部署成功

---

## 🎯 如何验证配置成功？

### 方法1：查看网站源代码

1. 打开你的网站：https://www.theunlived.art/
2. 右键 → 「查看网页源代码」（或按 `Ctrl+U` / `Cmd+U`）
3. 按 `Ctrl+F` / `Cmd+F` 搜索：`G-X64N5PF0X0`
4. 如果找到了，说明配置成功！✅

你应该能看到类似这样的代码：
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-X64N5PF0X0"></script>
```

---

### 方法2：使用浏览器开发者工具

1. 打开你的网站：https://www.theunlived.art/
2. 按 `F12` 打开开发者工具
3. 切换到 **「Network」**（网络）标签
4. 刷新页面（`F5`）
5. 在网络请求列表中搜索：`gtag`
6. 如果看到请求 `gtag/js?id=G-X64N5PF0X0`，说明成功！✅

---

### 方法3：Google Analytics 实时报告（最准确）

1. 访问 https://analytics.google.com/
2. 选择你的网站属性
3. 左侧菜单点击 **「报告」→「实时」**
4. 打开新标签页访问你的网站：https://www.theunlived.art/
5. 回到 Google Analytics，等待 5-10 秒
6. 如果 **「过去 30 分钟的用户」** 显示有 1 个用户（就是你自己），说明配置成功！✅

---

## 🎊 完成！

配置成功后，Google Analytics 将开始自动收集以下数据：

### 📊 自动收集的数据
- ✅ 页面浏览量（Page Views）
- ✅ 访问用户数（Users）
- ✅ 用户来源（Traffic Source）
- ✅ 地理位置（Country/City）
- ✅ 设备类型（Desktop/Mobile）
- ✅ 浏览器类型（Chrome/Safari/Firefox）

### 🎯 自定义事件追踪
我已经帮你配置好了9个关键事件：

1. **generate_letter_start** - 用户点击生成按钮
2. **generate_letter_success** - AI回信生成成功
3. **generate_letter_error** - 生成失败
4. **generate_letter_rate_limited** - 触发限流
5. **copy_letter_text** - 复制文本
6. **save_letter_image** - 保存图片
7. **submit_to_exhibition_start** - 开始提交展览
8. **submit_to_exhibition_success** - 提交成功
9. **submit_to_exhibition_error** - 提交失败

---

## 📈 何时能看到数据？

| 数据类型 | 延迟时间 |
|---------|---------|
| **实时报告** | 5-10秒（立即可见） |
| **基础报告** | 24-48小时 |
| **事件数据** | 24-48小时 |
| **完整数据** | 72小时 |

---

## 🆘 常见问题

### Q1: 我添加了环境变量，但网站还是没有追踪代码？
**A**: 记得重新部署！添加环境变量后必须 Redeploy。

### Q2: 实时报告显示0用户，是不是失败了？
**A**:
1. 确认你访问的是 https://www.theunlived.art/（生产环境）
2. 确认不是用隐私浏览模式（无痕模式）
3. 确认没有安装广告拦截插件（如AdBlock）
4. 等待5-10秒，Google Analytics有延迟

### Q3: 我能在本地开发环境看到数据吗？
**A**: 不能。为了避免污染生产数据，我配置的是只在生产环境（Vercel部署的网站）加载Google Analytics。

### Q4: 如何查看事件数据？
**A**:
1. 登录 https://analytics.google.com/
2. 左侧菜单：「报告」→「参与度」→「事件」
3. 24-48小时后可以看到事件列表

---

## 📞 需要帮助？

如果配置过程中遇到问题，可以：
1. 检查上面的验证方法
2. 截图给我看报错信息
3. 告诉我具体在哪一步卡住了

---

## ✅ 检查清单

在关闭这个文档前，确认你已经完成：

- [ ] 在 Vercel 添加了环境变量 `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- [ ] 环境变量的值是 `G-X64N5PF0X0`
- [ ] 勾选了 Production 环境
- [ ] 点击了 Save 保存
- [ ] 重新部署了网站（Redeploy）
- [ ] 等待了 1-2 分钟部署完成
- [ ] 验证了网站源代码中有追踪脚本
- [ ] 在 Google Analytics 实时报告中看到了自己的访问

**全部打勾？恭喜你，配置完成！** 🎉

---

**祝你的网站流量节节高升！** 📈
