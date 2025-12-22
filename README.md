# M-Apps: Notion-powered App Navigation & Showcase

English | [简体中文](./README_zh.md)

A navigation site that displays apps from a Notion database, featuring automatic data enrichment from the Apple App Store. Built with Next.js 15.

![M-Nav Example](https://github.com/busyhe/m-apps/blob/main/example.png)

## Features

- **Notion Integration**: Uses a Notion database as a CMS for easy management.
- **App Store Enrichment**: Automatically fetches app titles, descriptions, and logos from the Apple App Store using App IDs.
- **Seamless Sync**: Updates Notion database entries with the latest data fetched from the App Store.
- **Modern UI**: Clean, responsive design built with Tailwind CSS and Shadcn UI.
- **Dark Mode**: Supports both light and dark themes.

## Setup

1. Clone the repository:

```bash
git clone https://github.com/busyhe/m-apps.git
cd m-apps
```

1. Install dependencies:

```bash
pnpm install
```

1. Create a `.env.local` file in the `apps/web` directory:

```bash
NOTION_PAGE_ID=your_notion_page_id
NOTION_TOKEN=your_notion_integration_token
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

- **NOTION_PAGE_ID**: The ID of the Notion page containing your apps database.
- **NOTION_TOKEN**: Your Notion Internal Integration Token (required for syncing data back to Notion).
- **NEXT_PUBLIC_GA_ID**: Your Google Analytics Measurement ID (optional).

## Notion Database Structure

Your Notion database should include the following properties for optimal performance:

- **id**: Apple App Store ID (e.g., `123456789`). Used to fetch data from the App Store.
- **title/Name**: The name of the app.
- **desc/Description**: A short description of the app.
- **link/URL**: The link to the app or its App Store page.
- **logo**: URL to the app's logo icon.
- **type/Category**: Used to group apps into sections.

> [!NOTE]
> If the `id` (Apple App Store ID) is provided, the system will attempt to fetch and update other fields from the App Store during runtime/build.

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Duplicate this Notion template

   [Notion nav demo page](https://busyhe.notion.site/2cdbba2b2ae780f08320cf66752e5082?v=2cdbba2b2ae781888351000ce04cbd87)

2. Click the button below to deploy:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbusyhe%2Fm-apps)

3. Configure environment variables:
   - Set `NOTION_PAGE_ID` to your Notion page ID
   - Set `NEXT_PUBLIC_GA_ID` to your Google Analytics ID (optional)
   - Set `NOTION_TOKEN` to your Notion Internal Integration Token (required for syncing data back to Notion)
   - Set `APPSTORE_REGIONS` to the regions you want to fetch data from (optional)
4. Deploy and enjoy your navigation site!

You can also manually deploy by pushing to your Vercel-connected GitHub repository.

## License

MIT
