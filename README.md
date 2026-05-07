# 赣军密后台管理系统

基于 Vue 2 + Element UI 的培训管理后台系统，提供培训信息管理、学员报名管理、证书颁发与打印等完整业务流程。

## 项目概述

本系统是为培训机构设计的一站式后台管理平台，涵盖从培训信息发布、学员报名录入、缴费管理到证书生成打印的全流程管理。系统支持多期数多班次的培训管理架构，提供批量证书颁发与 Canvas 证书渲染打印功能。

## 功能模块

### 首页仪表盘

- 培训数量、期数数量、学员总数统计卡片
- ECharts 柱状图展示各培训班报名人数

### 培训管理

- **培训信息管理**：培训项目的新增、编辑、删除，支持培训状态控制
- **培训期数管理**：按培训项目管理多个班次，查看各班次报名学员，支持学员信息 Excel 导出
- **回执空表上传**：上传培训回执空表模板文件

### 学员管理

- **学员信息添加**：三步表单录入（基本信息 → 培训报名 → 发票信息），支持身份证号、手机号格式校验
- **学员信息管理**：多条件搜索、分页浏览、信息编辑、Excel 批量导出、取消报名
- **学员缴费管理**：缴费状态查看与批量设置，发票信息管理

### 证书管理

- **培训证书管理**：设置证书模板（标题、颁证单位、有效期、发证日期）
- **学员证书管理**：按班次查看学员证书状态，支持批量颁发证书、修改证书内容
- **学员证书打印**：Canvas 渲染证书（含证件照、二维码、正文自动换行），调用浏览器打印功能输出

### 用户管理

- **管理员列表**：查看系统管理员与普通管理员，支持密码重置、账号删除
- **添加管理员**：录入管理员信息，区分系统管理员与普通管理员角色权限

### 系统功能

- 登录 / 退出，Token 鉴权与路由守卫
- 修改密码
- 404 页面兜底

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Vue 2.6 |
| UI 组件库 | Element UI 2.13 |
| 状态管理 | Vuex 3.1 |
| 路由 | Vue Router 3.0 |
| HTTP 请求 | Axios |
| 图表 | ECharts 5 |
| Excel 导出 | SheetJS (xlsx) |
| 证书渲染 | Canvas 2D API |
| 样式 | SCSS |
| 构建工具 | Vue CLI 4 |
| 代码规范 | ESLint |

## 项目结构

```
src/
├── api/                  # 接口请求模块
│   ├── admin.js          # 管理员相关接口
│   ├── student.js        # 学员相关接口
│   ├── trains.js         # 培训与证书相关接口
│   └── user.js           # 登录鉴权接口
├── assets/               # 静态资源
├── components/           # 公共组件
│   ├── Breadcrumb/       # 面包屑导航
│   ├── Hamburger/        # 侧边栏折叠按钮
│   └── SvgIcon/          # SVG 图标组件
├── icons/                # SVG 图标文件
├── layout/               # 页面布局框架
│   ├── components/
│   │   ├── Sidebar/      # 侧边栏
│   │   ├── Navbar.vue    # 顶部导航栏
│   │   └── AppMain.vue   # 主内容区
│   └── index.vue         # 布局入口
├── router/               # 路由配置
├── store/                # Vuex 状态管理
│   └── modules/
│       ├── app.js        # 应用状态（侧边栏等）
│       ├── settings.js   # 全局设置
│       └── user.js       # 用户信息与鉴权
├── styles/               # 全局样式
├── utils/                # 工具函数
│   ├── auth.js           # Token 存取
│   ├── request.js        # Axios 封装（拦截器）
│   ├── validate.js       # 表单验证规则
│   └── get-page-title.js # 页面标题生成
├── views/                # 页面组件
│   ├── admin/            # 用户管理
│   ├── certificate/      # 证书管理
│   ├── dashboard/        # 首页仪表盘
│   ├── login/            # 登录与修改密码
│   ├── student/          # 学员管理
│   ├── trains/           # 培训管理
│   └── 404.vue           # 404 页面
├── permission.js         # 全局路由守卫
├── settings.js           # 全局配置
└── main.js               # 入口文件
```

## 快速开始

### 环境要求

- Node.js >= 8.9
- npm >= 3.0.0

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/your-username/GanJunMi-Admin.git

# 进入项目目录
cd GanJunMi-Admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动后访问 http://localhost:9528

### 构建部署

```bash
# 生产环境构建
npm run build:prod

# 测试环境构建
npm run build:stage
```

### 其他命令

```bash
# 代码规范检查
npm run lint

# 代码规范检查并自动修复
npm run lint -- --fix
```

## 核心设计说明

### 权限控制

系统采用基于 Token 的鉴权机制。用户登录后服务端返回 Token，前端存储至 Cookie，后续请求通过 Axios 请求拦截器自动附加到请求头。路由守卫（`permission.js`）在每次路由跳转前校验 Token 有效性，未登录用户自动重定向至登录页。

### 证书打印

证书打印模块使用 HTML5 Canvas 2D API 在客户端渲染证书，支持：

- 证件照与二维码的异步加载与绘制
- 证书正文自动换行（基于 `measureText` 逐字计算宽度）
- 加载进度条实时反馈
- 渲染完成后将 Canvas 转为图片，通过新窗口调用浏览器打印

### Excel 导出

学员信息导出基于 SheetJS 库，将表格数据转为 Excel 文件下载，支持按需过滤导出字段。

## 浏览器支持

| Chrome | Firefox | Safari | Edge |
| :---: | :---: | :---: | :---: |
| 最新版 | 最新版 | 最新版 | 最新版 |

## License

[MIT](./LICENSE)
