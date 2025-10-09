# SMATRX V3 Design Guidelines

## Overview
This document defines the comprehensive design system for SMATRX V3, ensuring visual consistency across all pages and components. The design follows a modern dark theme with purple/pink branding.

## Color System

### Primary Colors
- **Background**: `bg-gradient-to-b from-gray-900 to-black`
- **Primary Text**: `text-white`
- **Secondary Text**: `text-gray-400`
- **Muted Text**: `text-gray-500` / `text-gray-600`
- **Brand Gradient**: `bg-gradient-to-r from-purple-400 to-pink-600`

### Accent Colors
- **Purple**: `text-purple-400`, `bg-purple-900/20`, `border-purple-800`
- **Pink**: `text-pink-500`, `bg-pink-900/20`
- **Cyan**: `text-cyan-500`
- **Green**: `text-green-500`
- **Blue**: `text-blue-500`
- **Orange**: `text-orange-500`
- **Red**: `text-red-500`

### Semantic Colors
- **Success**: `text-green-500`, `bg-green-900/20`
- **Warning**: `text-yellow-500`, `bg-yellow-900/20`
- **Error**: `text-red-500`, `bg-red-900/20`
- **Info**: `text-blue-500`, `bg-blue-900/20`

## Typography

### Headings
- **Page Titles (H1)**: `text-3xl font-bold text-white`
- **Section Titles (H2)**: `text-xl font-semibold text-white`
- **Subsection Titles (H3)**: `text-lg font-semibold text-white`
- **Card Titles**: `text-2xl font-semibold text-white`

### Body Text
- **Primary Body**: `text-sm text-gray-300`
- **Secondary Body**: `text-sm text-gray-400`
- **Muted Text**: `text-sm text-gray-500`
- **Labels**: `text-xs font-semibold text-gray-400 uppercase`

### Special Text
- **Brand Text**: `bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent`
- **Links**: `text-gray-400 hover:text-white`
- **Active Links**: `text-white`

## Components

### Navigation Header
```tsx
<header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          SMATRX
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/dashboard" className="text-white">Dashboard</a>
          <a href="/skills" className="text-gray-400 hover:text-white">Skills</a>
          <a href="/goals" className="text-gray-400 hover:text-white">Goals</a>
          <a href="/learning" className="text-gray-400 hover:text-white">Learning</a>
          <a href="/progress" className="text-gray-400 hover:text-white">Progress</a>
        </nav>
      </div>
    </div>
  </div>
</header>
```

### Cards
- **Default Card**: Use `@smatrx/ui` Card component with dark mode
- **Custom Dark Card**: `bg-gray-800/50 border-gray-700`
- **Hover States**: `hover:border-purple-500`
- **Padding**: `p-6`

### Badges
- **Default Badge**: `bg-purple-900/30 text-purple-300 hover:bg-purple-800/50`
- **Outline Badge**: `text-gray-100 border-gray-700`
- **Category Badges**:
  - Technical: `bg-blue-900/30 text-blue-300`
  - Soft Skills: `bg-green-900/30 text-green-300`
  - Tools: `bg-orange-900/30 text-orange-300`

### Info Banners
```tsx
<div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800 rounded-lg">
  <h3 className="text-sm font-semibold text-purple-300 mb-1">Title</h3>
  <p className="text-sm text-purple-200">Description</p>
</div>
```

### Stat Cards
```tsx
<Card className="p-6">
  <div className="flex items-center justify-between mb-2">
    <Icon className="w-5 h-5 text-purple-500" />
    <span className="text-xs text-gray-500">Label</span>
  </div>
  <div className="text-2xl font-bold text-white">Value</div>
  <p className="text-sm text-gray-500">Description</p>
</Card>
```

### Buttons
- **Primary**: Use `@smatrx/ui` Button component
- **Secondary**: `variant="outline"` with dark theme
- **Ghost**: `variant="ghost"` for subtle actions

## Layout & Spacing

### Container
- **Max Width**: `max-w-7xl mx-auto`
- **Padding**: `px-4 sm:px-6 lg:px-8 py-8`

### Grid Systems
- **2 Column**: `grid grid-cols-1 md:grid-cols-2 gap-6`
- **3 Column**: `grid grid-cols-1 md:grid-cols-3 gap-6`
- **4 Column**: `grid grid-cols-1 md:grid-cols-4 gap-4`

### Spacing Scale
- **Small**: `gap-2`, `p-2`, `mb-2`
- **Medium**: `gap-4`, `p-4`, `mb-4`
- **Large**: `gap-6`, `p-6`, `mb-6`
- **Extra Large**: `gap-8`, `p-8`, `mb-8`

## Animations

### Page Transitions
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Hover Effects
- **Cards**: `hover:border-purple-500 transition-colors`
- **Buttons**: `hover:bg-purple-700 transition-colors`
- **Links**: `hover:text-white transition-colors`

### Loading States
- **Skeleton**: Use `@smatrx/ui` Skeleton component
- **Spinner**: `animate-spin` class

## Icons

### Icon Colors
- **Primary**: `text-purple-400`
- **Secondary**: `text-gray-400`
- **Success**: `text-green-500`
- **Warning**: `text-yellow-500`
- **Error**: `text-red-500`

### Icon Sizes
- **Small**: `w-4 h-4`
- **Medium**: `w-5 h-5`
- **Large**: `w-6 h-6`
- **Extra Large**: `w-8 h-8`

## Form Elements

### Input Fields
- Use `@smatrx/ui` Input component with dark theme
- **Labels**: `text-sm font-medium text-gray-300`
- **Placeholders**: `text-gray-500`
- **Error States**: `border-red-500 text-red-500`

### Select Dropdowns
- Use `@smatrx/ui` Select component
- **Options**: Dark background with proper contrast

## Progress Indicators

### Progress Bars
```tsx
<div className="h-3 bg-gray-700 rounded-full overflow-hidden">
  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{width: `${percentage}%`}}></div>
</div>
```

### Step Indicators
```tsx
<div className="flex items-center gap-2">
  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
    <CheckCircle className="w-4 h-4 text-white" />
  </div>
  <div className="text-sm text-white">Step Name</div>
</div>
```

## Accessibility

### Color Contrast
- All text must meet WCAG AA contrast requirements
- Use `text-white` on dark backgrounds
- Use `text-gray-300` for secondary text
- Use `text-gray-400` for muted text

### Focus States
- All interactive elements must have visible focus indicators
- Use `focus:ring-2 focus:ring-purple-500` for focus rings

### Screen Readers
- Use semantic HTML elements
- Provide proper ARIA labels
- Use `sr-only` class for screen reader only text

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### Mobile Considerations
- Stack cards vertically on mobile
- Use full-width buttons on mobile
- Ensure touch targets are at least 44px
- Use `hidden md:flex` for desktop-only elements

## Implementation Checklist

### Page Requirements
- [ ] Background gradient matches homepage
- [ ] Navigation header is consistent
- [ ] All cards use dark theme
- [ ] Text colors have proper contrast
- [ ] Badges and labels follow color system
- [ ] Info banners use correct colors
- [ ] Icons use accent colors appropriately
- [ ] Animations are consistent
- [ ] No light theme remnants
- [ ] Responsive behavior maintained

### Component Requirements
- [ ] Uses `@smatrx/ui` components where possible
- [ ] Follows dark theme guidelines
- [ ] Proper hover and focus states
- [ ] Accessible color contrast
- [ ] Consistent spacing and typography
- [ ] Responsive design considerations

## Examples

### Complete Page Structure
```tsx
export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg">
        {/* Navigation content */}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Page Title</h1>
        
        {/* Content sections */}
      </main>
    </div>
  );
}
```

### Card Component Example
```tsx
<Card className="p-6 hover:border-purple-500 transition-colors">
  <CardHeader>
    <CardTitle className="text-white">Card Title</CardTitle>
    <CardDescription className="text-gray-400">Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-gray-300">Card content</p>
  </CardContent>
</Card>
```

This design system ensures consistency across all SMATRX V3 pages and components while maintaining accessibility and responsive design principles.
