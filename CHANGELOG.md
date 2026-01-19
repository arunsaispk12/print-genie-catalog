# Changelog

All notable changes to Print Genie Catalog Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-01-19

### Added
- **Enhanced Pricing Engine** (`src/pricingEngine.js`)
  - Corrected electricity rate: ₹6/hour (actual rate)
  - Material costs editable with localStorage persistence
  - Complexity multipliers (Simple to Very Complex)
  - Rush order premiums (Express +20%, Rush +40%, Same-day +75%)
  - Post-processing options with costs
  - 3% failure buffer in cost calculations
  - Automation factor for reduced labor costs
  - Volume discounts up to 30% (7 tiers)
- **Quote Generator** (`src/quoteGenerator.js`)
  - Visual HTML quote generation with Print Genie branding
  - PDF export with professional layout
  - WhatsApp message formatting with emojis
  - Email content generation with mailto links
  - Different layouts for Retail vs Wholesale
  - Cost breakdown display for wholesale quotes
  - Volume pricing tier tables
- **Standalone Pricing Manager** (`public/pricing-manager.html`)
  - 4-tab interface: Quote Generator, Material Prices, Settings, Calculator
  - Live price preview with real-time updates
  - Editable material costs grid
  - Configurable settings for all cost parameters
  - Quick comparison calculator with retail vs wholesale table
  - All export options (PDF, WhatsApp, Email, HTML)

### Changed
- Electricity cost model: from kWh calculation to direct ₹6/hour rate
- Labor cost model: added automation factor (50% reduction)
- Volume discount tiers: expanded to 7 tiers (up to 30% off)
- Markup strategy: separate retail (50%) and wholesale (30%) base markups

---

## [1.2.0] - 2026-01-19

### Added
- **Price Calculator** - Full-featured pricing calculator for 3D prints
  - Retail and Bulk pricing modes with different profit margins
  - Cost breakdown: material, electricity, depreciation, maintenance, labor
  - Volume discounts for bulk orders (5% at 25+, 10% at 50+, 15% at 100+ units)
  - Complexity tiers: Small, Medium, Large, Complex
  - 5 export options: PDF, WhatsApp, Email, CSV, Image (1080x1080)
- **Printer Cost Settings** in Settings tab
  - Configurable electricity rates and printer consumption
  - Depreciation settings (printer cost, lifespan)
  - Maintenance budget configuration
  - Labor rates (setup, monitoring, post-processing)
  - Material costs per kg (14 materials)
  - Settings persist in localStorage
- **New Files**
  - `src/calculator.js` - Calculator logic and export functions
  - `src/pricing-modes.js` - Pricing configuration and defaults
- **jsPDF Integration** - CDN-loaded library for PDF quote generation

### Changed
- Updated `src/app.js` to v1.2.0, added calculator initialization
- Extended `public/admin.html` with Calculator tab and Cost Settings
- Added 480+ lines of calculator-specific CSS to `public/styles.css`

### Technical
- Calculator uses localStorage for cost settings persistence
- PDF export with professional branding and quote details
- Image export creates Instagram-ready 1080x1080 PNG
- WhatsApp export with emoji formatting and clipboard copy

---

## [1.1.1] - 2026-01-09

### Added
- SEO Guide documentation (`SEO-GUIDE.md`)
- Flipkart-style product detail page redesign
- Key Highlights field for products (bullet points)
- Image specifications recommendations in product form
- Intelligent publish reminders after product operations

### Changed
- Removed SKU from specifications table (kept in Additional Info)
- Enhanced product detail page layout

---

## [1.1.0] - 2026-01-08

### Added
- **Indian Rupee (INR) Currency Support** - All pricing uses ₹ symbol
- **Product Image Support**
  - Upload images (max 2MB, base64 storage)
  - Paste image URLs
  - Live preview before saving
  - 60x60px thumbnails in catalog table
- **Dynamic Category Management**
  - Add custom categories without editing code
  - Add subcategories to existing categories
  - View all categories with codes
  - Custom categories marked with "(Custom)" label
- **"Manage Categories" Tab** - New admin tab for category operations
- **GitHub Auto-Publish** - One-click publishing via GitHub API
- **Share Catalog** - Quick sharing options (clipboard, WhatsApp)

### Changed
- Price fields and displays updated for INR
- Catalog table now includes Image column
- CSV export includes "Has Image" column
- `populateFormOptions()` uses merged categories

### Technical
- New localStorage key: `customCategories`
- Product schema extended with `image` field
- 302 new lines added to app.js (+62%)

---

## [1.0.0] - 2026-01-07

### Added
- **Initial Release** - Complete catalog builder system
- **Web Interface** (`public/index.html`)
  - Add Product form with auto SKU generation
  - View Catalog with search and filter
  - SKU Generator tool
  - SKU Decoder tool
  - Export to CSV
- **SKU System**
  - Format: `PG-[CATEGORY]-[MATERIAL]-[COLOR]-[SIZE]-[SEQ]`
  - 11 major categories, 50+ subcategories
  - 17 material codes
  - 27 color codes (standard + special)
  - Size codes (XS, S, M, L, XL, XXL, custom)
- **Product Naming Convention**
  - Format: `[Function] - [Feature] - [Material] ([Size])`
- **Documentation**
  - `docs/CATEGORY_STRUCTURE.md`
  - `docs/SKU_SYSTEM.md`
  - `docs/PRODUCT_NAMING_GUIDE.md`
  - `README.md`
- **Data Persistence** - LocalStorage for catalog data

### Technical
- ES6 modules architecture
- CSS custom properties for theming
- Responsive design (mobile-friendly)
- No external dependencies (vanilla JS)

---

## Version Comparison

| Feature | v1.0.0 | v1.1.0 | v1.2.0 |
|---------|--------|--------|--------|
| Basic Catalog | Yes | Yes | Yes |
| SKU System | Yes | Yes | Yes |
| CSV Export | Yes | Yes | Yes |
| Currency | USD | INR | INR |
| Product Images | No | Yes | Yes |
| Custom Categories | No | Yes | Yes |
| Auto-Publish | No | Yes | Yes |
| Price Calculator | No | No | Yes |
| Cost Settings | No | No | Yes |
| Quote Exports | No | No | Yes |

---

## Upgrade Notes

### From v1.1.x to v1.2.0
- No breaking changes
- New Calculator tab available immediately
- Cost settings default to sensible values
- Existing products and categories preserved

### From v1.0.x to v1.1.x
- No breaking changes
- Products without images show placeholder
- Currency display changes from $ to ₹
- New customCategories localStorage key added

---

## Links

- **Live Demo**: https://arunsaispk12.github.io/print-genie-catalog/public/
- **Admin Panel**: https://arunsaispk12.github.io/print-genie-catalog/public/admin.html
- **Repository**: https://github.com/arunsaispk12/print-genie-catalog

---

*Maintained by Print Genie Development Team*
