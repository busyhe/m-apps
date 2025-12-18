# M-Apps: 基于 Notion 的应用导航与展示

[English](./README.md) | 简体中文

这是一个从 Notion 数据库获取应用信息并展示的导航网站，支持从 Apple App Store 自动同步应用元数据。基于 Next.js 15 构建。

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

1. 将你的 GitHub 仓库连接到 Vercel。
2. 配置环境变量 (`NOTION_PAGE_ID`, `NOTION_TOKEN`)。
3. 点击部署！

## 开源协议

MIT
