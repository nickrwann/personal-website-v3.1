# Design Guidelines for Nick Wanner's Portfolio Chat Interface

## Design Philosophy
This is a minimal personal website that feels like a Gen AI chat interface. The experience should be conversational, focused, and feel like talking to an AI version of Nick. It teaches who Nick is through interaction rather than traditional resume scrolling.

## Color System & Theme

### Default Theme (Initial State: Dark Mode)
- **Base Background**: `#151619` (This is the foundational page background)
- **Text Primary**: Light gray or white for readability on dark background
- **Accent Color**: Deep blue (`#002d6e` or similar) - used for identity elements, NW badge, and intro bubble
- **Text in Accent Areas**: White text on accent blue backgrounds

### Alternate Theme (Light Mode)
- **Base Background**: Near white
- **Text Primary**: Near black
- **Accent Color**: Same deep blue remains consistent
- **Theme Toggle**: Clicking swaps background and text while keeping accent blue unchanged

### Theme Implementation
All color tokens live in a centralized theme context/hook for easy extension and maintenance. Theme switching is instant and affects all elements simultaneously.

## Layout Structure

### Fixed Chrome Elements
1. **Top Left - NW Badge**
   - Small pill shape with rounded corners
   - Background: Accent blue
   - Text: "NW" in white
   - Fixed position, does not move on scroll
   - Must not overlap chat content on small screens (safe margins)

2. **Top Right - Theme Toggle**
   - Icon only (sun/moon indicator)
   - Sticky and always visible while scrolling
   - Must not overlap chat content on small screens (safe margins)

### Content Area
- **Desktop**: Centered column with max-width ~700px for chat bubbles
- **Mobile**: Stacked vertical layout, bubbles span full width minus safe margins
- **Background**: Uses BACKGROUND_BASE from active theme across entire page
- All layouts use Tailwind responsive breakpoints, no hard-coded pixel values

## Landing Sequence (First Load)

### Profile Section (Center Top)
1. Circular profile image from `/client/src/assets/profile.jpg`
2. White ring border and subtle shadow
3. Positioned at center top of content area

### Greeting Bubble
- Rectangle with accent blue background
- White text: "Hi, I'm Nick!"
- Centered directly under profile image

### Typing Indicator
- Shows for ~600ms after greeting bubble
- Pulse or typing animation effect

### Intro Content Stream
- Simulates character-by-character typing (20-30 chars/second)
- Renders markdown progressively during stream
- Final rendered content appears as assistant-style bubble
- Left-aligned with max-width ~700px
- Generous line height for readability

## Chat Input Bar

### Position & Layout
- **Desktop**: Bottom center, floating with rounded corners and subtle shadow
- **Mobile**: Snaps near bottom with safe-area-inset-bottom padding (iOS Safari support)

### Components (Left to Right)
1. Small refresh icon button
2. Plus icon
3. Single-line text field with placeholder: "Ask anything" or "Ask a question about Nick..."
4. Microphone icon (visual only)
5. Purple circular send button

### Character Limit
- Hard cap: 250 characters
- Live counter display: "124 / 250" (shown under input or right-aligned inside bar)
- Visual feedback when approaching/at limit

### Suggestion Pills
Positioned above the input bar:
- "Why should I hire Nick?"
- "What is Nick best at?"
- "What does Nick do in his free time?"
- "Ask a question about Nick..."

Pills are clickable and fill the input field when selected.

## Question & Answer Flow

### User Question State
- User bubble appears after send
- Viewport clears for single-shot answer model
- Profile picture and "Hi, I'm Nick!" may remain or be hidden (implement consistently)
- Input field and send button disabled during processing

### Assistant Response
- Loader bubble shows while waiting
- Response streams character-by-character (same effect as intro)
- Markdown renders progressively
- Input re-enables when complete

### Refresh Behavior
Clicking refresh icon replays entire landing sequence:
1. Profile picture
2. "Hi, I'm Nick!" bubble
3. Intro streaming markdown

## Typography & Content

### Intro Content
Markdown-formatted professional bio stored in `/client/src/content/intro.ts`:
- Sections: About Nick, Experience (detailed work history), Contact
- Rendered with proper markdown hierarchy
- Line height optimized for reading
- Max width ~700px on desktop

### Chat Bubbles
- **User**: Right-aligned or standard user message styling
- **Assistant**: Left-aligned, conversational tone
- Both maintain readability on current theme background

## Responsive Behavior

### Mobile (Base)
- Single column layout
- Full-width bubbles with readable padding and margins
- Input bar with safe area support
- Suggestions stack vertically if needed

### Desktop (md/lg breakpoints)
- Max-width containers (700px for chat, max-w-screen-md for layout)
- Centered content column
- Floating input bar with enhanced shadow
- Multi-column suggestion pills if space allows

### Critical Constraints
- No overlap between fixed chrome (NW badge, theme toggle) and chat content
- Bottom input never cut off by mobile browser toolbars
- All touch targets meet accessibility size requirements

## Interaction States

### Input Field
- Default: Subtle border or background differentiation
- Focused: Enhanced border/outline
- Disabled: Visually muted, cursor not-allowed

### Buttons
- Refresh, plus, mic, send all have clear hover/active states
- Send button emphasized with purple accent
- Disabled states clearly communicate unavailability

### Suggestion Pills
- Hover: Subtle background change
- Active: Fills input and focuses field
- Responsive tap targets for mobile

## Visual Polish

### Shadows & Depth
- Profile image: Subtle shadow for depth
- Floating input bar: Shadow for elevation (desktop)
- Bubbles: Minimal shadows to distinguish from background

### Animations
- Simulated typing: Character reveal at 20-30 chars/sec
- Typing indicator: Gentle pulse
- Theme toggle: Smooth transition between modes
- Streaming markdown: Progressive reveal maintains reading flow

### Spacing
- Generous padding around chat bubbles
- Consistent vertical rhythm between elements
- Safe margins prevent chrome overlap
- Bottom padding accounts for mobile browser UI

## Images

### Profile Image
- **Location**: `/client/src/assets/profile.jpg`
- **Placement**: Center top of content area, first element in landing sequence
- **Treatment**: Circular crop, white ring border, subtle drop shadow
- **Purpose**: Humanizes the interface and establishes identity immediately

This is a single-page application with no traditional hero image. The profile picture serves as the visual anchor and entry point to the conversational experience.