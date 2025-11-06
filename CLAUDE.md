# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Quick Start for New Claude Instances

**Project**: The Unlived Project - AI-powered emotional museum (未寄出的信)

**Tech Stack**: Next.js 16 App Router + TypeScript + Tailwind + Framer Motion + Supabase

**Current Status (2025-11-06)**:
- ✅ MVP fully functional (write letters, AI replies, exhibition wall)
- ✅ Performance optimized (10x faster compilation, no flashing, fast loading)
- ✅ Six paper styles system implemented
- ✅ Coffee shop casual style achieved

**Critical Performance Rules**:
1. **NEVER** use Tailwind arbitrary classes like `shadow-[...]` - use standard classes only
2. **ALWAYS** add `initial` prop to Framer Motion animations to prevent flashing
3. **ALWAYS** use `.limit()` on Supabase queries

**Read these sections first if working on**:
- Performance issues → [已解决的核心问题](#已解决的核心问题--2025-11-06-session-2)
- Animation problems → [性能优化模式总结](#性能优化模式总结)
- Navigation/routing → [Navigation Pattern](#navigation-pattern)

---

## Project Overview

**The Unlived Project** is an AI-powered emotional museum where users write unsent letters and receive AI-generated empathetic replies. The project was recently migrated from Vite + React SPA to Next.js App Router architecture for better SEO, performance, and deployment on Vercel.

## Development Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build (required before deployment)
npm run build

# Run production build locally
npm start

# Lint code
npm run lint
```

## Architecture & Key Patterns

### Client vs Server Components

This project uses Next.js 16 App Router. **Important distinction**:

- **All page components** (`app/*/page.tsx`) are Server Components by default - they just import client components
- **All interactive components** (`components/*.tsx`) are Client Components marked with `'use client'` directive
- Client components handle all user interactions, animations (Framer Motion), and browser APIs

### Navigation Pattern

The project uses Next.js routing, not client-side state management:

- **Links**: Use `<Link>` from `next/link` for navigation
- **Programmatic navigation**: Use `useRouter()` from `next/navigation`
- **Current route**: Use `usePathname()` from `next/navigation`
- **NO `onClick` navigation callbacks** - the old Vite SPA pattern has been removed

Example pattern used throughout:
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Component() {
  const pathname = usePathname();
  return <Link href="/write">Navigate</Link>
}
```

### Page Structure Pattern

Every route follows this structure:
```tsx
// app/*/page.tsx (Server Component)
import ComponentName from '@/components/ComponentName'
import Navigation from '@/components/Navigation'

export default function Page() {
  return (
    <>
      <Navigation />
      <ComponentName />
    </>
  )
}
```

The Navigation component is included in every page (not in layout) to allow pathname detection.

### Dynamic Routes

- Letter details use dynamic routing: `app/letters/[id]/page.tsx`
- The `[id]` parameter is passed to components via props:
  ```tsx
  export default function Page({ params }: { params: { id: string } }) {
    return <DetailPage id={params.id} />
  }
  ```

### Import Paths

TypeScript is configured with path alias `@/*` pointing to project root:
```tsx
import HomePage from '@/components/HomePage'  // ✅ Correct
import HomePage from '../components/HomePage' // ❌ Avoid relative imports
```

### Styling Architecture

- **Tailwind CSS** for all styling - no CSS modules or styled-components
- **Google Fonts** imported in `app/globals.css` via `@import` (must be first line)
- **Custom animations** defined in globals.css (`@keyframes`)
- **Framer Motion** for complex animations (all components use it extensively)
- **Color scheme**: Cyan/blue gradients (`#00D4FF`, `#A7FF83`, `#FFB347`) on dark backgrounds

### Component Patterns

All interactive components share these patterns:

1. **'use client' directive** at the very top
2. **Framer Motion** for animations (`motion.div`, `whileHover`, etc.)
3. **State management** via `useState` - no global state
4. **Responsive design** - mobile-first with `md:` breakpoints
5. **Accessibility** - semantic HTML, proper ARIA labels

### Data Flow (Planned)

Currently static UI. When backend integration happens:

- Supabase client library is already installed (`@supabase/supabase-js`)
- Environment variables should use `NEXT_PUBLIC_` prefix for client-side access
- API routes can be added in `app/api/` directory

## Build Configuration

### TypeScript

- Uses `moduleResolution: "bundler"` (Next.js 16 default)
- Path alias configured: `"@/*": ["./*"]`
- Strict mode enabled
- Auto-configured by Next.js on first build

### Next.js Config

- ESM format (`export default`) due to `"type": "module"` in package.json
- React strict mode enabled
- Currently minimal config - extend as needed

### Tailwind Config

**Note**: The current `tailwind.config.js` references old Vite paths. It should be updated to:
```js
content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}']
```

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel:

1. Connect GitHub repo to Vercel
2. Zero configuration needed - auto-detected as Next.js
3. Auto-deploy on every push to main
4. See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed Chinese instructions

### Build Validation

Always test production build locally before deploying:
```bash
npm run build  # Should complete without errors
npm start      # Test at http://localhost:3000
```

## File Organization

- `app/` - Next.js App Router pages (one folder per route)
- `components/` - All React components (shared across routes)
- `public/` - Static assets (images, cursor SVGs, etc.)
- `app/globals.css` - Global styles and Tailwind directives

## Migration Notes

This project was migrated from Vite to Next.js. When working on it:

- No more Vite config files (removed: `vite.config.ts`, `index.html`, `src/` directory)
- Old pattern (removed): `onNavigate` callback props for navigation
- New pattern: Direct Next.js `Link` and `useRouter()` usage
- All components were converted to work with App Router

## Common Gotchas

1. **CSS @import order**: Font imports must be before `@tailwind` directives
2. **'use client' placement**: Must be the very first line (before imports)
3. **Dynamic imports**: Framer Motion works fine with 'use client', no need for dynamic imports
4. **ESM config files**: Use `export default` not `module.exports` in config files
5. **Case sensitivity**: Next.js routes are case-sensitive in production
6. **Tailwind custom classes**: AVOID `shadow-[...]` arbitrary values - they slow compilation dramatically. Use standard classes instead.
7. **Framer Motion initial states**: ALWAYS add `initial` prop to prevent flashing on page load
8. **Database queries**: Add `.limit()` to Supabase queries to avoid loading excessive data

---

## Recent Work (2025-11-06)

### Completed Tasks ✅

#### 1. 中文AI回复优化 (Chinese AI Response Optimization)
**问题**: AI生成的中文回复结尾出现"轻轻地"等生硬的副词，不够自然
**解决方案**:
- 在 [app/api/generate/route.ts](app/api/generate/route.ts) 中添加了语言检测功能
- 根据文本中中文字符占比 (>30%) 自动切换到中文专属提示词
- 明确指导AI避免使用生硬的副词结尾，提供自然的中文结尾示例（"还是会想起你"、"就这样吧"、"…"等）

**关键代码**:
```typescript
const chineseCharCount = (userText.match(/[\u4e00-\u9fa5]/g) || []).length;
const isChinese = chineseCharCount / totalCharCount > 0.3;

const languageGuidance = isChinese
  ? `请用中文回复。回复要真实、温暖、不做作... 避免生硬的副词结尾(如"轻轻地"、"静静地")`
  : `Write in English...`;
```

#### 2. 多语言种子数据生成 (Multilingual Seed Data)
**目的**: 让展览墙预先填充多样化的展览信件，使网站看起来活跃、有人气

**实现**:
- 创建 [scripts/seed-exhibition.ts](scripts/seed-exhibition.ts) 脚本
- 生成20封不同语言的展览信件：
  - 简体中文 (5封)
  - 繁体中文 (3封)
  - 英语 (6封)
  - 日语 (3封)
  - 韩语 (3封)
- 包含各种收信人类型 (lover, friend, family, stranger, future-self)
- 随机浏览量 (200-700次)

**使用方法**:
```bash
npm run seed  # 运行种子数据填充脚本
```

**注意**: 脚本中手动加载了 `.env.local` 文件来解决环境变量问题

#### 3. 展览墙视觉风格大改版 (Exhibition Wall Redesign)
**用户需求**: "展览墙略微的严肃，过于排版工整" → 希望变成像咖啡馆/酒馆墙壁那样随意、温暖、有叠加感的情绪墙

**实现的功能**:
- **瀑布流布局**: 使用CSS columns实现Pinterest风格的自然排列
- **随机倾斜和缩放**: 每张信件根据ID生成确定性随机的旋转角度(-6°至+6°)和大小(0.92-1.08)
- **视觉层叠**: Z-index偏移创造信件叠加效果
- **六种纸张样式系统**:
  1. **sticky-note** (便签纸): 浅色背景，柔和阴影
  2. **postcard** (明信片): 双边框效果
  3. **torn-paper** (撕边纸张): 上下两侧有不规则撕裂边缘
  4. **kraft-paper** (牛皮纸): 棕黄色调，纹理叠层
  5. **lined-paper** (横线笔记纸): 左侧红线 + 横向蓝色线条
  6. **tracing-paper** (描图纸): 半透明模糊效果

**关键代码位置**: [components/ExhibitionPage.tsx](components/ExhibitionPage.tsx)

**实现细节**:
```typescript
// 确定性随机生成系统
const getPaperStyle = (id: string) => {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const styleIndex = seed % 6;
  return styles[styleIndex];
};

// 信件随机倾斜和大小
const getCardStyle = (id: string) => {
  // 基于ID的确定性随机，确保每次渲染一致
  const rotation = random(-6, 6);
  const scale = random(0.92, 1.08);
  const zOffset = Math.floor(random(0, 5, 100));
  return { rotation, scale, zOffset };
};
```

#### 4. 修复 HomePage 水合错误
- 解决了 `Math.random()` 导致的服务端/客户端不匹配问题
- 使用 `useState` + `useEffect` 确保随机内容只在客户端生成

---

### 已解决的核心问题 ✅ (2025-11-06 Session 2)

#### 1. Tailwind 编译性能灾难 (378.6s → 38s)

**问题根因**: 使用了大量自定义 Tailwind 类 `shadow-[...]` 和复杂的 SVG data URI 背景
```typescript
// ❌ 导致极慢编译的代码模式
shadow: 'shadow-[0_8px_16px_-4px_rgba(101,67,33,0.3),0_4px_8px_rgba(139,69,19,0.2)]'
backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100'...")`
```

**解决方案**:
- 全部改用 Tailwind 标准类名 (`shadow-xl`, `shadow-2xl`)
- 移除复杂 SVG 背景，改用简单的半透明层 (`bg-slate-900/5`)
- 简化牛皮纸从 5 层渐变到 2 层
- 移除撕边纸的复杂 `clip-path` 装饰

**性能提升**: 编译时间从 **378.6 秒降至 38 秒** (10倍提升)

**关键教训**:
> Tailwind 自定义类 `[...]` 在开发模式下会显著拖慢编译速度，应该尽可能使用标准类名。

#### 2. 首页背景闪烁问题

**现象**: 页面加载时背景中黑色底层有 2 秒闪烁，气泡和星星突然出现

**根本原因**: Framer Motion 动画缺少 `initial` 状态，导致从默认值（opacity: 0）跳到动画第一帧

**解决方案**: 为所有动画元素添加 `initial` 状态匹配动画第一帧
```tsx
// ✅ 正确模式
<motion.div
  initial={{ opacity: 0.3, y: -30, scale: 0.8 }}  // 匹配动画第一帧
  animate={{
    opacity: [0.3, 0.7, 0.3],
    y: [-30, 30, -30],
    scale: [0.8, 1.2, 0.8]
  }}
/>
```

**额外优化**:
- 鼠标跟随渐变添加淡入效果 (`initial={{ opacity: 0 }}`)
- 确保所有动画组件使用 `isClient` 检查，仅客户端渲染

#### 3. 展览墙加载缓慢 (3-4秒)

**问题**: 从首页进入展览墙需等待 3-4 秒

**优化措施**:
1. **数据库查询优化**: 添加 `.limit(50)` 限制，避免加载所有信件
2. **动画简化**:
   - 移除 Spring 动画，改用简单 duration
   - 减少延迟: `index * 0.05` → `Math.min(index * 0.02, 0.5)` (最多 0.5 秒)
   - 缩短动画时长: `0.5s` → `0.3s`
3. **结果**: 首次加载时间显著降低

```typescript
// ✅ 优化后的动画
transition={{
  delay: Math.min(index * 0.02, 0.5),  // 最大延迟 0.5s，不再是 50*0.05=2.5s
  duration: 0.3,
}}
```

#### 4. 展览墙风格演进：从工整到咖啡馆风

**用户需求**: "希望他们自由点，无规则地排列，像是咖啡馆中一个展板"

**实现改进**:
- 增加旋转角度: `-3°至+3°` → **`-8°至+8°`**
- 增加缩放范围: `0.96-1.04` → **`0.90-1.10`**
- 增加 Z-index 层级: `0-3` → **`0-8`**
- 减少间距使信件更有叠加感

```typescript
const rotation = random(-8, 8);      // 更大倾斜
const scale = random(0.90, 1.10);    // 更大尺寸差异
const zOffset = Math.floor(random(0, 8, 100));  // 更多层级
```

#### 5. 首页卡片对齐问题

**问题**: Featured Letters 卡片底部边框不对齐（截图反馈）

**解决方案**: 使用 flexbox 布局确保卡片高度一致
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
  <Link className="h-full">
    <motion.div className="h-full flex flex-col">
      <div className="relative flex-1 flex flex-col">
        <p className="flex-1">{exhibit.preview}</p>
        <motion.div className="mt-auto pt-6">
          {/* 统计信息始终在底部 */}
        </motion.div>
      </div>
    </motion.div>
  </Link>
</div>
```

---

### 当前待办事项 📋

#### 低优先级 (Future Enhancements)
1. **优化移动端展览墙体验**
   - 当前瀑布流布局在小屏幕上的表现需要测试

2. **增加更多纸张样式**
   - 考虑添加：网格纸、水彩纸、羊皮纸等

3. **展览墙分页/无限滚动**
   - 当前 `.limit(50)` 足够，但未来可能需要分页加载

---

### 技术笔记 📝

#### 确定性随机的重要性
所有随机效果（倾斜、大小、纸张类型）都基于信件ID生成，确保：
- 每次渲染结果一致（避免服务端/客户端水合不匹配）
- 用户刷新页面看到相同的视觉效果
- 便于调试和复现问题

#### 纸张样式系统架构
```typescript
// 1. 根据ID确定纸张类型 (6选1)
const paperStyle = getPaperStyle(exhibit.id);

// 2. 根据类型和收信人生成颜色
const paperColor = getPaperColor(exhibit.recipient_type, paperStyle.type);

// 3. 根据类型条件渲染视觉效果
{paperStyle.type === 'torn-paper' && <TornEdges />}
{paperStyle.type === 'kraft-paper' && <KraftTexture />}
{paperStyle.hasLines && <LinedPaperEffect />}
```

#### 性能优化模式总结

**1. Tailwind 性能最佳实践**:
```typescript
// ❌ 避免 - 自定义类会拖慢编译
className="shadow-[0_10px_30px_rgba(0,0,0,0.3)]"

// ✅ 推荐 - 使用标准类
className="shadow-xl"  // 或 shadow-2xl
```

**2. Framer Motion 无闪烁模式**:
```tsx
// ❌ 错误 - 会闪烁
<motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} />

// ✅ 正确 - 添加 initial 状态
<motion.div
  initial={{ opacity: 0.3 }}
  animate={{ opacity: [0.3, 0.7, 0.3] }}
/>
```

**3. 数据库查询优化**:
```typescript
// ❌ 加载所有数据 - 慢
const { data } = await supabase.from('letters_public').select('*')

// ✅ 限制数量 - 快
const { data } = await supabase
  .from('letters_public')
  .select('*')
  .limit(50)
```

**4. 动画性能优化**:
```typescript
// ❌ 累计延迟过长
transition={{ delay: index * 0.05 }}  // 50 items = 2.5s

// ✅ 设置最大延迟
transition={{ delay: Math.min(index * 0.02, 0.5) }}  // 最多 0.5s
```

---

### 文件变更清单

**新增文件**:
- [scripts/seed-exhibition.ts](scripts/seed-exhibition.ts) - 多语言种子数据生成脚本

**修改文件 (Session 1 - 2025-11-06)**:
- [app/api/generate/route.ts](app/api/generate/route.ts) - 添加中文语言检测和专属提示词
- [components/ExhibitionPage.tsx](components/ExhibitionPage.tsx) - 完全重构展览墙视觉风格（瀑布流+六种纸张）
- [package.json](package.json) - 添加 `tsx` 依赖和 `seed` 脚本

**修改文件 (Session 2 - 2025-11-06 性能优化)**:
- [components/ExhibitionPage.tsx](components/ExhibitionPage.tsx) - 性能优化（简化样式、限制查询、优化动画）
- [components/HomePage.tsx](components/HomePage.tsx) - 修复背景闪烁（添加 initial 状态）、修复卡片对齐
- [app/layout.tsx](app/layout.tsx) - 添加水合警告抑制和扩展属性移除脚本

**关键性能改进**:
- Tailwind 编译时间: **378.6s → 38s** (10x 提升)
- 展览墙动画延迟: **2.5s → 0.5s** (5x 提升)
- 数据库查询: 全量加载 → 限制50条

---

### 用户反馈摘要

**已解决反馈** ✅:
> "展览墙略微的严肃，过于排版工整" → 已实现咖啡馆风格（更大倾斜、缩放、叠加）
>
> "让信件稍微叠加一点，更自然些" → 已实现随机旋转 -8°至+8°、缩放 0.9-1.1、z-index 0-8
>
> "我的首页打开那一瞬间，背景中黑色底层一直在闪啊闪" → 已修复（添加 initial 状态）
>
> "从首页进入展览墙，会有一个loading的过程，大概需要等3-4秒" → 已优化（.limit(50) + 简化动画）
>
> "整体网页反应特别慢，左下角显示 compiling..." → 已解决（移除自定义 Tailwind 类）
>
> "首页下面的框没有对齐" → 已修复（flexbox 布局）

**性能优化结果**:
- 编译速度提升 10 倍 (378.6s → 38s)
- 展览墙加载体验显著改善
- 首页无闪烁、流畅加载

---

## Session Summary (2025-11-06 Continued)

This session focused on comprehensive performance optimization and bug fixes following the initial exhibition wall redesign.

**Major Achievements**:
1. ✅ Resolved critical compilation performance issue (10x speedup)
2. ✅ Eliminated homepage background flashing
3. ✅ Optimized exhibition wall loading time
4. ✅ Fixed homepage card alignment issues
5. ✅ Enhanced exhibition wall randomness (coffee shop style)
6. ✅ Updated CLAUDE.md with comprehensive documentation

**Key Learnings**:
- Tailwind arbitrary values can cause severe performance degradation
- Framer Motion requires proper `initial` states to prevent visual glitches
- Database query limits are essential for scalable performance
- Balancing visual complexity with compilation speed is critical

**Updated Documentation**:
- Added performance optimization patterns
- Documented all resolved issues
- Created quick-start guide for future Claude instances
- Expanded Common Gotchas section with performance rules

**Current State**: The project is now in a highly optimized state with all major user-reported issues resolved. The codebase follows established performance best practices and is ready for continued development or deployment.
