# Print Genie - 3D Printing Catalog System

A comprehensive catalog builder and management system for Print Genie's 3D printing business. This system includes category structures, SKU generation, product naming conventions, price calculator, and a web-based catalog builder.

**Current Version:** v1.2.0 | [View Changelog](CHANGELOG.md)

## Live Demo

- **Public Catalog:** https://arunsaispk12.github.io/print-genie-catalog/public/catalog.html
- **Admin Panel:** https://arunsaispk12.github.io/print-genie-catalog/public/admin.html

The catalog builder is hosted on GitHub Pages and ready to use!

## Project Overview

Print Genie offers four main product types:
- **Custom Prints** - Made-to-order from customer designs
- **Pre-Designed Products** - Ready-made items (Home, Tech, Toys, Automotive, Jewelry, Office)
- **Prototyping Services** - Professional prototyping and iteration
- **Materials & Filaments** - 3D printing supplies and accessories

## Quick Start

### Option 1: Use Live Version
Visit the [Admin Panel](https://arunsaispk12.github.io/print-genie-catalog/public/admin.html) directly.

### Option 2: Run Locally
```bash
# Clone repository
git clone https://github.com/arunsaispk12/print-genie-catalog.git
cd print-genie-catalog

# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Visit: http://localhost:8000/public/admin.html
```

## Project Structure

```
print-genie-catalog/
├── docs/
│   ├── CATEGORY_STRUCTURE.md      # Complete category hierarchy
│   ├── SKU_SYSTEM.md              # SKU format and examples
│   └── PRODUCT_NAMING_GUIDE.md    # Product naming conventions
├── src/
│   ├── data/
│   │   ├── catalogData.js         # Category, material, color, size data
│   │   └── sampleProducts.js      # Sample product data
│   ├── app.js                     # Main application logic
│   ├── calculator.js              # Price calculator module (v1.2.0)
│   └── pricing-modes.js           # Pricing configuration (v1.2.0)
├── public/
│   ├── admin.html                 # Admin panel interface
│   ├── catalog.html               # Public catalog page
│   ├── product.html               # Product detail page
│   ├── catalog-data.json          # Published catalog data
│   └── styles.css                 # Application styling
├── CHANGELOG.md                   # Version history
├── README.md                      # This file
└── [other docs]                   # Feature guides and setup docs
```

## Features

### v1.2.0 - Price Calculator (NEW)
- **Retail/Bulk Pricing Modes** - Different margins for customer types
- **Cost Breakdown** - Material, electricity, depreciation, maintenance, labor
- **Volume Discounts** - 5% (25+), 10% (50+), 15% (100+ units) for bulk
- **5 Export Options** - PDF, WhatsApp, Email, CSV, Image (1080x1080)
- **Configurable Costs** - All printer costs editable in Settings tab

### Core Features
- **Add Products** - Intuitive form with automatic SKU generation
- **Product Images** - Upload or paste URL with live preview
- **View Catalog** - Searchable, filterable product table
- **Category Management** - Create custom categories without code
- **SKU Generator** - Quick SKU generation and decoder tool
- **Auto-Publish** - One-click GitHub Pages publishing
- **Export** - Export catalog to CSV
- **INR Currency** - All prices in Indian Rupees

### Category System
- 11 major categories
- 50+ subcategories
- Dynamic category creation
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

## Admin Panel Tabs

| Tab | Description |
|-----|-------------|
| **Add Product** | Create new products with auto SKU |
| **View Catalog** | Browse, search, edit, delete products |
| **Manage Categories** | Add custom categories/subcategories |
| **SKU Generator** | Quick SKU tools and decoder |
| **Calculator** | Price calculator with exports (v1.2.0) |
| **Settings** | GitHub auto-publish + Cost settings |
| **Documentation** | Quick reference guide |

## Price Calculator Usage

1. Navigate to **Calculator** tab
2. Select pricing mode: **Retail** or **Bulk**
3. Enter print details:
   - Weight (grams)
   - Print time (hours)
   - Material
   - Complexity tier
   - Quantity
4. Click **Calculate Price**
5. View cost breakdown (bulk mode)
6. Export quote: PDF, WhatsApp, Email, CSV, or Image

### Pricing Modes

| Mode | Min Qty | Profit Margins | Labor | Volume Discounts |
|------|---------|----------------|-------|------------------|
| Retail | 1 | 25-35% | 100% | None |
| Bulk | 10 | 15-20% | 80% | 5-15% |

## Documentation

### Core Documents
- [CATEGORY_STRUCTURE.md](docs/CATEGORY_STRUCTURE.md) - Category hierarchy
- [SKU_SYSTEM.md](docs/SKU_SYSTEM.md) - SKU format specification
- [PRODUCT_NAMING_GUIDE.md](docs/PRODUCT_NAMING_GUIDE.md) - Naming conventions

### Setup & Guides
- [QUICK_START.md](QUICK_START.md) - Getting started guide
- [AUTO_PUBLISH_SETUP.md](AUTO_PUBLISH_SETUP.md) - GitHub auto-publish setup
- [HOW_TO_PUBLISH.md](HOW_TO_PUBLISH.md) - Publishing workflow
- [SEO-GUIDE.md](SEO-GUIDE.md) - SEO optimization tips

### Release Notes
- [CHANGELOG.md](CHANGELOG.md) - Complete version history
- [FEATURES_UPDATE_v1.1.md](FEATURES_UPDATE_v1.1.md) - v1.1.0 details

## Data Storage

### LocalStorage Keys
| Key | Purpose |
|-----|---------|
| `printGenieCatalog` | Product catalog array |
| `nextSequence` | Next SKU sequence number |
| `customCategories` | User-created categories |
| `githubSettings` | Auto-publish credentials |
| `printerCostSettings` | Calculator cost config (v1.2.0) |

### Export Options
- **CSV** - Spreadsheet format for catalog
- **JSON** - Full catalog data (via publish)
- **PDF** - Price quotes (Calculator)
- **Image** - Instagram-ready quotes (Calculator)

## Customization

### Adding Materials/Colors/Sizes
Edit `src/data/catalogData.js`:
```javascript
materials: {
  "NEW": { name: "New Material", description: "..." }
}
```

### Modifying Cost Defaults
Edit `src/pricing-modes.js`:
```javascript
export const defaultCostSettings = {
  electricity: { rate: 8, consumption: 0.2 },
  // ...
};
```

### Styling
Modify `public/styles.css` - CSS variables in `:root` for easy theming.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| v1.2.0 | 2026-01-19 | Price Calculator, Cost Settings, Quote Exports |
| v1.1.0 | 2026-01-08 | INR currency, Images, Category management, Auto-publish |
| v1.0.0 | 2026-01-07 | Initial release, SKU system, Basic catalog |

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## Contributing

1. Update documentation in `/docs` first
2. Modify data structures in `catalogData.js`
3. Update UI as needed
4. Test thoroughly
5. Update CHANGELOG.md
6. Commit with clear messages

## License

Proprietary - Print Genie Internal Use

## Support

For issues or questions:
1. Check documentation in `/docs`
2. Review [CHANGELOG.md](CHANGELOG.md) for recent changes
3. Contact Print Genie development team

---

**Built for Print Genie** | *Turning digital designs into physical reality*
