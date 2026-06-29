# Content Images Directory

This directory contains all images used in the portfolio website.

## Directory Structure

```
images/
├── profile.jpg              # Profile photo for Daniel Navarro
├── placeholder.jpg          # Placeholder image for errors/missing images
└── projects/               # Project images
    ├── sentiment-analysis.jpg
    ├── sentiment-dashboard.jpg
    ├── churn-prediction.jpg
    ├── churn-dashboard.jpg
    ├── medical-classification.jpg
    ├── medical-gradcam.jpg
    └── medical-interface.jpg
```

## Image Requirements

### Profile Photo (profile.jpg)
- **Dimensions:** 400x400px (square)
- **Format:** JPEG or WebP
- **Size:** < 200KB
- **Description:** Professional headshot of Daniel Navarro

### Placeholder Image (placeholder.jpg)
- **Dimensions:** 800x600px
- **Format:** JPEG or WebP
- **Size:** < 100KB
- **Description:** Generic placeholder for missing project images

### Project Images
- **Dimensions:** 1200x800px (landscape) or 800x800px (square)
- **Format:** JPEG or WebP (WebP preferred for better compression)
- **Size:** < 500KB per image
- **Optimization:** Use tools like ImageOptim, TinyPNG, or Squoosh to optimize

## Image Optimization Guidelines

1. **Format Selection:**
   - Use WebP format when possible (better compression)
   - Provide JPEG fallback for older browsers
   - Use the OptimizedImage component which handles format selection

2. **Compression:**
   - JPEG quality: 80-85%
   - WebP quality: 75-80%
   - Use progressive/interlaced encoding

3. **Responsive Images:**
   - Generate multiple sizes: thumbnail (400px), medium (800px), large (1200px)
   - Use srcset attribute for responsive loading

4. **Lazy Loading:**
   - All images below the fold should use loading="lazy"
   - Critical images (profile photo) should use loading="eager"

## Adding New Images

1. Place the image file in the appropriate directory
2. Optimize the image using one of the recommended tools
3. Update the corresponding JSON file with the correct path
4. Test that the image loads correctly in both development and production

## Image Optimization Tools

- **Online:** TinyPNG, Squoosh, ImageOptim
- **CLI:** imagemagick, sharp, cwebp
- **Batch Processing:** Use the provided script in `/scripts/optimize-images.sh`

## Example Optimization Commands

```bash
# Convert JPEG to WebP
cwebp -q 80 input.jpg -o output.webp

# Resize and optimize JPEG
convert input.jpg -resize 1200x800 -quality 85 output.jpg

# Batch optimize all JPEGs in directory
for file in *.jpg; do
  cwebp -q 80 "$file" -o "${file%.jpg}.webp"
done
```

## Notes

- All image paths in JSON files should be relative to the public directory
- Example: `/content/images/projects/project-name.jpg`
- The build process will copy these images to the dist directory
- Ensure all referenced images exist to avoid broken image links
