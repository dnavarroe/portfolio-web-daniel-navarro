#!/usr/bin/env python3
"""
Script to create placeholder images for the portfolio website.
Requires: pip install pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder(width, height, text, color, output_path):
    """Create a placeholder image with text centered."""
    # Convert hex color to RGB
    if color.startswith('#'):
        color = color[1:]
    rgb = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))
    
    # Create image
    img = Image.new('RGB', (width, height), color=rgb)
    draw = ImageDraw.Draw(img)
    
    # Try to use a font, fallback to default if not available
    try:
        # Try different font paths for different systems
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",  # Linux
            "/System/Library/Fonts/Helvetica.ttc",  # macOS
            "C:\\Windows\\Fonts\\arial.ttf",  # Windows
        ]
        font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, 50)
                break
        if font is None:
            font = ImageFont.load_default()
    except Exception as e:
        print(f"Warning: Could not load custom font, using default. Error: {e}")
        font = ImageFont.load_default()
    
    # Calculate text position (center)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((width - text_width) // 2, (height - text_height) // 2)
    
    # Draw text
    draw.text(position, text, fill='white', font=font)
    
    # Save image
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'JPEG', quality=85)
    print(f"Created: {output_path}")

def main():
    """Create all placeholder images for the portfolio."""
    print("Creating placeholder images...")
    
    # Create directories
    os.makedirs('public/content/images/projects', exist_ok=True)
    
    # Profile image
    create_placeholder(
        400, 400, 
        'Daniel\nNavarro', 
        '0ea5e9', 
        'public/content/images/profile.jpg'
    )
    
    # Generic placeholder
    create_placeholder(
        800, 600, 
        'Placeholder', 
        '94a3b8', 
        'public/content/images/placeholder.jpg'
    )
    
    # Project images
    projects = [
        ('sentiment-analysis.jpg', 'Sentiment\nAnalysis', '0ea5e9'),
        ('sentiment-dashboard.jpg', 'Dashboard', '8b5cf6'),
        ('churn-prediction.jpg', 'Churn\nPrediction', '0ea5e9'),
        ('churn-dashboard.jpg', 'Dashboard', '8b5cf6'),
        ('medical-classification.jpg', 'Medical\nClassification', '0ea5e9'),
        ('medical-gradcam.jpg', 'Grad-CAM', '8b5cf6'),
        ('medical-interface.jpg', 'Interface', '10b981'),
        ('exploratory-data-analysis-banking.jpg', 'Exploratory Data\nAnalysis', '0ea5e9'),
        ('data-visualization-techniques.jpg', 'Data\nVisualization', '8b5cf6'),
        ('customer-segmentation-kmeans.jpg', 'Customer\nSegmentation', '0ea5e9'),
        ('security-incident-cost-prediction.jpg', 'Security Incident\nCost Prediction', '8b5cf6'),
        ('spam-detection-logistic-regression.jpg', 'Spam\nDetection', '0ea5e9'),
        ('recommendation-systems-surprise.jpg', 'Recommendation\nSystems', '8b5cf6'),
        ('malicious-url-detection-svm.jpg', 'Malicious URL\nDetection', '0ea5e9'),
        ('weather-time-series-rnn.jpg', 'Weather Time Series\nPrediction (RNN)', '8b5cf6'),
        ('android-malware-detection-decision-trees.jpg', 'Android Malware\nDetection', '0ea5e9'),
    ]
    
    for filename, text, color in projects:
        create_placeholder(
            1200, 800, 
            text, 
            color, 
            f'public/content/images/projects/{filename}'
        )
    
    print("\n[OK] All placeholder images created successfully!")
    print("\nNext steps:")
    print("1. Replace these placeholders with actual project images")
    print("2. Optimize images using tools mentioned in public/content/images/README.md")
    print("3. Run 'npm run build' to verify images are included in the build")

if __name__ == '__main__':
    main()
