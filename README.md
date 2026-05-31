# 个人博客微信小程序

基于**原生微信小程序 + 微信云开发**的个人博客，工程流程对齐大厂标准。

## 技术栈

| 层级      | 技术                                     |
| --------- | ---------------------------------------- |
| 前端框架  | 原生微信小程序                           |
| 后端服务  | 微信云开发（云函数 + 云数据库 + 云存储） |
| 代码规范  | ESLint + Prettier + EditorConfig         |
| 提交规范  | Conventional Commits + Commitlint        |
| Git Hooks | Husky + lint-staged                      |
| 测试      | Jest（单元测试 + 组件测试 + E2E）        |
| CI/CD     | GitHub Actions                           |

## 快速开始

### 前置条件

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 稳定版
- Node.js >= 18
- 微信小程序 AppID（需开通云开发）

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境
# 编辑 miniprogram/config/env.js，填入云开发环境 ID

# 3. 更新 AppID
# 编辑 project.config.json，填入你的 appid

# 4. 用微信开发者工具打开项目根目录

# 5. 初始化云数据库（在微信开发者工具云开发控制台手动创建集合）
# 需要创建的集合：articles, comments, categories, about
```

### 开发命令

```bash
npm run lint          # 代码检查
npm run format        # 代码格式化
npm run test          # 运行单元测试
npm run test:component   # 运行组件测试
npm run test:all      # 运行全部测试
```

## 项目结构

```
├── .github/workflows/    # CI/CD 流水线
├── .husky/               # Git Hooks
├── cloudfunctions/       # 云函数
│   ├── getArticles/      # 文章列表
│   ├── getArticleDetail/ # 文章详情
│   ├── getComments/      # 评论列表
│   ├── addComment/       # 新增评论
│   ├── searchArticles/   # 搜索文章
│   ├── getCategories/    # 分类列表
│   └── getAbout/         # 关于页面
├── miniprogram/          # 小程序前端
│   ├── components/       # 可复用组件
│   ├── pages/            # 页面
│   ├── services/         # 云开发 API 封装
│   ├── utils/            # 工具函数
│   ├── store/            # 全局状态
│   └── config/           # 配置
├── tests/                # 测试
└── scripts/              # CI 脚本
```

## 分支策略

- `main` — 生产分支
- `develop` — 集成分支
- `feat/*` — 功能分支
- `fix/*` — 修复分支

## 数据库集合

| 集合         | 说明                                  |
| ------------ | ------------------------------------- |
| `articles`   | 文章（isPublished + createTime 索引） |
| `comments`   | 评论（articleId + createTime 索引）   |
| `categories` | 分类                                  |
| `about`      | 关于页内容（单文档）                  |

## License

MIT
