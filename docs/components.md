# Component Library Documentation

## Overview

SMATRX V3 uses a custom component library built on top of Radix UI primitives and styled with Tailwind CSS. The library provides a consistent design system with TypeScript support and accessibility features.

## Design System

### Design Tokens

```typescript
// Color palette
const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    500: '#6b7280',
    900: '#111827',
  },
  // ... more colors
};

// Typography scale
const typography = {
  'text-xs': '0.75rem',
  'text-sm': '0.875rem',
  'text-base': '1rem',
  'text-lg': '1.125rem',
  'text-xl': '1.25rem',
  'text-2xl': '1.5rem',
  'text-3xl': '1.875rem',
  'text-4xl': '2.25rem',
};

// Spacing scale
const spacing = {
  'space-1': '0.25rem',
  'space-2': '0.5rem',
  'space-4': '1rem',
  'space-8': '2rem',
  'space-16': '4rem',
};
```

## Core Components

### Button

A versatile button component with multiple variants and sizes.

```typescript
import { Button } from '@smatrx/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🎯</Button>

// With loading state
<Button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</Button>
```

**Props:**
- `variant`: `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'`
- `size`: `'default' | 'sm' | 'lg' | 'icon'`
- `disabled`: `boolean`
- `asChild`: `boolean` - Render as child component

### Card

Container component for grouping related content.

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@smatrx/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Components:**
- `Card`: Main container
- `CardHeader`: Header section with title and description
- `CardTitle`: Card title
- `CardDescription`: Card description
- `CardContent`: Main content area
- `CardFooter`: Footer with actions

### Badge

Small status indicators and labels.

```typescript
import { Badge } from '@smatrx/ui';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

**Props:**
- `variant`: `'default' | 'secondary' | 'destructive' | 'outline'`

### Input

Form input components.

```typescript
import { Input } from '@smatrx/ui';

<Input placeholder="Enter text..." />
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled input" />
```

**Props:**
- `type`: HTML input types
- `placeholder`: Placeholder text
- `disabled`: Disabled state
- `value`: Controlled value
- `onChange`: Change handler

### Textarea

Multi-line text input.

```typescript
import { Textarea } from '@smatrx/ui';

<Textarea placeholder="Enter your message..." />
<Textarea rows={4} placeholder="Longer text..." />
```

**Props:**
- `rows`: Number of visible lines
- `placeholder`: Placeholder text
- `disabled`: Disabled state

### Select

Dropdown selection component.

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@smatrx/ui';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

## Layout Components

### Container

Responsive container with max-width constraints.

```typescript
import { Container } from '@smatrx/ui';

<Container>
  <h1>Page content</h1>
</Container>
```

### Grid

CSS Grid layout component.

```typescript
import { Grid } from '@smatrx/ui';

<Grid cols={3} gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

**Props:**
- `cols`: Number of columns
- `gap`: Gap between items
- `responsive`: Responsive breakpoints

### Flex

Flexbox layout component.

```typescript
import { Flex } from '@smatrx/ui';

<Flex direction="row" justify="between" align="center">
  <div>Left content</div>
  <div>Right content</div>
</Flex>
```

**Props:**
- `direction`: `'row' | 'column'`
- `justify`: Justify content
- `align`: Align items
- `wrap`: Flex wrap

## Form Components

### Form

Form wrapper with validation support.

```typescript
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@smatrx/ui';

<Form onSubmit={handleSubmit}>
  <FormField name="email">
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</Form>
```

### FormField

Individual form field wrapper.

```typescript
<FormField name="fieldName">
  <FormItem>
    <FormLabel>Field Label</FormLabel>
    <FormControl>
      <Input />
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>
```

## Feedback Components

### Alert

Alert messages for user feedback.

```typescript
import { Alert, AlertDescription, AlertTitle } from '@smatrx/ui';

<Alert>
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>
```

### Toast

Temporary notification messages.

```typescript
import { useToast } from '@/hooks/use-toast';

const { showToast } = useToast();

// Show toast
showToast('success', 'Operation completed successfully');
showToast('error', 'Something went wrong');
showToast('info', 'Information message');
```

### Loading

Loading state components.

```typescript
import { LoadingState } from '@/components/loading-state';

<LoadingState message="Loading data..." size="lg" />
```

**Props:**
- `message`: Loading message
- `size`: `'sm' | 'md' | 'lg'`

### Skeleton

Loading placeholders.

```typescript
import { Skeleton, SkeletonCard, SkeletonList } from '@/components/skeleton';

<Skeleton className="h-4 w-[250px]" />
<SkeletonCard />
<SkeletonList count={3} />
```

## Navigation Components

### Navigation

Main navigation component.

```typescript
import { Navigation } from '@/components/navigation';

<Navigation>
  <NavigationItem href="/dashboard">Dashboard</NavigationItem>
  <NavigationItem href="/skills">Skills</NavigationItem>
  <NavigationItem href="/goals">Goals</NavigationItem>
</Navigation>
```

### Breadcrumb

Breadcrumb navigation.

```typescript
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@smatrx/ui';

<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>
    <BreadcrumbLink href="/skills">Skills</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

## Data Display Components

### Table

Data table component.

```typescript
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@smatrx/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Developer</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Progress

Progress indicator.

```typescript
import { Progress } from '@smatrx/ui';

<Progress value={75} max={100} />
<Progress value={50} className="w-full" />
```

**Props:**
- `value`: Current progress value
- `max`: Maximum value
- `className`: Additional CSS classes

### Avatar

User avatar component.

```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@smatrx/ui';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## Interactive Components

### Modal

Modal dialog component.

```typescript
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@smatrx/ui';

<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
      <ModalDescription>Modal description</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <Button>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Dropdown

Dropdown menu component.

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@smatrx/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Tabs

Tab navigation component.

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@smatrx/ui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Utility Components

### ErrorBoundary

Error boundary for catching React errors.

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <YourComponent />
</ErrorBoundary>
```

### Tooltip

Tooltip component for additional information.

```typescript
import { Tooltip, TooltipTrigger, TooltipContent } from '@smatrx/ui';

<Tooltip>
  <TooltipTrigger asChild>
    <Button>Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Tooltip content</p>
  </TooltipContent>
</Tooltip>
```

## Custom Hooks

### useToast

Toast notification hook.

```typescript
import { useToast } from '@/hooks/use-toast';

const { showToast } = useToast();

// Usage
showToast('success', 'Success message');
showToast('error', 'Error message');
showToast('info', 'Info message');
```

### useMediaQuery

Responsive design hook.

```typescript
import { useMediaQuery } from '@/hooks/use-media-query';

const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
```

### useIntersectionObserver

Intersection observer hook.

```typescript
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

const [ref, isIntersecting] = useIntersectionObserver({
  threshold: 0.1,
});
```

## Styling

### CSS Classes

Components use Tailwind CSS classes for styling:

```typescript
// Size variants
<Button size="sm" className="text-xs px-2 py-1" />
<Button size="lg" className="text-lg px-6 py-3" />

// Color variants
<Button variant="destructive" className="bg-red-500 hover:bg-red-600" />
<Button variant="outline" className="border border-gray-300" />

// Custom styling
<Button className="bg-gradient-to-r from-purple-500 to-pink-500" />
```

### Theme Customization

Customize the design system:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

## Accessibility

### ARIA Support

All components include proper ARIA attributes:

```typescript
<Button aria-label="Close dialog">
  <X className="w-4 h-4" />
</Button>

<Modal aria-labelledby="modal-title" aria-describedby="modal-description">
  <ModalTitle id="modal-title">Modal Title</ModalTitle>
  <ModalDescription id="modal-description">Description</ModalDescription>
</Modal>
```

### Keyboard Navigation

Components support keyboard navigation:

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and dropdowns
- **Arrow keys**: Navigate within menus and tabs

### Screen Reader Support

Components include screen reader support:

```typescript
<Button aria-describedby="button-help">
  Submit
</Button>
<div id="button-help" className="sr-only">
  Submit the form to save your changes
</div>
```

## Testing

### Component Testing

Test components with React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@smatrx/ui';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

test('handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  screen.getByRole('button').click();
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Accessibility Testing

Test accessibility with jest-axe:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Best Practices

### Component Composition

```typescript
// Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Action</Button>
  </CardContent>
</Card>

// Avoid: Monolithic components
<CardWithButton title="Title" buttonText="Action" />
```

### Props Interface

```typescript
// Good: Clear prop interfaces
interface ButtonProps {
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

// Avoid: Any types
interface ButtonProps {
  [key: string]: any;
}
```

### Error Handling

```typescript
// Good: Error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <RiskyComponent />
</ErrorBoundary>

// Good: Loading states
{loading ? <LoadingState /> : <Content />}
```

## Performance

### Lazy Loading

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingState />}>
  <HeavyComponent />
</Suspense>
```

### Memoization

```typescript
// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});
```
