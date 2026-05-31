# API 接口文档

所有接口通过微信云函数调用，客户端统一使用 `wx.cloud.callFunction({ name, data })` 或封装的 services 层。

## 通用约定

### 响应格式

```json
{
  "code": 0, // 0 = 成功, -1 = 失败
  "message": "", // 错误时返回错误描述
  "data": {} // 业务数据
}
```

### 分页格式

```json
{
  "page": 1,
  "pageSize": 10,
  "total": 100,
  "hasMore": true,
  "articles|comments": []
}
```

---

## 1. getArticles — 文章列表

获取已发布文章的列表，支持分类筛选和分页。

| 参数         | 类型   | 必填 | 默认值 | 说明                    |
| ------------ | ------ | ---- | ------ | ----------------------- |
| `page`       | number | 否   | 1      | 页码                    |
| `pageSize`   | number | 否   | 10     | 每页条数                |
| `categoryId` | string | 否   | null   | 分类 ID，不传则返回全部 |

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "articles": [
      {
        "_id": "art_001",
        "title": "文章标题",
        "summary": "文章摘要约150字...",
        "cover": "cloud://xxx.png",
        "tags": ["微信小程序", "前端"],
        "categoryId": "cat_001",
        "viewCount": 128,
        "commentCount": 5,
        "publishDate": "2024-06-15",
        "createTime": "2024-06-15T10:30:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "hasMore": true
  }
}
```

**调用示例：**

```js
const { getArticles } = require('../../services/article');
const res = await getArticles({ page: 1, categoryId: 'cat_001' });
```

---

## 2. getArticleDetail — 文章详情

获取单篇文章详情，**自动增加一次浏览量**。

| 参数 | 类型   | 必填 | 说明       |
| ---- | ------ | ---- | ---------- |
| `id` | string | 是   | 文章 `_id` |

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "article": {
      "_id": "art_001",
      "title": "文章标题",
      "content": "<p>富文本 HTML 内容</p>",
      "summary": "摘要",
      "cover": "cloud://xxx.png",
      "tags": ["微信小程序"],
      "categoryId": "cat_001",
      "viewCount": 129,
      "commentCount": 5,
      "isPublished": true,
      "publishDate": "2024-06-15",
      "createTime": "2024-06-15T10:30:00Z",
      "updateTime": "2024-06-16T08:00:00Z"
    }
  }
}
```

**错误：**

```json
{ "code": -1, "message": "Article not found" }
```

---

## 3. getComments — 评论列表

获取指定文章的评论列表。

| 参数        | 类型   | 必填 | 默认值 | 说明       |
| ----------- | ------ | ---- | ------ | ---------- |
| `articleId` | string | 是   | —      | 文章 `_id` |
| `page`      | number | 否   | 1      | 页码       |
| `pageSize`  | number | 否   | 20     | 每页条数   |

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "comments": [
      {
        "_id": "cmt_001",
        "_openid": "oXXXX_user_openid",
        "articleId": "art_001",
        "content": "写得很棒！",
        "replyTo": null,
        "createTime": "2024-06-15T12:00:00Z"
      }
    ],
    "total": 12,
    "hasMore": false
  }
}
```

---

## 4. addComment — 新增评论

添加一条评论（需用户登录），同时原子增加文章的 `commentCount`。**此接口是评论写入的唯一入口**，客户端不可直接写入 `comments` 集合。

| 参数        | 类型   | 必填 | 说明                   |
| ----------- | ------ | ---- | ---------------------- |
| `articleId` | string | 是   | 文章 `_id`             |
| `content`   | string | 是   | 评论内容（1-500 字符） |
| `replyTo`   | string | 否   | 被回复的评论 `_id`     |

**校验规则：**

- `content` 去空白后不能为空
- `content` 长度不超过 500 字符
- `articleId` 对应的文章必须存在且已发布

**成功响应：**

```json
{ "code": 0, "data": { "commentId": "cmt_002" } }
```

**调用示例：**

```js
const { addComment } = require('../../services/comment');
const res = await addComment('art_001', '写得不错！');
if (res.code === 0) {
  console.log('评论成功，ID:', res.data.commentId);
}
```

---

## 5. searchArticles — 搜索文章

按标题正则搜索已发布文章。

| 参数       | 类型   | 必填 | 默认值 | 说明                    |
| ---------- | ------ | ---- | ------ | ----------------------- |
| `keyword`  | string | 是   | —      | 搜索关键词（1-50 字符） |
| `page`     | number | 否   | 1      | 页码                    |
| `pageSize` | number | 否   | 10     | 每页条数                |

**实现说明：** 使用微信云数据库 `db.RegExp` 进行不区分大小写的正则匹配，检索范围限于文章标题。此方案在数千篇文章规模下性能足够。

---

## 6. getCategories — 分类列表

获取所有分类。**无入参**。

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "categories": [
      {
        "_id": "cat_001",
        "name": "前端开发",
        "icon": "cloud://icon.png",
        "description": "前端技术相关文章",
        "articleCount": 25,
        "sort": 1
      }
    ]
  }
}
```

---

## 7. getAbout — 关于页内容

获取"关于"页面内容。**无入参**。数据库中没有数据时返回空结构而不报错。

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "about": {
      "_id": "about_page",
      "content": "<p>博主简介...</p>",
      "avatar": "cloud://avatar.png",
      "socialLinks": [{ "platform": "GitHub", "url": "https://github.com/morestone" }]
    }
  }
}
```

---

## 错误码汇总

| code | 场景                   |
| ---- | ---------------------- |
| 0    | 成功                   |
| -1   | 通用错误，详见 message |
