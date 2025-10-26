# Nick Wanner Portfolio Website

## Overview

This is a personal portfolio website for Nick Wanner, an AI Engineer, presented as an interactive chat interface. The site mimics a conversational AI experience where visitors can learn about Nick's background, experience, and projects through both static content and dynamic Q&A interactions. The application features a clean, minimal design with dark/light theme support and streaming text animations that create an engaging, modern user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server with HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing
- **TanStack React Query** for server state management and API data fetching

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives, configured in "new-york" style
- **Tailwind CSS** for utility-first styling with custom design tokens
- Custom theme system with centralized color tokens supporting light/dark modes
- Component path aliases configured for clean imports (`@/components`, `@/lib`, etc.)

**Key Design Patterns**
- **ChatGPT-Like Streaming**: Character-by-character content reveal with natural pacing (randomized 15-30ms delays, 3-5 chars per iteration)
- **Smart Scroll Management**: IntersectionObserver-based detection stops auto-scroll when user scrolls up during streaming
- **Scroll-to-Bottom Button**: ChatGPT-style floating button (bottom-right) appears during streaming when content extends beyond viewport
- **Pulsing Cursor**: Visual indicator during streaming provides feedback that content is loading
- **Auto-Focus**: Chat input automatically receives focus after streaming completes for seamless interaction
- **Responsive Layout**: Mobile-first approach with adaptive subtitle (single line on desktop, 3 centered lines on mobile)
- **Fixed Chrome Elements**: NW badge and theme toggle remain visible while scrolling
- **Incremental Content Reveal**: About section streams first, then Experience items appear sequentially with fade-in animations

### Backend Architecture

**Server Framework**
- **Express.js** server with TypeScript
- Custom middleware for request logging and JSON response capture
- Vite middleware integration in development mode for seamless HMR

**API Endpoints**
- `/health` - Health check endpoint
- `/api/ask` - Chat endpoint that proxies questions to OpenRouter AI API
  - Validates question length (max 250 characters)
  - Uses system prompt to constrain AI responses to Nick's professional context
  - Returns streamed AI responses about Nick's experience and background

**AI Integration**
- OpenRouter API integration using Mistral Small model (`mistralai/mistral-small-3.2-24b-instruct:free`)
- Custom system prompt ensures AI responses stay in character as Nick's hype man
- Responses constrained to professional background, skills, and experience
- Built-in filtering to decline non-relevant questions politely

**Data Storage**
- In-memory storage implementation (`MemStorage`) for user data
- Database schema defined using Drizzle ORM with PostgreSQL dialect
- Users table with id, username, and password fields (currently unused in production)
- Database connection configured via `DATABASE_URL` environment variable

### Theme System

**Implementation**
- React Context-based theme provider (`ThemeProvider`)
- Persists theme preference to localStorage
- CSS class-based theme switching (`light`/`dark` classes on root element)
- Centralized color tokens in CSS variables (HSL format with alpha channel support)
- Default theme is light mode on first load

**Color Token Architecture**
- Base colors: `background`, `foreground`, `border`, `input`
- Semantic colors: `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`
- Each semantic color has matching foreground and border variants
- Elevation system using semi-transparent overlays (`--elevate-1`, `--elevate-2`)
- Button outline and badge outline variables for consistent borders

### Content Management

**Static Content**
- Profile information, about section, and experience data stored in TypeScript files in `client/src/content/` directory
- Content wrapped in extensible stream container (`#stream-container`) for easy addition of future sections
- Markdown rendering support via `react-markdown` for rich text formatting in Q&A responses

**Streaming UX Implementation**
- Natural character-by-character streaming mimics ChatGPT's conversational pacing
- About section (~407 chars) streams first with randomized delays for natural flow
- Five experience items reveal sequentially (400ms between each) after About completes
- Total streaming time approximately 3-4 seconds from page load
- Pulsing cursor indicator provides visual feedback during streaming
- Q&A section fades in smoothly only after all content streaming completes
- Chat input auto-focuses for immediate user interaction post-streaming

## External Dependencies

### Third-Party Services

**OpenRouter AI API**
- Provides AI chat completions for the Q&A feature
- Requires `OPENROUTER_API_KEY_2` environment variable
- Uses free tier of Mistral Small model
- Responses formatted as JSON with message content

### Database

**PostgreSQL** (via Neon Database)
- Configured through Drizzle ORM
- Connection via `@neondatabase/serverless` driver
- Schema migrations in `./migrations` directory
- Database provisioning required via `DATABASE_URL` environment variable
- Currently has minimal schema (users table) but infrastructure ready for expansion

### UI Libraries

**Radix UI Primitives**
- Complete set of unstyled, accessible UI components
- Includes: Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Hover Card, Label, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Tooltip
- Provides ARIA-compliant, keyboard-navigable components

**Supporting Libraries**
- `class-variance-authority` - Type-safe component variant management
- `clsx` & `tailwind-merge` - Utility for merging Tailwind classes
- `cmdk` - Command menu component
- `date-fns` - Date formatting utilities
- `embla-carousel-react` - Carousel/slider component
- `react-day-picker` - Calendar/date picker
- `react-hook-form` & `@hookform/resolvers` - Form state management with validation
- `react-markdown` - Markdown rendering
- `vaul` - Drawer component
- `zod` - Schema validation
- `lucide-react` - Icon library

### Build & Development Tools

**Core Tools**
- TypeScript for type safety across client and server
- ESBuild for production server bundling
- PostCSS with Tailwind CSS and Autoprefixer
- Drizzle Kit for database migrations

**Replit-Specific Integrations**
- `@replit/vite-plugin-runtime-error-modal` - Enhanced error overlay
- `@replit/vite-plugin-cartographer` - Development tooling (dev only)
- `@replit/vite-plugin-dev-banner` - Development banner (dev only)

### Fonts & Assets

- **Google Fonts** - Inter font family (weights: 300, 400, 500, 600, 700)
- Profile image stored in `client/src/assets/profile.jpg` (referenced in multiple components)
- Favicon at `/favicon.png`