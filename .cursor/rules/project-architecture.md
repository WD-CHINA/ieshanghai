# 项目架构规范

## 项目概述

本项目是**公共文化空间数字化运营平台 H5 管理端**，用于活动排期管理和场地使用管理。

## 技术栈

- **框架**: Vue 3.5+ (Composition API)
- **构建工具**: Vite 7.x
- **语言**: TypeScript 5.x
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **UI 组件库**: Vant 4.x (移动端组件库)
- **HTTP 客户端**: Axios 1.x
- **样式方案**: UnoCSS (原子化 CSS)
- **日期处理**: Day.js
- **工具库**: lodash-es
- **代码规范**: ESLint (@antfu/eslint-config)
- **其他**: PWA 支持、vconsole (调试工具)

## 目录结构

```
src/
├── common/               # 通用模块 (别名: @@)
│   ├── apis/            # 通用接口定义
│   ├── assets/          # 静态资源 (图片、样式)
│   ├── composables/     # Vue 组合式函数
│   ├── constants/       # 常量定义
│   └── utils/           # 工具函数
│       ├── cache/       # 缓存工具 (cookies, localStorage)
│       ├── css.ts       # CSS 工具
│       ├── datetime.ts  # 日期时间工具
│       └── validate.ts  # 验证工具
├── http/                # HTTP 配置
│   └── axios.ts         # Axios 实例和拦截器配置
├── layout/              # 布局组件
│   ├── components/      # 布局子组件 (NavBar, Tabbar, Footer)
│   └── index.vue        # 主布局组件
├── pages/               # 页面组件
│   ├── error/           # 错误页面 (403, 404)
│   ├── home/            # 首页
│   ├── login/           # 登录页
│   └── [业务模块]/      # 各业务模块页面
│       ├── apis/        # 该模块的接口定义
│       │   ├── index.ts # 接口方法
│       │   └── type.ts  # 类型定义
│       └── index.vue    # 页面组件
├── pinia/               # Pinia 状态管理
│   ├── stores/          # Store 定义
│   └── index.ts         # Pinia 实例
├── plugins/             # 插件配置
│   ├── console.ts       # vconsole 配置
│   ├── i18n.ts          # 国际化配置
│   └── index.ts         # 插件入口
├── router/              # 路由配置
│   ├── guard.ts         # 路由守卫
│   ├── index.ts         # 路由定义
│   └── whitelist.ts     # 白名单配置
├── App.vue              # 根组件
└── main.ts              # 应用入口

types/                    # 类型定义文件
├── api.d.ts             # API 类型
├── auto/                # 自动生成的类型
├── directives.d.ts      # 指令类型
├── env.d.ts             # 环境变量类型
├── vue-router.d.ts      # 路由类型扩展
└── window.d.ts          # Window 类型扩展
```

## 路径别名

- `@` → `src/` (项目根目录)
- `@@` → `src/common/` (通用模块目录)

## 开发规范

### 1. 代码风格

- 使用 **Composition API** 和 `<script setup>` 语法
- 使用 **TypeScript** 进行类型约束
- 使用 **ES6+** 语法特性
- 遵循 **@antfu/eslint-config** 代码规范

### 2. 组件规范

- 组件文件名使用 **PascalCase** (如：`NavBar.vue`)
- 页面文件使用 `index.vue` 作为入口
- 组件应保持单一职责，避免过于复杂

### 3. API 规范

- 每个业务模块在其目录下创建 `apis/` 文件夹
- 接口方法定义在 `apis/index.ts`
- 类型定义在 `apis/type.ts`
- 使用统一的 `request` 方法发起请求

### 4. 状态管理

- 使用 Pinia 进行全局状态管理
- Store 定义在 `pinia/stores/` 目录
- 使用组合式风格定义 Store
- 提供 `Outside` 版本的 Store 用于 setup 外使用

### 5. 路由规范

- 路由配置集中在 `router/index.ts`
- 区分系统路由 (`systemRoutes`) 和业务路由 (`routes`)
- 路由 meta 信息应包含：
  - `title`: 页面标题
  - `keepAlive`: 是否缓存
  - `layout`: 布局配置

### 6. 样式规范

- 优先使用 UnoCSS 原子化类名
- 全局样式定义在 `common/assets/styles/`
- 组件样式使用 scoped 样式

## 构建配置

### 开发环境

- 端口：3333
- 代理：`/Api` → `http://smelapi.ieshanghai.cn`
- 自动打开浏览器

### 生产构建

- 移除 `console.log` 和 `debugger`
- 移除所有注释
- 开启代码分割 (vue, vue-router, pinia)
- 支持传统浏览器兼容性

## 自动化工具

- **Auto Import**: 自动导入 Vue、Vue Router、Pinia API
- **Components**: 自动导入 Vant 组件
- **ESLint**: 代码检查和自动修复
- **Husky**: Git hooks (pre-commit 时执行 lint)
- **Vitest**: 单元测试
