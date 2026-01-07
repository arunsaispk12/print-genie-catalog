# 🚀 Quick Start Guide - Print Genie Catalog

## What's Been Created

Your complete Print Genie catalog system is ready! Here's what you have:

### 📁 Project Structure
```
print-genie-catalog/
├── 📚 docs/                           Documentation
│   ├── CATEGORY_STRUCTURE.md          11 categories, 50+ subcategories
│   ├── SKU_SYSTEM.md                  SKU format, codes, examples
│   └── PRODUCT_NAMING_GUIDE.md        Naming conventions
│
├── 🌐 public/                         Web Application
│   ├── index.html                     Catalog builder interface
│   └── styles.css                     Styling
│
├── 💻 src/                            Application Code
│   ├── app.js                         Main application logic
│   └── data/catalogData.js            Categories, materials, colors
│
├── 📄 README.md                       Full documentation
├── 🔧 GITHUB_SETUP.md                 Git & GitHub guide
├── ⚡ QUICK_START.md                  This file!
└── 📦 package.json                    Project configuration
```

## 🎯 Start Using the Catalog Builder (3 Steps)

### Step 1: Open the Application
```bash
# Option A: Simple (just open in browser)
# Navigate to: print-genie-catalog/public/index.html
# Double-click or right-click → Open with → Your Browser

# Option B: Local Server (better for development)
cd print-genie-catalog
python -m http.server 8000
# Then open: http://localhost:8000/public/

# Option C: Using Node.js
cd print-genie-catalog
npx http-server -p 8000 public/
# Then open: http://localhost:8000/
```

### Step 2: Add Your First Product

1. **Fill in the form:**
   - Product Name: `Phone Stand - Adjustable Angle - PLA (Medium)`
   - Category: `Pre-Designed: Tech & Gadgets`
   - Subcategory: `Phone & Tablet Accessories`
   - Material: `PLA`
   - Color: `BLK - Black`
   - Size: `M - Medium`
   - Price: `24.99`
   - Stock: `10`

2. **Watch the SKU generate automatically:**
   ```
   PG-PDTC01-PLA-BLK-M-0001
   ```

3. **Click "Add Product to Catalog"**

### Step 3: View Your Catalog
- Switch to "View Catalog" tab
- See your product listed
- Try the search and filter features
- Export to CSV when ready

## 📊 Example Products to Add

### Example 1: Custom Prototype
```
Name: Custom Prototype - Client XYZ - ABS
Category: Custom Prints
Subcategory: Prototypes (CP03)
Material: ABS
Color: GRY - Gray
Size: L - Large
Price: 150.00
SKU: PG-CP03-ABS-GRY-L-0002
```

### Example 2: Filament
```
Name: PLA+ Filament - Premium - Galaxy Blue - 1kg
Category: Materials: Filaments by Type
Subcategory: PLA Filament (MFFT01)
Material: PLP - PLA+
Color: BLU - Blue
Size: KG1 - 1 KG
Price: 29.99
SKU: PG-MFFT01-PLP-BLU-KG1-0003
```

### Example 3: Home Decor
```
Name: Geometric Planter - Hexagon - PLA (Small)
Category: Pre-Designed: Home & Living
Subcategory: Home Decor (PDHL04)
Material: PLA
Color: WHT - White
Size: S - Small
Price: 18.50
SKU: PG-PDHL04-PLA-WHT-S-0004
```

## 🔧 Understanding the SKU System

### SKU Format
```
PG - PDTC01 - PLA - BLK - M - 0001
│    │        │     │     │   │
│    │        │     │     │   └─ Sequence Number
│    │        │     │     └───── Size Code
│    │        │     └─────────── Color Code
│    │        └───────────────── Material Code
│    └────────────────────────── Category Code
└─────────────────────────────── Brand (Print Genie)
```

### Quick Code Reference

**Popular Materials:**
- `PLA` - Standard PLA
- `PLP` - PLA+ (Enhanced)
- `PET` - PETG
- `ABS` - ABS
- `TPU` - Flexible

**Common Colors:**
- `BLK` - Black
- `WHT` - White
- `RED` - Red
- `BLU` - Blue
- `GRN` - Green

**Sizes:**
- `S` - Small (50-100mm)
- `M` - Medium (100-150mm)
- `L` - Large (150-200mm)

## 📖 Documentation Guide

### When to Use Each Doc:

**CATEGORY_STRUCTURE.md** → Finding the right category
- Browse all 11 categories
- Find subcategory codes
- Understand category hierarchy

**SKU_SYSTEM.md** → Understanding SKU format
- Complete code listings
- Material codes (17 types)
- Color codes (27 options)
- Size codes (13 variants)
- SKU examples

**PRODUCT_NAMING_GUIDE.md** → Naming products
- Naming formulas
- Category-specific templates
- SEO best practices
- 80+ examples

## 🌐 GitHub Setup (Next Steps)

### 1. Create GitHub Repository
```bash
# Visit: https://github.com/new
# Repository name: print-genie-catalog
# Visibility: Private (recommended)
# Don't initialize with README
# Click: Create repository
```

### 2. Push to GitHub
```bash
cd print-genie-catalog

# Configure git (first time only)
git config user.name "Your Name"
git config user.email "your@email.com"

# Rename branch to main
git branch -M main

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/print-genie-catalog.git

# Push to GitHub
git push -u origin main
```

### 3. Verify
Visit your GitHub repository to see all files uploaded!

For detailed GitHub instructions, see: **GITHUB_SETUP.md**

## 💡 Pro Tips

### Tip 1: Regular Exports
Export your catalog to CSV regularly as backup:
1. Go to "View Catalog" tab
2. Click "Export CSV"
3. Save file with date: `catalog-2026-01-07.csv`

### Tip 2: Browser Bookmark
Bookmark `public/index.html` for quick access

### Tip 3: Product Naming
Always follow the formula:
```
[Function] - [Feature] - [Material] ([Size])
```

### Tip 4: Category Codes
Keep CATEGORY_STRUCTURE.md open while adding products

### Tip 5: SKU Decoder
Use the "SKU Generator" tab to decode any existing SKU

## 🎨 Customization

### Add New Category
Edit: `src/data/catalogData.js`

```javascript
"New Category Name": {
  code: "NC",
  subcategories: {
    "Subcategory 1": { code: "NC01" }
  }
}
```

### Change Colors/Theme
Edit: `public/styles.css`

Look for `:root` variables at the top:
```css
:root {
  --primary-color: #6366f1;  /* Change this! */
}
```

### Add Custom Material
Edit: `src/data/catalogData.js`

```javascript
materials: {
  "NEW": { name: "New Material", description: "Description" }
}
```

## ❓ Common Questions

**Q: Where is my data stored?**
A: In your browser's localStorage. Export to CSV for backups.

**Q: Can I use this offline?**
A: Yes! Just open `public/index.html` in your browser.

**Q: How do I share with team?**
A: Push to GitHub (see GITHUB_SETUP.md) or host on a web server.

**Q: Can I import products from CSV?**
A: Not yet (v1.0). Coming in future version. For now, add manually.

**Q: Maximum products?**
A: Technically unlimited, but browser storage is ~5-10MB (~1000-5000 products).

## 🆘 Troubleshooting

**Issue: SKU not generating**
→ Make sure all required fields are filled (category, material, color, size)

**Issue: Lost products after browser refresh**
→ Check if browser localStorage is enabled. Don't use incognito mode.

**Issue: Export not working**
→ Check browser popup blocker. Allow downloads from the page.

**Issue: Can't push to GitHub**
→ Verify GitHub remote URL: `git remote -v`
→ Check authentication: use Personal Access Token if password fails

## 📞 Support

For detailed information:
- Full documentation: **README.md**
- Category help: **docs/CATEGORY_STRUCTURE.md**
- SKU help: **docs/SKU_SYSTEM.md**
- Naming help: **docs/PRODUCT_NAMING_GUIDE.md**
- Git help: **GITHUB_SETUP.md**

---

**Ready to start?** Open `public/index.html` and add your first product! 🧞

**Print Genie** - Turning digital designs into physical reality
