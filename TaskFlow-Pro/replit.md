# PropManage - Property Management SaaS

## Overview

PropManage is a property management SaaS application that allows users to manage rental properties, track maintenance tasks, and handle bookings. The application features a React frontend with a Node.js/Express backend, using PostgreSQL for data persistence. Users can create properties, assign tasks with status tracking, and manage booking schedules through an intuitive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared code)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with tsx for development
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Password Security**: scrypt hashing with timing-safe comparison
- **Session Storage**: PostgreSQL via connect-pg-simple

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: shared/schema.ts (contains users, properties, tasks, bookings tables)
- **Migrations**: drizzle-kit with migrations output to ./migrations

### API Design
- **Pattern**: RESTful endpoints defined in shared/routes.ts with Zod schemas for type safety
- **Route Builder**: Custom buildUrl helper for parameterized routes
- **Authentication**: All property/task/booking endpoints require authenticated sessions

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components (shadcn/ui based)
│       ├── hooks/        # Custom React hooks for data fetching
│       ├── pages/        # Route pages (Dashboard, PropertyDetails, Login, Register)
│       └── lib/          # Utilities and query client setup
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database access layer
│   ├── auth.ts       # Authentication setup
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod schemas
└── script/           # Build scripts
```

### Build System
- **Development**: tsx for TypeScript execution, Vite dev server with HMR
- **Production**: esbuild bundles server code, Vite builds client to dist/public
- **Static Serving**: Express serves built client assets in production

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via DATABASE_URL environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Extensive primitive component usage (dialog, dropdown, tabs, toast, etc.)
- **Lucide React**: Icon library

### Development Tools
- **Replit Plugins**: vite-plugin-runtime-error-modal, cartographer, dev-banner for Replit environment
- **TypeScript**: Strict mode enabled with bundler module resolution

### Authentication
- **passport**: Core authentication middleware
- **passport-local**: Username/password authentication strategy
- **express-session**: Session management

### Date Handling
- **date-fns**: Date formatting and manipulation for bookings display