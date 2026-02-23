# design system

dark claymorphism + neon accents. syncopate for headings, space mono for body. dark mode only.

## colors

### backgrounds
- base: `#0F0F1A`
- surface (cards): `#1A1A2E`
- elevated (modals): `#252540`
- muted: `#16162A`

### neons
- pink: `#FF69B4` - primary accent, CTAs
- cyan: `#00FFFF` - secondary, music-related stuff
- purple: `#BF00FF` - gradients
- dim variants for hovers: `#CC5490`, `#00CCCC`

### text
- primary: `#FFFFFF`
- secondary: `#E0E0FF`
- muted: `#8080A0`

### status
- success: `#00FF88`
- warning: `#FFB800`
- error: `#FF4757`

## typography

```css
--font-heading: 'Syncopate', sans-serif;
--font-body: 'Space Mono', monospace;
```

headings are uppercase, bold, letter-spacing 0.05em.

sizes go from 12px (xs) up to 64px (4xl). body text is 16px.

## spacing

4px base unit. scale goes 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

## border radius

- sm: 8px (small elements)
- md: 12px (buttons, inputs)
- lg: 16px (cards)
- xl: 20px (big cards)
- full: 9999px (pills, avatars)

## shadows

the clay effect comes from combining outer glows with inset shadows:

```css
/* card */
box-shadow:
  0 8px 32px rgba(0, 255, 255, 0.1),
  0 4px 16px rgba(191, 0, 255, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.05),
  inset 0 -2px 8px rgba(0, 0, 0, 0.3);

/* button */
box-shadow:
  0 4px 16px rgba(255, 105, 180, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.2),
  inset 0 -2px 4px rgba(0, 0, 0, 0.2);

/* pressed button - flatten it */
box-shadow:
  0 2px 8px rgba(255, 105, 180, 0.2),
  inset 0 2px 4px rgba(0, 0, 0, 0.3);
```

## animations

- micro stuff: 150-200ms
- transitions: 200-300ms
- page transitions: 300-400ms
- bg floating elements: 15-20s loops

easings:
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

buttons scale to 0.95 on press (framer motion spring). cards lift 2px on hover with increased glow.

respect `prefers-reduced-motion`.

## components

**ClayCard** - surface bg, 20px radius, clay shadow, lifts on hover

**ClayButton** - 12px radius, syncopate font, scales on press. variants: primary (pink bg), secondary (transparent + border), ghost (just text)

**GlowInput** - muted bg, 2px border, cyan glow on focus

**NeonBadge** - pill shape, translucent neon bg + matching border

## layout

max widths: 640, 768, 1024, 1280

card grid gap: 24px, form gap: 16px, sections: 48-64px

## z-index

base 0, floating 10, dropdowns 20, sticky 30, modals 40, toasts 50

## a11y notes

- body on bg-base is 15.5:1 (AAA)
- muted text is 4.7:1 (AA)
- neon pink is 6.2:1 (AA)
- min touch targets 44x44px
- focus-visible uses 2px cyan outline
