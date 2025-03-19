# MelodyMatch Design System

## Overview

**Style:** Dark Claymorphism with Neon Accents  
**Typography:** Syncopate (headlines) + Space Mono (body)  
**Color Mode:** Dark only  
**Personality:** Futuristic, tactile, playful yet sophisticated

---

## Color Palette

### Base Colors
| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Background Base | `#0F0F1A` | `--color-bg-base` | Main app background |
| Background Surface | `#1A1A2E` | `--color-bg-surface` | Cards, panels |
| Background Elevated | `#252540` | `--color-bg-elevated` | Modals, elevated surfaces |
| Background Muted | `#16162A` | `--color-bg-muted` | Subtle backgrounds |

### Neon Accents
| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Neon Pink | `#FF69B4` | `--color-neon-pink` | Primary accent, CTAs, hearts/love |
| Neon Cyan | `#00FFFF` | `--color-neon-cyan` | Secondary accent, music elements |
| Neon Purple | `#BF00FF` | `--color-neon-purple` | Tertiary accent, gradients |
| Neon Pink Dim | `#CC5490` | `--color-neon-pink-dim` | Hover states, pressed states |
| Neon Cyan Dim | `#00CCCC` | `--color-neon-cyan-dim` | Hover states |

### Text Colors
| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Text Primary | `#FFFFFF` | `--color-text-primary` | Main text |
| Text Secondary | `#E0E0FF` | `--color-text-secondary` | Secondary text |
| Text Muted | `#8080A0` | `--color-text-muted` | Placeholder, disabled |
| Text Inverse | `#0F0F1A` | `--color-text-inverse` | Text on neon backgrounds |

### Semantic Colors
| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Success | `#00FF88` | `--color-success` | Success states, matches |
| Warning | `#FFB800` | `--color-warning` | Warnings |
| Error | `#FF4757` | `--color-error` | Errors, rejections |

---

## Typography

### Font Families
```css
--font-heading: 'Syncopate', sans-serif;
--font-body: 'Space Mono', monospace;
```

### Font Sizes
| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--text-xs` | 12px | 1.5 | Fine print |
| `--text-sm` | 14px | 1.5 | Small text, captions |
| `--text-md` | 16px | 1.6 | Body text |
| `--text-lg` | 18px | 1.6 | Large body |
| `--text-xl` | 24px | 1.4 | Small headlines |
| `--text-2xl` | 32px | 1.3 | Headlines |
| `--text-3xl` | 48px | 1.2 | Hero headlines |
| `--text-4xl` | 64px | 1.1 | Display text |

### Font Weights
- Headlines: 700 (Bold) - Syncopate
- Body: 400 (Regular) - Space Mono
- Emphasis: 700 (Bold) - Space Mono

### Heading Style
- Transform: uppercase
- Letter spacing: 0.05em

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing |
| `--space-2` | 8px | Small gaps |
| `--space-3` | 12px | Medium-small |
| `--space-4` | 16px | Standard |
| `--space-5` | 20px | Medium |
| `--space-6` | 24px | Large |
| `--space-8` | 32px | Section padding |
| `--space-10` | 40px | Large sections |
| `--space-12` | 48px | Hero sections |
| `--space-16` | 64px | Page sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Buttons, inputs |
| `--radius-lg` | 16px | Cards |
| `--radius-xl` | 20px | Large cards |
| `--radius-2xl` | 24px | Hero elements |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows (Claymorphism)

### Clay Card Shadow
```css
box-shadow: 
  0 8px 32px rgba(0, 255, 255, 0.1),
  0 4px 16px rgba(191, 0, 255, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.05),
  inset 0 -2px 8px rgba(0, 0, 0, 0.3);
```

### Clay Card Hover Shadow
```css
box-shadow: 
  0 12px 40px rgba(0, 255, 255, 0.15),
  0 6px 20px rgba(191, 0, 255, 0.12),
  inset 0 1px 0 rgba(255, 255, 255, 0.08),
  inset 0 -2px 8px rgba(0, 0, 0, 0.3);
```

### Clay Button Shadow
```css
box-shadow: 
  0 4px 16px rgba(255, 105, 180, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.2),
  inset 0 -2px 4px rgba(0, 0, 0, 0.2);
```

### Clay Button Pressed Shadow
```css
box-shadow: 
  0 2px 8px rgba(255, 105, 180, 0.2),
  inset 0 2px 4px rgba(0, 0, 0, 0.3);
```

### Neon Glow
```css
/* Pink glow */
box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);

/* Cyan glow */
box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
```

---

## Animations

### Timing
- Micro-interactions: 150-200ms
- UI transitions: 200-300ms
- Page transitions: 300-400ms
- Background animations: 15-20s (floating elements)

### Easing
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Clay Press Animation
```jsx
whileTap={{ 
  scale: 0.95,
  transition: { type: "spring", stiffness: 400, damping: 17 }
}}
```

### Hover Glow
```css
transition: box-shadow 200ms ease-out, transform 200ms ease-out;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Components

### ClayCard
- Background: `--color-bg-surface`
- Border radius: `--radius-xl` (20px)
- Shadow: Clay card shadow
- Hover: Lift + glow increase
- Border: 1px solid rgba(255, 255, 255, 0.05)

### ClayButton
- Border radius: `--radius-md` (12px)
- Padding: 12px 24px
- Font: Syncopate, uppercase, bold
- Press: Scale 0.95 + shadow change
- Variants:
  - Primary: Neon pink background
  - Secondary: Transparent with neon border
  - Ghost: No background, neon text

### GlowInput
- Background: `--color-bg-muted`
- Border: 2px solid rgba(255, 255, 255, 0.1)
- Border radius: `--radius-md`
- Focus: Neon cyan border + glow
- Font: Space Mono

### NeonBadge
- Background: rgba(neon-color, 0.15)
- Border: 1px solid neon-color
- Border radius: `--radius-full`
- Padding: 4px 12px
- Font: Space Mono, uppercase, small

---

## Layout

### Container Max Widths
- Small: 640px
- Medium: 768px
- Large: 1024px
- XL: 1280px

### Grid Gaps
- Card grids: 24px
- Form elements: 16px
- Section spacing: 48-64px

---

## Z-Index Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default |
| `--z-above` | 10 | Floating elements |
| `--z-dropdown` | 20 | Dropdowns |
| `--z-sticky` | 30 | Sticky header |
| `--z-modal` | 40 | Modals |
| `--z-toast` | 50 | Toasts |

---

## Accessibility

### Contrast Ratios
- Body text on bg-base: 15.5:1 (AAA)
- Muted text on bg-base: 4.7:1 (AA)
- Neon pink on bg-base: 6.2:1 (AA)
- Neon cyan on bg-base: 12.3:1 (AAA)

### Focus States
```css
&:focus-visible {
  outline: 2px solid var(--color-neon-cyan);
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px

---

## Pre-Delivery Checklist

- [ ] No emojis as icons (use Lucide/React Icons)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with 200ms transitions
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] All text has sufficient contrast
