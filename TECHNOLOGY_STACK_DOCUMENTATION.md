# Ocean ERP - Technology Stack Documentation

## 🛠️ **Core Programming Languages**

### **1. TypeScript (Primary Language)**
- **Usage**: Main development language for the entire application
- **Files**: `.ts`, `.tsx` files throughout the codebase
- **Purpose**: Type-safe JavaScript for both frontend and backend API routes
- **Configuration**: `tsconfig.json` with strict type checking enabled
- **Features Used**: 
  - Interface definitions for data models
  - Generic types for API responses
  - Strict null checks and type safety
  - Modern ES modules syntax

### **2. JavaScript**
- **Usage**: Configuration files and some utility scripts
- **Files**: `.js`, `.cjs` files (Tailwind config, PostCSS config, test scripts)
- **Purpose**: Build tools configuration and legacy compatibility
- **Examples**: 
  - `tailwind.config.cjs`
  - `postcss.config.cjs`
  - `prettier.config.cjs`
  - Database connection scripts

### **3. SQL (PostgreSQL)**
- **Usage**: Database schema, migrations, and stored procedures
- **Files**: `.sql` files in `/database/` and `/apps/v4/db/migrations/`
- **Purpose**: Data persistence and complex queries
- **Key Features**:
  - Database migrations for schema versioning
  - Complex joins for ERP data relationships
  - Stored procedures for business logic
  - Indexes for performance optimization

## 🚀 **Frontend Technologies**

### **React 18+ with Next.js 15.3.1**
- **Framework**: Next.js App Router architecture
- **Components**: React functional components with hooks
- **Rendering**: Server-side rendering (SSR) and client-side rendering
- **Key Features**:
  - App Router for file-based routing
  - Server Components for performance
  - Client Components for interactivity
  - Automatic code splitting
  - Built-in optimizations (images, fonts, scripts)

### **UI Component Libraries**
- **shadcn/ui**: Custom component system built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI components
- **Components Used**:
  - Dialog, Dropdown, Select, Popover
  - Command (for search/autocomplete)
  - Form controls (Input, Button, Checkbox)
  - Navigation (Menubar, Navigation Menu)
  - Data display (Table, Card, Badge)
  - Feedback (Alert Dialog, Toast, Progress)

### **Styling & Design System**
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Custom properties for theming and dark mode
- **Design Tokens**: Consistent spacing, colors, and typography
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Features**:
  - Custom color palette for brand consistency
  - Dark/light mode support
  - Custom font families (Geist Sans & Mono)
  - Animation utilities for smooth interactions

## 🔧 **Backend Technologies**

### **Next.js API Routes**
- **Runtime**: Node.js with Edge runtime support
- **Architecture**: RESTful API endpoints
- **File Structure**: `/app/api/` directory structure
- **Features**:
  - Dynamic routes with parameters `[id]`
  - HTTP methods (GET, POST, PUT, DELETE)
  - Middleware support
  - Error handling and validation
  - JSON response formatting

### **Database Integration**
- **PostgreSQL**: Primary database system (ocean_erp database)
- **Client**: `pg` (node-postgres) library for database connections
- **Connection**: Direct database connections from API routes
- **Key Tables**:
  - Products, Customers, Sales Orders
  - Inventory, Suppliers, Purchase Orders
  - Accounting (Journal Entries, Chart of Accounts)
  - Performance Metrics and Goals
  - Manufacturing (Work Orders, BOMs)
  - POS and Loyalty Systems

## 📦 **Development Tools & Build System**

### **Package Management**
- **pnpm**: Fast, efficient package manager with workspace support
- **Workspaces**: Monorepo structure with multiple packages
- **Lock File**: `pnpm-lock.yaml` for deterministic builds
- **Scripts**: Comprehensive npm scripts for development, build, and testing

### **Build Tools & Optimization**
- **Turbo**: High-performance build system for monorepos
- **Turbopack**: Next.js bundler for fast development builds
- **TypeScript Compiler**: Type checking and compilation
- **Features**:
  - Incremental builds
  - Parallel execution
  - Caching for faster rebuilds
  - Hot module replacement (HMR)

### **Code Quality & Standards**
- **ESLint**: JavaScript/TypeScript linting with Next.js rules
- **Prettier**: Code formatting with consistent style
- **Vitest**: Unit testing framework for fast test execution
- **Configurations**:
  - Strict linting rules for code quality
  - Automated formatting on save
  - Pre-commit hooks for consistency

## 🎯 **Technology Stack Summary**

| Category | Technology | Version | Purpose | Configuration File |
|----------|------------|---------|---------|-------------------|
| **Language** | TypeScript | Latest | Primary development language | `tsconfig.json` |
| **Frontend** | React | 18+ | UI component library | - |
| **Framework** | Next.js | 15.3.1 | Full-stack React framework | `next.config.js` |
| **Database** | PostgreSQL | - | Data persistence | Connection in API routes |
| **Styling** | Tailwind CSS | Latest | Utility-first styling | `tailwind.config.cjs` |
| **UI Components** | shadcn/ui + Radix | Latest | Accessible component system | Component registry |
| **Build System** | Turbo + Turbopack | Latest | Monorepo build optimization | `turbo.json` |
| **Package Manager** | pnpm | Latest | Efficient dependency management | `pnpm-workspace.yaml` |
| **Testing** | Vitest | Latest | Unit and integration testing | `vitest.config.ts` |
| **Linting** | ESLint | Latest | Code quality enforcement | `.eslintrc.json` |
| **Formatting** | Prettier | Latest | Code style consistency | `prettier.config.cjs` |

## 🏗️ **Architecture Patterns & Principles**

### **Monorepo Structure**
- **Multiple Apps**: `apps/v4/` (main ERP app), `apps/www/` (documentation)
- **Shared Packages**: `packages/shadcn/` (UI components), `packages/tests/`
- **Workspace Benefits**: Code sharing, consistent tooling, unified builds

### **Next.js App Router Architecture**
- **File-Based Routing**: Pages defined by file structure
- **Layout Composition**: Nested layouts for consistent UI
- **Server Components**: Default server rendering for performance
- **Client Components**: Interactive components marked with 'use client'

### **API Design Patterns**
- **RESTful Endpoints**: Standard HTTP methods and status codes
- **Resource-Based URLs**: `/api/products/[id]`, `/api/sales-orders`
- **Consistent Response Format**: Standardized JSON responses
- **Error Handling**: Proper HTTP status codes and error messages

### **Database-First Approach**
- **Schema Migrations**: Versioned database changes
- **Relational Design**: Normalized tables with foreign key relationships
- **Business Logic**: Complex queries and stored procedures
- **Data Integrity**: Constraints and validation at database level

### **Component-Driven Development**
- **Reusable Components**: Atomic design principles
- **TypeScript Interfaces**: Strongly typed component props
- **Composition Pattern**: Flexible component composition
- **Design System**: Consistent UI patterns and components

## 🔄 **Development Workflow**

### **Local Development**
```bash
# Start development server
pnpm run v4:dev

# Run on port 4000
http://localhost:4000
```

### **Build & Deploy**
```bash
# Build all packages
pnpm run build

# Type checking
pnpm run typecheck

# Linting and formatting
pnpm run lint:fix
pnpm run format:write
```

### **Testing**
```bash
# Run tests
pnpm run test

# Development testing
pnpm run test:dev
```

## 📊 **Performance Optimizations**

### **Next.js Built-in Optimizations**
- **Automatic Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Font Optimization**: Self-hosted fonts with font swapping
- **Bundle Analysis**: Built-in bundle analyzer

### **Database Performance**
- **Connection Pooling**: Efficient database connection management
- **Indexed Queries**: Strategic indexes for common queries
- **Query Optimization**: Efficient SQL queries with proper joins
- **Pagination**: Limit result sets for large datasets

### **Build Performance**
- **Turbopack**: Fast bundler for development
- **Incremental Builds**: Only rebuild changed files
- **Caching**: Aggressive caching for dependencies and builds
- **Parallel Processing**: Multi-core build execution

## 🛡️ **Security & Best Practices**

### **Type Safety**
- **Strict TypeScript**: No implicit any, null checks
- **Runtime Validation**: Input validation for API endpoints
- **Database Constraints**: Prevent invalid data at DB level

### **API Security**
- **Input Sanitization**: Prevent SQL injection
- **Error Handling**: Don't expose sensitive information
- **HTTP Status Codes**: Proper status code usage

### **Development Security**
- **Environment Variables**: Sensitive data in `.env.local`
- **Git Ignore**: Exclude secrets from version control
- **Dependency Scanning**: Regular dependency updates

## 📚 **Learning Resources & Documentation**

### **Framework Documentation**
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 18 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **UI & Styling**
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Database & Backend**
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)

### **Development Tools**
- [pnpm Documentation](https://pnpm.io/)
- [Turbo Documentation](https://turbo.build/)
- [Vitest Documentation](https://vitest.dev/)

---

**Last Updated**: November 28, 2025
**Ocean ERP Version**: v4.0.1
**Next.js Version**: 15.3.1

This documentation serves as a comprehensive reference for developers working on the Ocean ERP application, covering all technologies, patterns, and best practices used in the codebase.