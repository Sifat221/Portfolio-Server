# Color Palette

CSS custom variables for Dark and Light modes:

```css
:root {
  /* Dark Mode Default */
  --color-primary: #3b82f6;     /* Electric Blue */
  --color-secondary: #8b5cf6;   /* Vibrant Purple */
  --color-accent: #06b6d4;      /* Cyan Accent */
  
  --color-bg: #0b0f17;          /* Primary Deep Background */
  --color-surface: #151c2c;     /* Card Surface */
  --color-surface-hover: #1e293b;
  
  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-success: #10b981;
}

[data-theme="light"] {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-hover: #f1f5f9;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
}
```
