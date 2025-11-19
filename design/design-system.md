# RCAP Design System

Design system for RCAP platform, optimized for low-bandwidth contexts and public health domain.

## Color Palette

### Primary Colors
- **Primary**: `#7B2CBF` (Purple) - Main brand, buttons, links (Current Implementation)
  - Alternative: `#1976D2` (Blue) - Original spec, can be used if rebranding
- **Secondary**: `#26A69A` (Teal) - Secondary actions
- **Accent**: `#FF6B35` (Orange) - Highlights, urgent alerts
- **Note**: Current UI implementation uses purple (#7B2CBF) as primary. Design system updated to reflect this.

### Semantic Colors
- **Success**: `#4CAF50` (Green) - Success states, positive actions
- **Warning**: `#FF9800` (Orange) - Warnings, caution
- **Error**: `#F44336` (Red) - Errors, negative actions
- **Info**: `#2196F3` (Blue) - Information, neutral

### Neutral Colors
- **Dark**: `#212121` - Primary text
- **Medium**: `#757575` - Secondary text
- **Light**: `#BDBDBD` - Disabled text
- **Background**: `#FAFAFA` - Page background
- **Surface**: `#FFFFFF` - Card/container background

## Typography

### Font Family
- **Primary**: System fonts (Arial, Helvetica, sans-serif) - Low bandwidth
- **Fallback**: Sans-serif stack
- **Monospace**: 'Courier New', monospace (for code)

### Type Scale
- **H1**: 2.5rem (40px) - Page titles
- **H2**: 2rem (32px) - Section titles
- **H3**: 1.75rem (28px) - Subsection titles
- **H4**: 1.5rem (24px) - Card titles
- **Body Large**: 1rem (16px) - Primary body text
- **Body**: 0.875rem (14px) - Secondary body text
- **Caption**: 0.75rem (12px) - Captions, labels
- **Small**: 0.625rem (10px) - Fine print

### Font Weights
- **Bold**: 700 - Headings, emphasis
- **Semi-bold**: 600 - Subheadings
- **Medium**: 500 - Buttons, labels
- **Regular**: 400 - Body text
- **Light**: 300 - Large display text

## Spacing System

### Base Unit: 4px
- **XS**: 4px (0.25rem) - Tight spacing
- **SM**: 8px (0.5rem) - Small spacing
- **MD**: 16px (1rem) - Medium spacing (base)
- **LG**: 24px (1.5rem) - Large spacing
- **XL**: 32px (2rem) - Extra large spacing
- **2XL**: 48px (3rem) - Section spacing
- **3XL**: 64px (4rem) - Page spacing

## Component Variants

### Buttons
- **Primary**: Filled, primary color
- **Secondary**: Outlined, secondary color
- **Text**: Flat, no background
- **Icon**: Icon only, circular/square

### Cards
- **Default**: White background, shadow
- **Elevated**: Higher shadow
- **Outlined**: Border only, no shadow
- **Flat**: No shadow, subtle border

### Inputs
- **Outlined**: Border style (default)
- **Filled**: Filled background
- **Underlined**: Bottom border only
- **Standard**: Material design style

## Responsive Breakpoints

- **Mobile**: 0-599px (xs)
- **Tablet**: 600-1023px (sm)
- **Desktop**: 1024-1439px (md)
- **Large Desktop**: 1440-1919px (lg)
- **XL Desktop**: 1920px+ (xl)

## Low-Bandwidth Optimizations

### Images
- **Format**: WebP with JPEG fallback
- **Lazy Loading**: All images lazy-loaded
- **Compression**: 80% quality for photos, 90% for graphics
- **Sizes**: Responsive srcset for different screen sizes

### Components
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Heavy components loaded on demand
- **Skeleton Screens**: Show loading placeholders
- **Progressive Enhancement**: Core functionality first

### Data
- **Pagination**: 20 items per page
- **Lazy Loading**: Load more on scroll
- **Caching**: Cache frequently accessed data
- **Minimal Payloads**: Only send needed data

## Accessibility (WCAG 2.1 AA)

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Minimum 3:1 ratio

### Interactive Elements
- **Focus Indicators**: Clear focus states
- **Touch Targets**: Minimum 44x44px
- **Keyboard Navigation**: All features keyboard accessible

### Content
- **Alt Text**: All images have descriptive alt text
- **Labels**: All form fields have labels
- **Error Messages**: Clear, descriptive error messages
- **ARIA Labels**: Where needed for screen readers

## Public Health Domain Considerations

### Terminology
- Use "Activity" not "Task" or "Event"
- Use "Organisation" not "Company" or "Team"
- Use "Evidence" not "Attachment" or "File"
- Use "Risk Communication" in context

### Visual Hierarchy
- **Urgent Alerts**: Red/orange, prominent placement
- **Status Indicators**: Color-coded (draft, submitted, approved)
- **Organisation Hierarchy**: Visual tree structure
- **Activity Timeline**: Clear chronological view

## Dark Mode (Future)

### Color Adjustments
- **Background**: Dark gray (#121212)
- **Surface**: Darker gray (#1E1E1E)
- **Text**: Light gray (#E0E0E0)
- **Primary**: Lighter blue shade

## Component States

### Default
- Normal appearance
- Ready for interaction

### Hover
- Slight elevation/shadow
- Color shift (lighter/darker)

### Active/Pressed
- Depressed appearance
- Color change

### Disabled
- Reduced opacity (0.5)
- No interaction
- Gray color

### Loading
- Skeleton screen
- Spinner indicator
- Progress bar

### Error
- Red border/background
- Error icon
- Error message

### Success
- Green border/background
- Success icon
- Success message

## Animation Guidelines

### Duration
- **Fast**: 150ms - Micro-interactions
- **Medium**: 300ms - Standard transitions
- **Slow**: 500ms - Page transitions

### Easing
- **Ease-in-out**: Standard transitions
- **Ease-out**: Entrances
- **Ease-in**: Exits

### Principles
- **Subtle**: Don't distract from content
- **Purposeful**: Every animation has a purpose
- **Performance**: 60fps, use transform/opacity
- **Accessibility**: Respect prefers-reduced-motion

## Icon System

### Icon Library
- **Material Icons**: Primary icon set
- **Font Awesome**: Secondary (if needed)
- **Custom Icons**: For domain-specific icons

### Icon Sizes
- **XS**: 12px
- **SM**: 16px
- **MD**: 24px (default)
- **LG**: 32px
- **XL**: 48px

### Icon Usage
- **Actions**: Use action verbs (add, edit, delete)
- **Status**: Use status indicators (check, warning, error)
- **Navigation**: Use directional (arrow, menu)
- **Content**: Use content type (file, image, video)

