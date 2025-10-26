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
- **ChatGPT-Like Streaming**: Character-by-character content reveal with fast pacing (1 character every 10ms, 100 chars/sec)
  - About Me section streams character-by-character
  - Experience descriptions stream character-by-character (one experience at a time)
  - Q&A responses stream character-by-character
  - Consistent 10ms timing across all sections for smooth, dynamic feel
- **No Auto-Scrolling**: Page stays at top during streaming - user controls all scrolling behavior
- **Scroll-to-Bottom Button**: ChatGPT-style floating button (centered at bottom) with IntersectionObserver detection
  - Uses sentinel element (`#bottom-sentinel`) at page bottom
  - Shows only when sentinel is NOT visible (content actually below viewport)
  - No heuristic-based "near bottom" logic - precise viewport detection
  - Smooth fade transitions with `opacity-0`/`opacity-100`
- **Inline Pulsing Cursor**: Visual indicator during streaming appears horizontally (inline) with text as it grows
  - Cursor positioned inline using `inline-block` span with `align-middle`
  - Moves horizontally character-by-character with text streaming
  - Shows during About Me section streaming, disappears when complete
  - Consistent cursor behavior across About section and Q&A responses
- **Responsive Layout**: Mobile-first approach with adaptive subtitle (single line on desktop, 3 centered lines on mobile)
- **Fixed Chrome Elements**: NW badge and theme toggle remain visible while scrolling
- **Incremental Content Reveal**: About section streams first (character-by-character), then Experience items appear sequentially with character-by-character description streaming for each one
  - String descriptions stream with inline cursor
  - JSX descriptions (with links/formatting) display immediately without streaming
  - Uses null vs empty string distinction: `streamedDescription === null` means use original (completed/JSX), `streamedDescription === ''` means streaming started but no characters yet

**ChatGPT-Style Chat Interface**:
- **Single Rounded Card Composer**: Mobile-first design wrapping both pills and input in one unified card
  - Card uses `rounded-3xl` for large ChatGPT-style corner radius
  - Background: `bg-card` with `border-card-border` adapting to theme
  - `overflow-hidden` ensures pills and input respect rounded corners
  - Safe area inset: `paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'` for iPhone home bar
  - Entire card lifts together during mobile keyboard interactions
  - Two stable states: resting at bottom with safe area padding, or lifted above mobile keyboard
  - No jumping, no overlap, no viewport issues
- **Vertical Stacked Suggestion Pills**: Three suggestions displayed in vertical stack inside card
  - Pills: "Why should I hire Nick?", "What is Nick best at?", "What is Nick's coolest project?"
  - Each pill is full width (`w-full`) with uniform padding (`px-4 py-3`)
  - Rendered as Button components (variant="secondary") for consistency
  - Rounded corners (`rounded-2xl`) matching card style
  - Text left-aligned (`text-left justify-start`) for better readability
  - Spacing: `space-y-2` between pills, `px-4 pt-4 pb-3` section padding
  - Visibility: show when `!hasSentMessage`, hide after send, reappear on refresh
  - **Click behavior**: Populates textarea and focuses (doesn't immediately send)
    - User can review/edit question before sending
    - Pills stay visible while user types (only hide after actual send)
- **Separator Line**: Conditional divider between pills and input row
  - Only appears when pills are visible
  - Class: `border-t border-border mx-4` for subtle separation
  - Provides visual distinction between pill section and input row
- **Input Row Layout**: Clean single row at bottom of card (all vertically centered)
  - Layout: refresh icon → textarea → character counter → send button
  - Padding: `p-3` for breathing room
  - Refresh button: resets chat state without page reload (no `window.location.reload`)
    - Clears Q&A bubbles, streaming state, input value
    - Restores suggestion pills by setting `hasSentMessage = false`
  - Character counter: inline element showing "X/250"
  - Send button: circular (`rounded-full`) with paper airplane icon
  - Auto-expanding textarea (max 200px height), adds scrollbar when exceeded
  - Enter to send, Shift+Enter for new line
  - Character limit: 0/250
- **Mobile Keyboard Handling (Visual Viewport API)**:
  - Detects keyboard height: `window.innerHeight - visualViewport.height`
  - Uses requestAnimationFrame batching to prevent jumps during keyboard animation
  - 50px threshold ensures only real keyboard events trigger movement
  - Applies `translateY(-${keyboardOffset}px)` to entire card (pills + input together)
  - No transition during keyboard opening (prevents lag), smooth 0.2s ease-out when closing
  - Uses ref pattern (`keyboardOffsetRef`) to avoid stale closures in scroll handler
  - **Scroll-to-dismiss**: Any upward scroll while keyboard open immediately blurs textarea
    - Scroll handler reads latest keyboard offset via ref (no timing delays)
    - Deterministic: first upward scroll always dismisses keyboard
    - After blur, card returns to resting position at bottom of page
  - No auto-scroll of page content when focusing input
  - Card stays anchored above keyboard until user scrolls up or keyboard closes
- **Interaction Flow**:
  1. Click pill → textarea populates → focus → user can review/edit → user sends
  2. Send → pills hide → question bubble shows → answer streams with cursor
  3. Refresh → clear Q&A → pills reappear → ready for new question
- **Responsive Design**: 
  - Card adapts to viewport width while maintaining rounded corners
  - Pills stack vertically with uniform width across all screen sizes
  - Input row icons never wrap to second row
  - Readable font sizes maintained on all screen sizes
  - Textarea prioritized for horizontal space
  - Safe area insets prevent overlap with iPhone home bar
- **Theme Support**: All components work correctly in both light and dark mode with proper contrast
  - Card background and borders adapt to theme
  - Pills (Button variant="secondary") adapt to theme
  - Separator line uses theme-aware border color

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
- Scroll position check integrated into streaming effects to update button visibility as content grows

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