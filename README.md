# Next.js Starter

A modern Next.js full-stack application boilerplate built with Turborepo monorepo architecture, integrating best practices and development tools.

## ✨ Features

- 🚀 **Next.js 15** - Latest version of Next.js framework
- ⚡ **Turbopack** - Ultra-fast development server
- 🏗️ **Turborepo** - High-performance monorepo build system
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **Radix UI** - High-quality headless UI components
- 🌙 **Theme Toggle** - Built-in dark/light theme support
- 📦 **pnpm** - Fast, disk space efficient package manager
- 🔧 **TypeScript** - Type-safe development experience
- 🎯 **ESLint** - Code quality checking
- 💅 **Prettier** - Code formatting
- 🪝 **Lefthook** - Git hooks management
- 📝 **Changeset** - Version management and publishing

## 🏗️ Project Structure

```
nextjs-starter/
├── apps/
│   └── web/                 # Next.js main application
│       ├── app/            # App Router pages
│       ├── components/     # Application-level components
│       └── hooks/          # Custom hooks
├── packages/
│   ├── ui/                 # Shared UI component library
│   │   ├── src/
│   │   │   ├── components/ # Reusable components
│   │   │   ├── hooks/      # UI hooks
│   │   │   ├── lib/        # Utility functions
│   │   │   └── styles/     # Global styles
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configuration
└── ...
```

## 🛠️ Tech Stack

### Frontend Framework

- **Next.js 15** - React full-stack framework
- **React 19** - User interface library
- **TypeScript** - Type safety

### Styling

- **Tailwind CSS 4** - CSS framework
- **Radix UI** - Headless component library
- **Lucide React** - Icon library
- **next-themes** - Theme management

### Development Tools

- **Turborepo** - Monorepo build tool
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Lefthook** - Git hooks

### Utilities

- **clsx** - Conditional classnames
- **tailwind-merge** - Tailwind class merging
- **class-variance-authority** - Component variant management
- **Zod** - Data validation

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1

### Installation

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Clone the project
git clone <your-repo-url>
cd nextjs-starter

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Build project
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Package Management

### Adding Dependencies

```bash
# Add dependency to specific app
pnpm add <package> --filter web

# Add dependency to UI package
pnpm add <package> --filter @workspace/ui

# Add dev dependency to root
pnpm add -D <package> -w
```

### Workspace Dependencies

The project uses pnpm workspace to manage internal package dependencies:

```json
{
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

## 🎨 UI Components

The UI component library is located in `packages/ui` and provides:

- Base components (Button, Input, etc.)
- Theme support
- TypeScript type definitions
- Tailwind CSS styling

### Using Components

```tsx
import { Button } from '@workspace/ui/components/button'

export default function Page() {
  return (
    <Button variant="default" size="md">
      Click me
    </Button>
  )
}
```

## 🔧 Configuration

### ESLint

The project uses shared ESLint configurations:

- `@workspace/eslint-config/base` - Base configuration
- `@workspace/eslint-config/next` - Next.js configuration
- `@workspace/eslint-config/react-internal` - React internal configuration

### TypeScript

Shared TypeScript configurations:

- `@workspace/typescript-config/base` - Base configuration
- `@workspace/typescript-config/nextjs` - Next.js configuration
- `@workspace/typescript-config/react-library` - React library configuration

### Tailwind CSS

The UI package provides global styles and Tailwind configuration that applications can use directly.

## 📋 Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start development server |
| `pnpm build`     | Build all packages       |
| `pnpm lint`      | Run ESLint checks        |
| `pnpm format`    | Format code              |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm changeset` | Create changeset         |
| `pnpm release`   | Release new version      |

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

The project uses [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: testing related
chore: build tools or auxiliary tools changes
```

## 📄 License

[MIT License](LICENSE)

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/primitives)
