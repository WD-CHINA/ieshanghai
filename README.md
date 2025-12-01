# Vue3 Mobile Template

基于 Vue3, Vite, TypeScript, Vant 等技术栈构建的移动端模板项目。

## ✨ 特性

- ⚡️ **Vue 3 + Vite**: 最新技术栈，极速开发体验
- 💎 **TypeScript**: 全量 TypeScript 支持，类型安全
- 🎨 **Vant UI**: 轻量、可靠的移动端 Vue 组件库
- 💨 **UnoCSS**: 即时原子化 CSS 引擎
- 🍍 **Pinia**: 直观、类型安全的 Vue 状态管理
- 🛣 **Vue Router**: 官方路由管理器
- 📡 **Axios**: 强大的 HTTP 客户端
- 📱 **移动端适配**: 自动适配各种移动端设备
- 🛠 **代码规范**: 集成 ESLint, Husky, Lint-staged 等规范工具

## 📂 目录结构

```
src/
├── common/      # 公共资源、工具函数等
├── http/        # HTTP 请求封装
├── layout/      # 布局组件
├── pages/       # 页面文件
│   ├── activity/       # 活动相关页面
│   ├── activity-detail/# 活动详情页
│   ├── home/           # 首页
│   ├── login/          # 登录页
│   └── error/          # 错误页
├── pinia/       # 状态管理
├── plugins/     # 插件配置
├── router/      # 路由配置
├── App.vue      # 根组件
└── main.ts      # 入口文件
```

## 🚀 快速开始

### 环境准备

确保你的本地环境已安装 [Node.js](https://nodejs.org/) (推荐 LTS 版本)。

### 安装依赖

```bash
pnpm install
# 或者
npm install
```

### 启动开发服务器

```bash
pnpm dev
# 或者
npm run dev
```

### 构建生产版本

```bash
pnpm build
# 或者
npm run build
```

### 代码检查

```bash
pnpm lint
```

## 📜 脚本说明

| 脚本 | 描述 |
| --- | --- |
| `dev` | 启动开发服务器 |
| `build` | 构建生产环境代码 |
| `build:staging` | 构建预发布环境代码 |
| `preview` | 预览构建产物 |
| `lint` | 运行 ESLint 代码检查 |
| `test` | 运行测试 |

## 🛠 技术栈

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vant](https://vant-ui.github.io/vant/)
- [UnoCSS](https://unocss.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
