# 开发指南

## 环境准备

### 必需软件

| 软件           | 版本要求 | 说明                                                                                |
| -------------- | -------- | ----------------------------------------------------------------------------------- |
| Node.js        | >= 18    | JavaScript 运行时                                                                   |
| 微信开发者工具 | 稳定版   | [下载地址](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) |
| Git            | >= 2.30  | 版本管理                                                                            |

### 微信开发者工具配置

1. 打开开发者工具 → 设置 → 安全设置 → 开启**服务端口**（用于 CLI 和 automator）
2. 设置 → 项目设置 → 勾选"不校验合法域名、web-view、TLS 版本以及 HTTPS 证书"（仅开发阶段）

---

## 首次启动

```bash
# 1. 克隆项目
git clone <repo-url> personal-blog
cd personal-blog

# 2. 安装依赖
npm install

# 3. 配置云开发环境 ID
# 编辑 miniprogram/config/env.js
# 将 'your-env-id-dev' 替换为实际的云开发环境 ID

# 4. 配置 AppID
# 编辑 project.config.json
# 将 'wx_your_appid_here' 替换为你的小程序 AppID

# 5. 打开微信开发者工具，导入项目
# 项目目录选择当前目录，AppID 填写你的 AppID

# 6. 在微信开发者工具中：
#    - 点击"云开发"按钮开通云环境
#    - 在"数据库"中创建以下集合：
#      · articles
#      · comments
#      · categories
#      · about

# 7. 上传并部署云函数
#    在微信开发者工具中，右键每个 cloudfunctions/ 下的函数目录，
#    选择"上传并部署：云端安装依赖"
```

---

## 日常开发命令

```bash
npm run lint           # ESLint 代码检查
npm run lint:fix       # ESLint 自动修复
npm run format         # Prettier 格式化所有文件
npm run format:check   # 检查格式是否符合规范
npm run test           # 运行单元测试
npm run test:component # 运行组件测试（需要 JSDOM）
npm run test:all       # 运行全部测试
```

---

## Git 工作流

### 分支策略

```
main        ← 生产环境代码
  └── develop   ← 集成分支，日常开发合并到这里
        ├── feat/article-list      ← 新功能分支
        ├── fix/comment-pagination ← 修复分支
        └── hotfix/cloud-timeout   ← 紧急修复（从 main 拉）
```

### 开发流程

```bash
# 1. 从 develop 创建功能分支
git checkout develop
git pull
git checkout -b feat/my-feature

# 2. 开发 + 提交（遵循 Conventional Commits）
git add -A
git commit -m "feat(article): add tag filtering support"

# 3. 推送并创建 PR
git push -u origin feat/my-feature
# 在 GitHub 上创建 Pull Request → develop

# 4. Code Review + CI 通过后合并
```

### 提交规范

```
<type>(<scope>): <subject>

类型（type）:
  feat      - 新功能
  fix       - 修复 Bug
  docs      - 文档变更
  style     - 代码格式（不影响逻辑）
  refactor  - 重构
  perf      - 性能优化
  test      - 测试变更
  chore     - 构建/工具变更
  ci        - CI/CD 变更

示例:
  feat(article): add article list page with pagination
  fix(comment): correct pagination off-by-one error
  test(article): add unit tests for article service layer
  chore(deps): update miniprogram-ci to v2.1.22
```

规则由 Commitlint 自动校验。违反规则时提交会被拒绝。

---

## 测试

### 测试分层

```
        ┌─────┐
        │ E2E │  ← miniprogram-automator（需微信开发者工具 CLI）
        ├─────┤
        │ 组件 │  ← miniprogram-simulate（jsdom 环境）
        ├─────┤
        │ 单元 │  ← Jest（Node 环境，mock wx API）
        └─────┘
```

### 单元测试

```bash
npm run test                    # 运行所有单元测试
npm run test -- --testPathPattern="format"  # 只运行 format 相关测试
npm run test -- --coverage      # 生成覆盖率报告
```

**覆盖目标：**

- utils >= 90%
- services >= 80%
- store >= 70%

### 组件测试

```bash
npm run test:component
```

组件测试使用 `miniprogram-simulate` 在 JSDOM 环境中渲染组件，适合测试组件的数据绑定和事件触发。

### E2E 测试

E2E 测试需要微信开发者工具开启 CLI 模式：

```bash
# 开启开发者工具 → 设置 → 安全 → 服务端口
npm run test:e2e
```

---

## 云开发

### 开通步骤

1. 微信开发者工具 → 点击"云开发"图标
2. 点击"开通"，选择"新建环境"
3. 环境名称建议：`blog-dev` / `blog-prod`
4. 复制环境 ID → 填入 `miniprogram/config/env.js`

### 数据库初始化

在微信开发者工具的云开发控制台中：

1. 进入"数据库"
2. 创建集合 `articles`
3. 创建集合 `comments`
4. 创建集合 `categories`
5. 创建集合 `about`
6. 在 `articles` 集合中添加索引：
   - `isPublished` (升序) + `createTime` (降序) — 首页列表查询
   - `categoryId` (升序) + `createTime` (降序) — 分类筛选
7. 在 `comments` 集合中添加索引：
   - `articleId` (升序) + `createTime` (降序) — 评论列表查询

### 权限配置

在数据库 → 权限设置中：

| 集合         | 读权限   | 写权限       |
| ------------ | -------- | ------------ |
| `articles`   | 所有用户 | 仅创建者     |
| `comments`   | 所有用户 | **仅云函数** |
| `categories` | 所有用户 | 仅创建者     |
| `about`      | 所有用户 | 仅创建者     |

"仅云函数"是云开发提供的权限选项，确保客户端无法直接写入数据。

### 云函数部署

1. 在微信开发者工具左侧面板，展开 `cloudfunctions/`
2. 右键每个函数目录 → 选择"上传并部署：云端安装依赖"
3. 等待部署完成（首次部署约 1-2 分钟）
4. 在"云开发" → "云函数"面板中确认所有函数状态为"部署成功"

### 初始数据填充

在云开发控制台 → 数据库中手动添加测试数据：

**categories 集合：**

```json
{ "name": "前端开发", "articleCount": 0, "sort": 1 }
{ "name": "后端开发", "articleCount": 0, "sort": 2 }
{ "name": "生活随笔", "articleCount": 0, "sort": 3 }
```

**about 集合：**（文档 ID 设置为 `about_page`）

```json
{
  "_id": "about_page",
  "content": "<p>这是我的个人博客...</p>",
  "avatar": "",
  "socialLinks": []
}
```

**articles 集合：**

```json
{
  "title": "第一篇博客",
  "content": "<p>欢迎来到我的博客！</p>",
  "summary": "博客开篇语",
  "cover": "",
  "categoryId": "cat_001_id",
  "tags": ["博客"],
  "viewCount": 0,
  "commentCount": 0,
  "isPublished": true,
  "publishDate": "2024-06-15"
}
```

---

## CI/CD

### GitHub Secrets 配置

在仓库 Settings → Secrets → Actions 中添加：

| Secret           | 说明                                                             |
| ---------------- | ---------------------------------------------------------------- |
| `WX_APPID`       | 小程序 AppID                                                     |
| `WX_PRIVATE_KEY` | 小程序代码上传密钥（在微信公众平台 → 开发管理 → 开发设置中下载） |

### 流水线说明

- **CI (`ci.yml`):** push 到 `develop` 或 PR 时触发 → Lint → 格式检查 → 单元测试 → 组件测试
- **Preview (`preview.yml`):** PR 时触发 → 上传小程序预览版

### 上传生产版

```bash
WX_APPID=wxXXX WX_PRIVATE_KEY=$(cat private.key) npm run upload:production
```

---

## 常见问题

### Q: 真机预览报 "云开发初始化失败"？

检查 `miniprogram/config/env.js` 中的 `CLOUD_ENV_ID` 是否填写正确。确保微信开发者工具已登录且云开发环境已开通。

### Q: 提交被 pre-commit hook 拒绝？

提交前运行 `npm run lint:fix && npm run format` 修复代码问题。如果 hook 本身有问题，用 `npx husky install` 重新安装。

### Q: 云函数调用超时？

检查云函数是否已上传部署、微信开发者工具中"云开发"面板是否能正常访问。首次调用云函数有冷启动延迟（约 1-3 秒），后续调用正常。
