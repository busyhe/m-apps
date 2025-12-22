# M-Apps: 基于 Notion 的应用导航与展示

[English](./README.md) | 简体中文

这是一个从 Notion 数据库获取应用信息并展示的导航网站，支持从 Apple App Store 自动同步应用元数据。基于 Next.js 15 构建。

![M-Nav Example](https://github.com/busyhe/m-apps/blob/main/example.png)

## 特性

- **Notion 集成**: 使用 Notion 数据库作为内容管理系统 (CMS)，方便快捷。
- **App Store 数据增强**: 根据 Apple App ID 自动从 App Store 获取应用名称、描述和图标。
- **自动同步**: 将从 App Store 获取的最新数据同步回 Notion 数据库。
- **现代 UI**: 使用 Tailwind CSS 和 Shadcn UI 构建，简洁美观且响应式。
- **深色模式**: 支持浅色和深色主题切换。

## 安装

1. 克隆仓库：

```bash
git clone https://github.com/busyhe/m-apps.git
cd m-apps
```

1. 安装依赖：

```bash
pnpm install
```

1. 在 `apps/web` 目录下创建 `.env.local` 文件：

```bash
NOTION_PAGE_ID=your_notion_page_id
NOTION_TOKEN=your_notion_integration_token
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

- **NOTION_PAGE_ID**: 包含应用数据库的 Notion 页面 ID。
- **NOTION_TOKEN**: Notion 内部集成令牌 (Internal Integration Token)，用于将数据同步回 Notion。
- **NEXT_PUBLIC_GA_ID**: Google Analytics 跟踪 ID (可选)。

## Notion 数据库结构

为了获得最佳效果，你的 Notion 数据库应包含以下属性：

- **id**: Apple App Store ID (例如 `123456789`)。用于从 App Store 抓取数据。
- **title/Name**: 应用名称。
- **desc/Description**: 应用的简短描述。
- **link/URL**: 应用链接或 App Store 页面链接。
- **logo**: 应用图标链接。
- **type/Category**: 用于应用的分组显示。

> [!NOTE]
> 如果提供了 `id` (Apple App Store ID)，系统将在运行时或构建时尝试从 App Store 获取并更新其他字段。

## 部署

### 在 Vercel 上部署

最简单的部署方式是使用 [Vercel 平台](https://vercel.com/new)。

1. 复制此 Notion 模板

   [Notion 导航演示页面](https://busyhe.notion.site/2cdbba2b2ae780f08320cf66752e5082?v=2cdbba2b2ae781888351000ce04cbd87)

2. 点击下方按钮进行部署：

   [![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbusyhe%2Fm-apps)

3. 配置环境变量：
   - 将 `NOTION_PAGE_ID` 设置为你的 Notion 页面 ID
   - 将 `NEXT_PUBLIC_GA_ID` 设置为你的 Google Analytics ID (可选)
   - 将 `NOTION_TOKEN` 设置为你的 Notion 内部集成令牌 (将数据同步回 Notion 所需)
   - 将 `APPSTORE_REGIONS` 设置为你想要获取数据的区域 (可选)
4. 部署并开启你的导航网站！

你也可以通过推送到连接了 Vercel 的 GitHub 仓库来进行手动部署。

## 开源协议

MIT
