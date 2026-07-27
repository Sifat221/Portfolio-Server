# Performance Optimization Strategy

Web Vitals and rendering targets:

- **Image Optimization:** Responsive WebP images with `loading="lazy"` attributes.
- **Code Splitting & Lazy Loading:** Asynchronous dynamic loading of section components and JSON datasets.
- **Compression:** Gzip/Brotli HTTP response compression.
- **Caching Strategy:** Cache-Control headers for static assets.
- **Bundle Size:** Zero heavy external UI framework dependencies.
