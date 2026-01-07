# 🧞 Print Genie - 3D Printing Catalog System

A comprehensive catalog builder and management system for Print Genie's 3D printing business. This system includes category structures, SKU generation, product naming conventions, and a web-based catalog builder.

## 🌐 Live Demo

**Try it now:** https://arunsaispk12.github.io/print-genie-catalog/public/

The catalog builder is hosted on GitHub Pages and ready to use!

## 📋 Project Overview

Print Genie offers four main product types:
- **Custom Prints** - Made-to-order from customer designs
- **Pre-Designed Products** - Ready-made items (Home, Tech, Toys, Automotive, Jewelry, Office)
- **Prototyping Services** - Professional prototyping and iteration
- **Materials & Filaments** - 3D printing supplies and accessories

## 🚀 Quick Start

### Option 1: Run Locally (Simple)
1. Clone this repository
2. Open `public/index.html` in your web browser
3. Start adding products!

### Option 2: Run with Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Then visit: http://localhost:8000/public/
```

## 📁 Project Structure

```
print-genie-catalog/
├── docs/
│   ├── CATEGORY_STRUCTURE.md      # Complete category hierarchy
│   ├── SKU_SYSTEM.md              # SKU format and examples
│   └── PRODUCT_NAMING_GUIDE.md    # Product naming conventions
├── src/
│   ├── data/
│   │   └── catalogData.js         # Category, material, color, size data
│   ├── app.js                     # Main application logic
│   └── components/                # Future: React components
├── public/
│   ├── index.html                 # Catalog builder web interface
│   └── styles.css                 # Application styling
└── README.md
```

## 🎯 Features

### Web Catalog Builder
- **Add Products** - Intuitive form with automatic SKU generation
- **View Catalog** - Searchable, filterable product table
- **SKU Generator** - Quick SKU generation and decoder tool
- **Export** - Export catalog to CSV
- **Local Storage** - Automatic data persistence

### Category System
- 11 major categories
- 50+ subcategories
- Comprehensive product coverage

### SKU System
**Format:** `PG-[CATEGORY]-[MATERIAL]-[COLOR]-[SIZE]-[SEQ]`

**Example:** `PG-PDTC01-PLA-BLK-M-0001`
- `PG` - Print Genie brand
- `PDTC01` - Pre-Designed Tech > Phone & Tablet
- `PLA` - PLA material
- `BLK` - Black color
- `M` - Medium size
- `0001` - Sequential number

### Product Naming Convention
**Format:** `[Function] - [Feature] - [Material] ([Size])`

**Example:** `Phone Stand - Adjustable Angle - PLA (Medium)`

## 📖 Documentation

### Core Documents
1. **[CATEGORY_STRUCTURE.md](docs/CATEGORY_STRUCTURE.md)**
   - Complete category hierarchy
   - All subcategories and codes
   - Usage guidelines

2. **[SKU_SYSTEM.md](docs/SKU_SYSTEM.md)**
   - SKU format specification
   - Material codes (17 types)
   - Color codes (27 options)
   - Size codes
   - Validation checklist

3. **[PRODUCT_NAMING_GUIDE.md](docs/PRODUCT_NAMING_GUIDE.md)**
   - Naming formulas
   - Category-specific guidelines
   - SEO best practices
   - Examples and templates

## 🛠️ Using the Catalog Builder

### Adding a Product

1. **Navigate to "Add Product" tab**
2. **Fill in product details:**
   - Product name (follow naming guide)
   - Select category and subcategory
   - Choose material, color, size
   - Enter price and stock
   - Add description and tags

3. **SKU auto-generates** as you fill the form
4. **Click "Add Product"** - Done!

### Viewing Your Catalog

1. **Navigate to "View Catalog" tab**
2. **Use search** to find products
3. **Filter by category** for focused view
4. **Export to CSV** for external use

### SKU Tools

**Generator:** Quickly create SKUs with custom codes

**Decoder:** Paste any SKU to see its breakdown and meaning

## 🎨 Customization

### Adding New Categories
Edit `src/data/catalogData.js`:
```javascript
"New Category": {
  code: "NC",
  subcategories: {
    "Subcategory 1": { code: "NC01" }
  }
}
```

### Adding Materials/Colors/Sizes
Add to respective sections in `catalogData.js`

### Styling
Modify `public/styles.css` - CSS variables in `:root` for easy theming

## 💾 Data Storage

Products are stored in browser's `localStorage`:
- **Key:** `printGenieCatalog`
- **Format:** JSON array
- **Persistence:** Survives browser refresh
- **Export:** Use "Export CSV" to backup

**Note:** Clear browser data = lost products. Export regularly!

## 🔄 Export/Import

### Export
1. Go to "View Catalog"
2. Click "Export CSV"
3. Save file: `print-genie-catalog-YYYY-MM-DD.csv`

### Import (Manual)
Currently manual import via form. Future: CSV import feature.

## 📊 Example Products

### Phone Stand
```
Name: Phone Stand - Adjustable Angle - PLA (Medium)
SKU: PG-PDTC01-PLA-BLK-M-0001
Category: Pre-Designed: Tech & Gadgets > Phone & Tablet
Material: PLA
Color: Black
Size: Medium
```

### Custom Prototype
```
Name: Custom Prototype - ProjectXYZ - ABS
SKU: PG-CP03-ABS-GRY-L-0002
Category: Custom Prints > Prototypes
Material: ABS
Color: Gray
Size: Large
```

### PLA Filament
```
Name: PLA+ Filament - Premium - Galaxy Blue - 1kg
SKU: PG-MFFT01-PLP-BLU-KG1-0003
Category: Materials > Filaments by Type > PLA
Material: PLA+ (Enhanced)
Color: Blue
Size: 1 KG
```

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] Multi-user support
- [ ] Image uploads
- [ ] Inventory tracking
- [ ] Order management
- [ ] Analytics dashboard
- [ ] Barcode generation
- [ ] CSV import functionality
- [ ] Product variants management
- [ ] Pricing tiers

## 🤝 Contributing

This is a business-specific catalog system. For modifications:

1. Update documentation in `/docs` first
2. Modify data structures in `catalogData.js`
3. Update UI as needed
4. Test thoroughly
5. Commit changes with clear messages

## 📝 Version History

- **v1.0.0** (2026-01-07)
  - Initial release
  - Complete category structure
  - SKU system
  - Product naming guide
  - Web-based catalog builder
  - Export to CSV

## 📄 License

Proprietary - Print Genie Internal Use

## 🆘 Support

For issues or questions:
1. Check documentation in `/docs`
2. Review examples in this README
3. Contact Print Genie development team

---

**Built for Print Genie** 🧞
*Turning digital designs into physical reality*
