# AMS Color Theme Guide

## Primary Color: Dark Blue (#000038)

Your AMS application now uses a sophisticated color palette built around your primary dark blue color (#000038). This creates a professional, trustworthy appearance perfect for a business management system.

## Color Palette

### Primary Colors

- **Primary 900**: `#000038` - Your main dark blue (used for headers, primary buttons, and key UI elements)
- **Primary 800**: `#3730a3` - Darker blue for hover states
- **Primary 700**: `#4338ca` - Medium dark blue
- **Primary 500**: `#6366f1` - Medium blue for accents
- **Primary 100**: `#e0e9ff` - Light blue for backgrounds
- **Primary 50**: `#f0f4ff` - Very light blue for subtle backgrounds

### Secondary Colors (Grays)

- **Neutral 900**: `#171717` - Darkest gray for text
- **Neutral 600**: `#525252` - Medium gray for secondary text
- **Neutral 300**: `#d4d4d4` - Light gray for borders
- **Neutral 100**: `#f5f5f5` - Very light gray for backgrounds
- **Neutral 50**: `#fafafa` - Lightest gray for page backgrounds

### Status Colors

- **Success**: Green tones for completed/successful states
- **Warning**: Yellow/amber tones for pending/warning states
- **Error**: Red tones for errors/failed states
- **Accent**: Gold/yellow tones for highlights and current states

## Usage Guidelines

### Buttons

```css
.btn-primary     /* Dark blue background with white text */
/* Dark blue background with white text */
.btn-secondary   /* Light gray background with dark text */
.btn-outline     /* Dark blue border with dark blue text */
.btn-ghost; /* Transparent with dark blue text */
```

### Cards

```css
.card           /* White background with subtle shadow */
/* White background with subtle shadow */
.card-elevated  /* White background with primary shadow */
.card-dark; /* Dark blue background with white text */
```

### Status Indicators

```css
.badge-success  /* Green background for success states */
/* Green background for success states */
.badge-warning  /* Yellow background for warning states */
.badge-error    /* Red background for error states */
.badge-info; /* Blue background for info states */
```

### Pipeline Steps

```css
.pipeline-step              /* Dark blue for completed steps */
/* Dark blue for completed steps */
.pipeline-step-completed    /* Green for completed steps */
.pipeline-step-current      /* Gold for current step */
.pipeline-step-pending; /* Gray for pending steps */
```

## Design Principles

1. **Consistency**: Use the predefined color classes rather than custom colors
2. **Accessibility**: All color combinations meet WCAG AA contrast requirements
3. **Hierarchy**: Use darker colors for more important elements
4. **Feedback**: Use status colors to provide clear visual feedback
5. **Professional**: The dark blue creates a trustworthy, business-appropriate appearance

## Customization

To modify colors, update the `tailwind.config.js` file:

```javascript
colors: {
  primary: {
    900: '#000038', // Your main color
    // ... other shades
  }
}
```

## Examples

### Dashboard Cards

- Metric cards use gradient backgrounds from primary-50 to primary-100
- Pipeline steps use the primary-900 for completed states
- Activity items use colored dots for status indication

### Navigation

- Header uses primary-900 background
- Active navigation links use primary-50 background
- Hover states use primary-100

### Forms

- Input focus states use primary-500 ring
- Error states use error-500 colors
- Success states use success-500 colors

This color system provides a cohesive, professional appearance that reinforces your brand identity while maintaining excellent usability and accessibility.
