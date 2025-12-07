# UI Kit - Render.com Inspired Design

A clean, minimal UI component library inspired by Render.com's design aesthetic. All components use Tailwind CSS for styling and are fully responsive.

## Components

### Card
Clean card component with subtle shadows and borders.

```tsx
import Card from '@/components/ui/Card';

<Card hover padding="md" variant="default">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

**Props:**
- `children` (ReactNode) - Card content
- `className` (string) - Additional CSS classes
- `hover` (boolean) - Enable hover effects
- `padding` ('none' | 'sm' | 'md' | 'lg') - Padding size
- `variant` ('default' | 'outlined' | 'elevated') - Card style variant

**Tailwind Classes Used:**
- `rounded-lg` - Rounded corners
- `bg-white` - White background
- `border border-gray-200` - Subtle border
- `shadow-sm` / `shadow-md` - Subtle shadows
- `transition-all duration-200` - Smooth transitions

---

### Badge
Status indicator badge with color variants.

```tsx
import Badge from '@/components/ui/Badge';

<Badge variant="primary" size="md">Active</Badge>
<Badge variant="success" size="sm">Completed</Badge>
```

**Props:**
- `children` (ReactNode) - Badge content
- `variant` ('default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray') - Color variant
- `size` ('sm' | 'md' | 'lg') - Badge size
- `className` (string) - Additional CSS classes

**Tailwind Classes Used:**
- `inline-flex items-center` - Flex layout
- `font-medium rounded-md border` - Styling
- `bg-{color}-50 text-{color}-700 border-{color}-200` - Color variants

---

### Button
Clean button component with multiple variants.

```tsx
import Button from '@/components/ui/Button';

<Button variant="primary" size="md">Click Me</Button>
<Button variant="outline" size="lg" fullWidth>Full Width</Button>
```

**Props:**
- `children` (ReactNode) - Button content
- `variant` ('primary' | 'secondary' | 'outline' | 'ghost' | 'danger') - Button style
- `size` ('sm' | 'md' | 'lg') - Button size
- `fullWidth` (boolean) - Full width button
- `disabled` (boolean) - Disabled state
- All standard button HTML attributes

**Tailwind Classes Used:**
- `font-medium rounded-md` - Base styling
- `bg-gray-900 text-white` - Primary variant (dark, clean)
- `transition-all duration-200` - Smooth transitions
- `focus:ring-2 focus:ring-gray-900 focus:ring-offset-2` - Focus states

---

### SectionHeading
Consistent section headers with optional description.

```tsx
import SectionHeading from '@/components/ui/SectionHeading';

<SectionHeading
  title="Our Projects"
  description="Explore our portfolio of innovative projects"
  align="center"
/>
```

**Props:**
- `title` (string) - Section title
- `description` (string, optional) - Section description
- `align` ('left' | 'center' | 'right') - Text alignment
- `className` (string) - Additional CSS classes
- `actions` (ReactNode, optional) - Action buttons/links

**Tailwind Classes Used:**
- `text-3xl font-semibold text-gray-900` - Title styling
- `text-lg text-gray-600` - Description styling
- `mb-8` - Consistent spacing

---

### TwoColumnLayout
Responsive two-column layout component.

```tsx
import TwoColumnLayout from '@/components/ui/TwoColumnLayout';

<TwoColumnLayout
  left={<div>Left content</div>}
  right={<div>Right content</div>}
  gap="md"
  reverse={false}
/>
```

**Props:**
- `left` (ReactNode) - Left column content
- `right` (ReactNode) - Right column content
- `reverse` (boolean) - Reverse column order on desktop
- `gap` ('sm' | 'md' | 'lg') - Gap between columns
- `className` (string) - Additional CSS classes
- `leftClassName` (string) - Left column classes
- `rightClassName` (string) - Right column classes

**Tailwind Classes Used:**
- `grid grid-cols-1 lg:grid-cols-2` - Responsive grid
- `gap-4` / `gap-8` / `gap-12` - Gap sizes

---

## Design Principles

### Render.com Inspired Styling

1. **Clean Borders**: Subtle `border-gray-200` borders
2. **Minimal Shadows**: `shadow-sm` and `shadow-md` for depth
3. **Neutral Colors**: Gray scale with accent colors
4. **Smooth Transitions**: `transition-all duration-200`
5. **Rounded Corners**: `rounded-lg` and `rounded-md`
6. **Typography**: Clean, readable fonts with proper hierarchy
7. **Spacing**: Consistent padding and margins

### Key Tailwind Classes

```css
/* Cards */
.bg-white
.border.border-gray-200
.shadow-sm / .shadow-md
.rounded-lg
.transition-all.duration-200

/* Buttons */
.bg-gray-900 (primary)
.text-white
.rounded-md
.hover:bg-gray-800

/* Badges */
.bg-{color}-50
.text-{color}-700
.border.border-{color}-200
.rounded-md

/* Layout */
.grid.grid-cols-1.lg:grid-cols-2
.gap-{size}
```

---

## Usage Examples

### Projects Page Integration

```tsx
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectGallery from '@/components/ProjectGallery';

export default function ProjectsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          title="Our Projects"
          description="Explore our portfolio"
          align="center"
        />
        <ProjectGallery />
      </div>
    </div>
  );
}
```

### Hero Section Integration

```tsx
import Hero from '@/components/Hero';
import Button from '@/components/ui/Button';

<Hero
  title="Welcome to Aelvynor"
  subtitle="Discover innovative projects"
  ctaText="Explore Projects"
  ctaLink="/projects"
/>
```

### Project Card with UI Kit

```tsx
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

<Card hover padding="none">
  <img src={imageUrl} alt={title} />
  <div className="p-6">
    <h3>{title}</h3>
    <div className="flex gap-2">
      <Badge variant="primary" size="sm">React</Badge>
      <Badge variant="primary" size="sm">TypeScript</Badge>
    </div>
    <Button variant="ghost" size="sm">View Details →</Button>
  </div>
</Card>
```

---

## Installation

The UI kit uses:
- `clsx` - For conditional class names
- `tailwind-merge` - For merging Tailwind classes

```bash
npm install clsx tailwind-merge
```

---

## Customization

All components accept `className` props for custom styling. Use the `cn()` utility function from `@/lib/utils` to merge classes properly.

```tsx
import { cn } from '@/lib/utils';

<Card className={cn('custom-class', 'another-class')}>
  Content
</Card>
```

