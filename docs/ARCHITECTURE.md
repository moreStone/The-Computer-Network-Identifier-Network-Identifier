# 架构设计文档

## 设计目标

- 个人博客场景，内容更新频率低，读多写少
- 小程序端 5 个页面，首包远低于 2MB 限制
- 运维成本尽可能低（免服务器、免域名备案）

## 技术选型

| 决策点     | 选择          | 理由                                              |
| ---------- | ------------- | ------------------------------------------------- |
| 小程序框架 | 原生框架      | 性能最优，无跨平台需求                            |
| 后端       | 微信云开发    | 免运维，自带数据库/存储/云函数                    |
| 状态管理   | 自研 pub-sub  | 5 页面简单数据流，不引入 Redux/MobX（节省 ~50KB） |
| 富文本渲染 | `<rich-text>` | 原生组件，可靠性高                                |
| 搜索       | `db.RegExp`   | 个人博客规模下足够，免费用搜索插件                |
| 子包       | 不使用        | 首包远低于 2MB，无分包必要                        |

## 分层架构

```
┌─────────────────────────────────────┐
│           Pages (5 pages)           │  ← 页面层：UI + 交互
├─────────────────────────────────────┤
│       Components (6 components)     │  ← 组件层：可复用 UI 单元
├─────────────────────────────────────┤
│     Services (4 service modules)    │  ← 服务层：云开发 API 封装
├─────────────────────────────────────┤
│     Utils (4 utility modules)       │  ← 工具层：纯函数，无副作用
├─────────────────────────────────────┤
│     WeChat Cloud (云开发平台)        │  ← 基础设施
└─────────────────────────────────────┘
```

### 各层职责

**页面层 (`pages/`)**

- 管理页面级 UI 状态（loading / empty / error / normal）
- 提供页面间路由跳转
- 注册用户交互事件

**组件层 (`components/`)**

- 无业务逻辑，通过 `properties` 接收数据、`triggerEvent` 回传事件
- 每个组件覆盖四种状态：加载中 / 空数据 / 错误 / 正常

**服务层 (`services/`)**

- 封装 `wx.cloud.callFunction` 调用
- 统一错误处理和参数组装
- 模块按业务域划分：article / comment / category / cloud

**工具层 (`utils/`)**

- 纯函数，不依赖 `wx` 之外的副作用
- 可独立进行单元测试

## 数据流

```
User Tap
    │
    ▼
Page.onXxx()
    │
    ▼
Service.callFunction(name, data)
    │
    ▼
Cloud Function (云函数)
    │
    ▼
Cloud Database (云数据库)
    │
    ▼
Response → Service → Page.setData() → WXML re-render
```

## 数据库设计

### 集合关系

```
categories (1) ────── (N) articles (1) ────── (N) comments
                           │
about (singleton)          │ (N) tags[] (内嵌数组)
```

### 权限矩阵

| 集合         | 读取                            | 写入              |
| ------------ | ------------------------------- | ----------------- |
| `articles`   | 所有用户（isPublished == true） | 仅创建者 / 云函数 |
| `comments`   | 所有用户                        | 仅云函数          |
| `categories` | 所有用户                        | 管理员            |
| `about`      | 所有用户                        | 管理员            |

**关键设计：** 评论写入统一走 `addComment` 云函数，绕过云数据库的"仅创建者可写"限制。云函数内部校验输入、验证文章存在性、原子更新评论计数。

## 目录结构

```
E:\claudeCode\
├── cloudfunctions/         # 后端：7 个云函数
├── miniprogram/            # 前端
│   ├── config/             # 环境配置 + 业务常量
│   ├── styles/             # 设计 Token + 全局样式
│   ├── services/           # API 封装
│   ├── store/              # 全局状态（pub-sub）
│   ├── utils/              # 工具函数
│   ├── components/         # 可复用组件
│   ├── pages/              # 页面
│   └── assets/             # 静态资源
├── tests/
│   ├── unit/               # Jest 单元测试
│   ├── component/          # miniprogram-simulate 组件测试
│   └── e2e/                # miniprogram-automator E2E
├── scripts/                # CI/CD 脚本
├── docs/                   # 文档
└── .github/workflows/      # GitHub Actions
```

## 关键决策记录

### ADR-001: 不使用状态管理库

**决策：** 自研轻量 pub-sub 在 `app.globalData` 上。  
**理由：** 5 页简单数据流，引入 MobX/Pinia-mini 增加包体积 (~50KB)，收益可忽略。  
**代价：** 如后续页面数增长到 15+，需重构引入正式状态管理。

### ADR-002: 评论写入走云函数

**决策：** `comments` 集合客户端只读，写入统一通过 `addComment` 云函数。  
**理由：** 微信云数据库默认权限模型不允许多用户写入同一集合。云函数绕过此限制，同时做输入校验和原子计数更新。  
**代价：** 每次评论多一次云函数调用。

### ADR-003: 搜索使用 db.RegExp

**决策：** 使用云数据库正则搜索，不引入付费搜索插件。  
**理由：** 个人博客几百篇文章，索引良好的 `db.RegExp` 搜索延迟在 100ms 内，足够使用。  
**代价：** 万级以上文章时可能需要迁移到搜索插件。

### ADR-004: 暂不分子包

**决策：** 所有代码在主包中。  
**理由：** 5 页面首包远低于 2MB 限制。  
**代价：** 后续添加图片编辑器等大体积功能时需拆分子包。
