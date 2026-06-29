# Create Placeholder Images Script

This document explains how to create placeholder images for the portfolio.

## Quick Setup

Since we cannot generate actual image files programmatically in this environment, you need to manually add images to the following locations:

### Required Images

1. **Profile Photo**
   - Path: `public/content/images/profile.jpg`
   - Size: 400x400px
   - Description: Professional photo of Daniel Navarro

2. **Placeholder Image**
   - Path: `public/content/images/placeholder.jpg`
   - Size: 800x600px
   - Description: Generic placeholder (can be a solid color or pattern)

3. **Project Images**
   - `public/content/images/projects/sentiment-analysis.jpg` (1200x800px)
   - `public/content/images/projects/sentiment-dashboard.jpg` (1200x800px)
   - `public/content/images/projects/churn-prediction.jpg` (1200x800px)
   - `public/content/images/projects/churn-dashboard.jpg` (1200x800px)
   - `public/content/images/projects/medical-classification.jpg` (1200x800px)
   - `public/content/images/projects/medical-gradcam.jpg` (1200x800px)
   - `public/content/images/projects/medical-interface.jpg` (1200x800px)

## Option 1: Use Online Tools

1. **Placeholder.com** - Generate solid color placeholders
   ```
   https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Project+Image
   ```

2. **Unsplash** - Free high-quality photos
   ```
   https://unsplash.com/s/photos/data-science
   ```

3. **Pexels** - Free stock photos
   ```
   https://www.pexels.com/search/technology/
   ```

## Option 2: Create with ImageMagick

If you have ImageMagick installed:

```bash
# Create profile placeholder (400x400)
convert -size 400x400 xc:#0ea5e9 -gravity center -pointsize 30 -fill white -annotate +0+0 "Profile" public/content/images/profile.jpg

# Create generic placeholder (800x600)
convert -size 800x600 xc:#94a3b8 -gravity center -pointsize 40 -fill white -annotate +0+0 "Placeholder" public/content/images/placeholder.jpg

# Create project images (1200x800)
convert -size 1200x800 xc:#0ea5e9 -gravity center -pointsize 50 -fill white -annotate +0+0 "Sentiment Analysis" public/content/images/projects/sentiment-analysis.jpg

convert -size 1200x800 xc:#8b5cf6 -gravity center -pointsize 50 -fill white -annotate +0+0 "Dashboard" public/content/images/projects/sentiment-dashboard.jpg

convert -size 1200x800 xc:#0ea5e9 -gravity center -pointsize 50 -fill white -annotate +0+0 "Churn Prediction" public/content/images/projects/churn-prediction.jpg

convert -size 1200x800 xc:#8b5cf6 -gravity center -pointsize 50 -fill white -annotate +0+0 "Dashboard" public/content/images/projects/churn-dashboard.jpg

convert -size 1200x800 xc:#0ea5e9 -gravity center -pointsize 50 -fill white -annotate +0+0 "Medical Classification" public/content/images/projects/medical-classification.jpg

convert -size 1200x800 xc:#8b5cf6 -gravity center -pointsize 50 -fill white -annotate +0+0 "Grad-CAM" public/content/images/projects/medical-gradcam.jpg

convert -size 1200x800 xc:#10b981 -gravity center -pointsize 50 -fill white -annotate +0+0 "Interface" public/content/images/projects/medical-interface.jpg
```

## Option 3: Use Python with Pillow

```python
from PIL import Image, ImageDraw, ImageFont
import os

# Create directories
os.makedirs('public/content/images/projects', exist_ok=True)

def create_placeholder(width, height, text, color, output_path):
    img = Image.new('RGB', (width, height), color=color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a font, fallback to default if not available
    try:
        font = ImageFont.truetype("arial.ttf", 50)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position (center)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((width - text_width) // 2, (height - text_height) // 2)
    
    draw.text(position, text, fill='white', font=font)
    img.save(output_path, 'JPEG', quality=85)

# Create images
create_placeholder(400, 400, 'Profile', '#0ea5e9', 'public/content/images/profile.jpg')
create_placeholder(800, 600, 'Placeholder', '#94a3b8', 'public/content/images/placeholder.jpg')
create_placeholder(1200, 800, 'Sentiment Analysis', '#0ea5e9', 'public/content/images/projects/sentiment-analysis.jpg')
create_placeholder(1200, 800, 'Dashboard', '#8b5cf6', 'public/content/images/projects/sentiment-dashboard.jpg')
create_placeholder(1200, 800, 'Churn Prediction', '#0ea5e9', 'public/content/images/projects/churn-prediction.jpg')
create_placeholder(1200, 800, 'Dashboard', '#8b5cf6', 'public/content/images/projects/churn-dashboard.jpg')
create_placeholder(1200, 800, 'Medical Classification', '#0ea5e9', 'public/content/images/projects/medical-classification.jpg')
create_placeholder(1200, 800, 'Grad-CAM', '#8b5cf6', 'public/content/images/projects/medical-gradcam.jpg')
create_placeholder(1200, 800, 'Interface', '#10b981', 'public/content/images/projects/medical-interface.jpg')

print("Placeholder images created successfully!")
```

Save this as `scripts/create-placeholders.py` and run:
```bash
python scripts/create-placeholders.py
```

## Verification

After adding images, verify they exist:

```bash
# Check if all required images exist
ls -lh public/content/images/profile.jpg
ls -lh public/content/images/placeholder.jpg
ls -lh public/content/images/projects/
```

## Next Steps

1. Add the actual images to the directories
2. Optimize them using the guidelines in `public/content/images/README.md`
3. Run the build to ensure images are copied to the dist directory
4. Test the portfolio to verify all images load correctly
