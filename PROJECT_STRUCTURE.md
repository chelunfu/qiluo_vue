# 祺洛后台管理系统项目结构

## 项目概述

- **项目名称**: qiluo-vue-admin
- **版本**: 2.8.1
- **描述**: 祺洛后台集成方案
- **技术栈**: Vue 3 + TypeScript + Vite + Element Plus + Pinia

## 目录结构

```
qiluo_vue/
├── public/                # 静态资源目录
│   ├── favicon.ico        # 网站图标
│   └── logo.png           # Logo图片
├── src/                   # 源代码目录
│   ├── api/               # API接口定义
│   │   ├── apipermission/  # API权限相关接口
│   │   ├── cache/         # 缓存相关接口
│   │   ├── dashboard/     # 仪表盘相关接口
│   │   ├── department/    # 部门相关接口
│   │   ├── dictdata/      # 字典数据相关接口
│   │   ├── dicttype/      # 字典类型相关接口
│   │   ├── job/           # 任务相关接口
│   │   ├── login/         # 登录相关接口
│   │   ├── menu/          # 菜单相关接口
│   │   ├── role/          # 角色相关接口
│   │   ├── user/          # 用户相关接口
│   │   └── wechat/        # 微信相关接口
│   ├── assets/            # 项目资源文件
│   │   ├── imgs/          # 图片资源
│   │   └── svgs/          # SVG图标
│   ├── axios/             # Axios 请求配置
│   │   ├── index.ts       # 入口文件
│   │   ├── service.ts     # 服务配置
│   │   └── types/         # 类型定义
│   ├── components/        # 公共组件
│   │   ├── Avatars/       # 头像组件
│   │   ├── Breadcrumb/    # 面包屑组件
│   │   ├── Button/        # 按钮组件
│   │   ├── CodeEditor/    # 代码编辑器组件
│   │   ├── Dialog/        # 对话框组件
│   │   ├── Echart/        # 图表组件
│   │   ├── Editor/        # 富文本编辑器组件
│   │   ├── Form/          # 表单组件
│   │   ├── Icon/          # 图标组件
│   │   ├── Menu/          # 菜单组件
│   │   ├── Table/         # 表格组件
│   │   ├── TagsView/      # 标签页组件
│   │   └── ...            # 其他组件
│   ├── constants/         # 常量定义
│   ├── directives/        # 自定义指令
│   │   ├── index.ts       # 指令注册
│   │   └── permission/    # 权限指令
│   ├── hooks/             # 自定义Hook
│   │   ├── event/         # 事件相关Hook
│   │   └── web/           # Web相关Hook
│   ├── layout/            # 布局组件
│   │   ├── Layout.vue     # 主布局组件
│   │   └── components/    # 布局子组件
│   ├── locales/           # 国际化资源
│   │   ├── en.ts          # 英文翻译
│   │   └── zh-CN.ts       # 中文翻译
│   ├── main.ts            # 应用入口文件
│   ├── permission.ts      # 权限控制
│   ├── plugins/           # 插件配置
│   │   ├── animate.css/   # 动画插件
│   │   ├── echarts/       # ECharts图表插件
│   │   ├── elementPlus/   # Element Plus插件
│   │   ├── svgIcon/       # SVG图标插件
│   │   ├── unocss/        # UnoCSS插件
│   │   └── vueI18n/       # 国际化插件
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义
│   ├── store/             # 状态管理
│   │   ├── index.ts       # Store入口
│   │   └── modules/       # Store模块
│   ├── styles/            # 样式文件
│   │   ├── index.less     # 主样式文件
│   │   └── var.css        # CSS变量
│   ├── utils/             # 工具函数
│   │   ├── color.ts       # 颜色处理
│   │   ├── dateUtil.ts    # 日期工具
│   │   ├── domUtils.ts    # DOM操作工具
│   │   ├── index.ts       # 工具入口
│   │   ├── is.ts          # 类型判断
│   │   ├── routerHelper.ts # 路由辅助函数
│   │   ├── tree.ts        # 树形数据处理
│   │   └── ...            # 其他工具
│   ├── views/             # 页面视图
│   │   ├── Authorization/ # 授权相关页面
│   │   ├── Dashboard/     # 仪表盘页面
│   │   ├── Error/         # 错误页面
│   │   ├── Guide/         # 引导页面
│   │   ├── Login/         # 登录页面
│   │   ├── Monitor/       # 监控页面
│   │   ├── Personal/      # 个人中心页面
│   │   ├── Redirect/      # 重定向页面
│   │   └── wechat/        # 微信相关页面
│   └── App.vue            # 根组件
├── types/                 # TypeScript类型定义
│   ├── components.d.ts    # 组件类型
│   ├── env.d.ts           # 环境变量类型
│   ├── global.d.ts        # 全局类型
│   └── router.d.ts        # 路由类型
├── plop/                  # 代码生成模板
├── scripts/               # 脚本文件
│   └── icon.ts            # 图标处理脚本
├── .eslintrc.cjs          # ESLint配置
├── .prettierrc.cjs        # Prettier配置
├── index.html             # HTML模板
├── package.json           # 项目依赖
├── pnpm-lock.yaml         # pnpm锁定文件
├── postcss.config.cjs     # PostCSS配置
├── tsconfig.json          # TypeScript配置
├── uno.config.ts          # UnoCSS配置
└── vite.config.ts         # Vite配置
```

## 主要依赖

### 核心依赖
- Vue 3.4.x - 前端框架
- Vite 5.2.x - 构建工具
- TypeScript 5.4.x - 类型系统
- Pinia 2.1.x - 状态管理
- Vue Router 4.3.x - 路由管理
- Element Plus 2.7.x - UI组件库

### 工具库
- Axios - HTTP请求
- ECharts - 图表库
- dayjs - 日期处理
- lodash-es - 工具函数
- Vue I18n - 国际化
- UnoCSS - 原子化CSS

### 开发工具
- ESLint - 代码检查
- Prettier - 代码格式化
- Stylelint - 样式检查
- Husky - Git钩子
- Plop - 代码生成器

## 运行脚本

- `pnpm i` - 安装依赖
- `pnpm dev` - 开发环境启动
- `pnpm build:pro` - 生产环境构建
- `pnpm build:dev` - 开发环境构建
- `pnpm build:test` - 测试环境构建
- `pnpm lint:eslint` - ESLint检查
- `pnpm lint:format` - 格式化代码
- `pnpm lint:style` - 样式检查
- `pnpm p` - 使用Plop生成代码
- `pnpm icon` - 处理图标

## 项目特点

1. 基于Vue 3、Vite、TypeScript的现代化开发栈
2. 使用Element Plus作为UI组件库
3. 集成Pinia进行状态管理
4. 完善的国际化支持
5. 丰富的组件库和工具函数
6. 权限管理和路由控制
7. 微信相关功能集成
