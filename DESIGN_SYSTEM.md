# Groovy December Design System

A comprehensive, flexible design system built for the Groovy December festival website. This system ensures consistency across all pages while maintaining the flexibility to add or remove sections as needed by clients.

## 🎨 Design Philosophy

The Groovy December design system embodies:
- **Festival Energy**: Vibrant colors and dynamic gradients
- **Professional Credibility**: Clean typography and structured layouts
- **Cultural Inclusivity**: Warm, welcoming visual language
- **Modular Flexibility**: Easy to add/remove components as needed

## 🏗️ System Structure

```
src/
├── styles/
│   └── design-system.css      # Core CSS variables and utilities
├── components/
│   └── design-system/
│       └── index.tsx          # React component library
└── app/
    └── globals.css            # Global styles and fonts
```

## 🎯 Core Principles

### 1. Fluid & Responsive
- Uses CSS clamp() for fluid typography and spacing
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile-first approach with progressive enhancement

### 2. Component-Based
- Modular components that can be mixed and matched
- Consistent props API across all components
- Easy to add/remove sections without breaking layouts

### 3. Accessible
- WCAG 2.1 AA compliant color contrasts
- Proper focus management and keyboard navigation
- Screen reader friendly markup

### 4. Brand Consistent
- Festival red (#e11d48) as primary color
- Festival gold (#f59e0b) as secondary color
- Poppins for headings, Inter for body text

## 🎨 Color Palette

### Primary Colors (Festival Red)
```css
--color-primary: #e11d48        /* Main brand color */
--color-primary-50: #fef2f2     /* Very light tint */
--color-primary-600: #dc2626    /* Hover states */
--color-primary-900: #7f1d1d    /* Dark accent */
```

### Secondary Colors (Festival Gold)
```css
--color-secondary: #f59e0b      /* Secondary brand color */
--color-secondary-100: #fef3c7  /* Light background */
--color-secondary-600: #d97706  /* Hover states */
```

### Accent Colors
```css
--color-accent-purple: #8b5cf6  /* Royal purple */
--color-accent-blue: #3b82f6    /* Festival blue */
--color-accent-green: #10b981   /* Success green */
--color-accent-orange: #f97316  /* Energy orange */
```

### Gradients
```css
--color-bg-gradient-primary: linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)
--color-bg-gradient-festival: linear-gradient(135deg, #e11d48 0%, #f97316 50%, #f59e0b 100%)
```

## 📝 Typography Scale

### Font Families
- **Headings**: Poppins (bold, energetic)
- **Body**: Inter (clean, readable)
- **Mono**: Fira Code (technical content)

### Fluid Type Scale
```css
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)    /* 12-14px */
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem)      /* 14-16px */
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem)      /* 16-18px */
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem)     /* 18-20px */
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)      /* 20-24px */
--text-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem)       /* 24-30px */
--text-3xl: clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)  /* 30-36px */
--text-4xl: clamp(2.25rem, 1.9rem + 1.75vw, 3rem)       /* 36-48px */
--text-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem)           /* 48-64px */
--text-6xl: clamp(3.75rem, 3rem + 3.75vw, 6rem)         /* 60-96px */
```

## 🧩 Component Library

### Layout Components

#### Container
```tsx
import { Container } from '@/components/design-system';

<Container size="xl">
  <h1>Content goes here</h1>
</Container>
```

Props:
- `size`: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `className`: Additional CSS classes

#### Section
```tsx
import { Section } from '@/components/design-system';

<Section size="lg" background="gradient-festival">
  <Container>
    <h2>Festival Section</h2>
  </Container>
</Section>
```

Props:
- `size`: 'sm' | 'base' | 'lg' | 'xl'
- `background`: 'default' | 'gray' | 'gradient-primary' | 'gradient-secondary' | 'gradient-festival'

#### Grid
```tsx
import { Grid } from '@/components/design-system';

<Grid cols={3} gap={6} responsive>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

### Typography Components

#### Heading
```tsx
import { Heading } from '@/components/design-system';

<Heading level={1} size="5xl">
  Welcome to Groovy December
</Heading>
```

#### Text
```tsx
import { Text } from '@/components/design-system';

<Text size="lg" weight="medium" color="neutral-700">
  Festival description text
</Text>
```

### Interactive Components

#### Button
```tsx
import { Button } from '@/components/design-system';

<Button variant="gradient" size="lg" href="/register">
  Join the Groove
</Button>
```

Variants:
- `primary`: Festival red background
- `secondary`: Festival gold background
- `outline`: Transparent with colored border
- `gradient`: Festival gradient background
- `ghost`: Transparent with hover effect

#### Input & Select
```tsx
import { Input, Select } from '@/components/design-system';

<Input 
  label="Full Name"
  placeholder="Enter your name"
  value={name}
  onChange={setName}
  required
/>

<Select
  label="Country"
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
/>
```

### Display Components

#### Card
```tsx
import { Card } from '@/components/design-system';

<Card variant="festival" padding="lg" hover>
  <h3>Event Title</h3>
  <p>Event description</p>
</Card>
```

#### Hero
```tsx
import { Hero, Button } from '@/components/design-system';

<Hero
  title="Groovy December 2025"
  subtitle="Africa's Ultimate End-of-Year Festival Experience"
  backgroundImage="/hero-bg.jpg"
  actions={
    <>
      <Button variant="gradient" size="xl" href="/register">
        Join the Groove
      </Button>
      <Button variant="outline" size="xl" href="/events">
        View Events
      </Button>
    </>
  }
/>
```

#### Badge
```tsx
import { Badge } from '@/components/design-system';

<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
```

### Festival-Specific Components

#### Countdown
```tsx
import { Countdown } from '@/components/design-system';

<Countdown targetDate="2025-12-15T00:00:00Z" />
```

#### Stats Grid
```tsx
import { StatsGrid } from '@/components/design-system';

<StatsGrid
  stats={[
    { number: "5000", label: "Seats" },
    { number: "35+", label: "Activities" },
    { number: "16", label: "Days" },
    { number: "Multiple", label: "Destinations" }
  ]}
/>
```

## 🎛️ Utility Classes

### Background Utilities
```css
.bg-gradient-primary     /* Red to gold gradient */
.bg-gradient-secondary   /* Purple to blue gradient */
.bg-gradient-festival    /* Multi-color festival gradient */
```

### Animation Classes
```css
.animate-fade-in         /* Fade in animation */
.animate-slide-up        /* Slide up animation */
.animate-bounce-in       /* Bounce in animation */
```

### Spacing Utilities
```css
.section                 /* Standard section padding */
.section-sm             /* Small section padding */
.section-lg             /* Large section padding */
.section-xl             /* Extra large section padding */
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1023px  
- **Desktop**: 1024px+

### Responsive Utilities
```css
.sm\:hidden             /* Hide on mobile */
.md\:grid-cols-2        /* 2 columns on tablet+ */
.lg\:flex               /* Flex on desktop+ */
```

## 🎨 Usage Examples

### Festival Landing Page
```tsx
import { 
  Hero, Container, Section, Grid, Card, 
  Button, Heading, Text, StatsGrid, Countdown 
} from '@/components/design-system';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Groovy December 2025"
        subtitle="Africa's Ultimate End-of-Year Festival Experience"
        actions={
          <>
            <Button variant="gradient" size="xl" href="/register">
              Join the Groove
            </Button>
            <Button variant="outline" size="xl" href="/about">
              Learn More
            </Button>
          </>
        }
      />

      {/* Stats Section */}
      <Section size="lg">
        <Container>
          <StatsGrid
            stats={[
              { number: "5000", label: "Seats" },
              { number: "35+", label: "Activities" },
              { number: "16", label: "Days" },
              { number: "Multiple", label: "Destinations" }
            ]}
          />
        </Container>
      </Section>

      {/* Countdown Section */}
      <Section background="gradient-festival">
        <Container className="text-center">
          <Heading level={2} className="text-white mb-8">
            Event Starts In
          </Heading>
          <Countdown targetDate="2025-12-15T00:00:00Z" />
        </Container>
      </Section>

      {/* Features Grid */}
      <Section size="lg" background="gray">
        <Container>
          <Grid cols={3} responsive>
            <Card variant="default" padding="lg">
              <Heading level={3}>Concerts</Heading>
              <Text>World-class musical performances</Text>
            </Card>
            <Card variant="default" padding="lg">
              <Heading level={3}>Culture</Heading>
              <Text>Rich African cultural experiences</Text>
            </Card>
            <Card variant="default" padding="lg">
              <Heading level={3}>Tourism</Heading>
              <Text>Explore beautiful destinations</Text>
            </Card>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
```

## 🔧 Customization

### Adding New Colors
```css
:root {
  --color-brand-new: #your-color;
  --color-brand-new-50: #lighter-tint;
  --color-brand-new-600: #darker-shade;
}
```

### Creating New Components
```tsx
// Follow the established pattern
interface NewComponentProps {
  variant?: 'default' | 'special';
  size?: 'sm' | 'base' | 'lg';
  className?: string;
  children: ReactNode;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  variant = 'default',
  size = 'base',
  className = '',
  children
}) => {
  // Component implementation
};
```

## 🚀 Getting Started

1. **Import the design system**:
   ```tsx
   import { Hero, Button, Card } from '@/components/design-system';
   ```

2. **Use CSS variables**:
   ```css
   .custom-element {
     color: var(--color-primary);
     padding: var(--space-4);
     border-radius: var(--radius-lg);
   }
   ```

3. **Apply utility classes**:
   ```tsx
   <div className="section bg-gradient-festival">
     <div className="container">
       <h2 className="text-4xl font-bold text-white">Title</h2>
     </div>
   </div>
   ```

## 📝 Best Practices

1. **Always use the design system components** instead of custom CSS
2. **Stick to the color palette** for brand consistency
3. **Use fluid typography** for better responsive design
4. **Test on multiple screen sizes** before deploying
5. **Keep accessibility in mind** with proper contrast and focus states

This design system provides everything needed to create a cohesive, professional, and festival-appropriate website that can easily adapt to client requirements.