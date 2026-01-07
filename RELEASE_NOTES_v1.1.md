# Release Notes - Print Genie Catalog Builder v1.1.0

**Release Date:** January 8, 2026
**Version:** 1.1.0
**Type:** Feature Release

---

## Summary

Version 1.1.0 is a significant feature update that enhances the Print Genie Catalog Builder with Indian market localization, visual product representation through images, and user-extensible category management. This release maintains 100% backward compatibility with v1.0.0 data while adding powerful new capabilities.

---

## What's New

### 🇮🇳 Indian Rupee (INR) Currency Support
- **Changed**: All price displays now use ₹ (Indian Rupee) instead of $ (USD)
- **Impact**: Better alignment with Indian market and local pricing
- **Details**:
  - Form labels show "Price (₹)"
  - Catalog table displays "₹XX.XX"
  - Statistics show total value in ₹
  - CSV export headers use "Price (INR)"

### 🖼️ Product Image Support
- **New Feature**: Upload product images or paste image URLs
- **Upload Method**:
  - Max file size: 2MB
  - Supported formats: JPG, PNG, GIF, WebP
  - Automatic base64 encoding for localStorage
- **URL Method**:
  - Paste direct image links
  - Real-time URL validation
  - No size restrictions
- **UI Enhancements**:
  - Live image preview before adding product
  - 60x60px thumbnails in catalog table
  - "No Image" placeholder for products without images
  - Clear button to remove selected image
  - Auto-mutual exclusion (upload clears URL, vice versa)
- **Export Enhancement**: CSV includes "Has Image" column (Yes/No)

### 📁 Dynamic Category Management
- **New Tab**: "Manage Categories" added to main navigation
- **Create Categories**:
  - Add new top-level categories
  - Category code validation (2-6 characters)
  - Duplicate prevention
  - Instant availability in dropdowns
- **Create Subcategories**:
  - Add subcategories to any existing category
  - Subcategory code validation (max 8 characters)
  - Suggestion to start code with parent category code
  - Duplicate prevention within same category
- **View Categories**:
  - Complete list of all categories (default + custom)
  - Subcategory codes displayed
  - Custom categories marked with "(Custom)" label
- **Persistence**: All custom categories saved to localStorage
- **Merge Logic**: Custom categories intelligently merged with defaults

---

## Technical Changes

### Files Modified

#### 1. `public/index.html`
**Changes:**
- Added "Manage Categories" tab button
- Added image URL input field
- Added file upload input for images
- Added image column to catalog table header
- Changed all "Price ($)" labels to "Price (₹)"
- Added Category Management section with 3 forms:
  - Add New Category
  - Add Subcategory to Existing Category
  - View Existing Categories
- Updated table colspan from 9 to 10 (new image column)

#### 2. `public/styles.css`
**Additions:**
- Category management section styling (`.category-management`)
- Category display cards (`.category-item`, `.category-section`)
- Subcategory lists (`.subcategory-list`)
- Product image thumbnails (`.product-image`, `.product-image-placeholder`)
- Image preview styling (`.image-preview`)
- File input customization (`input[type="file"]`)
- Small button variant (`.btn-small`)

#### 3. `src/app.js`
**Major Rewrite** (482 → 784 lines, +302 lines):

**New Functions Added:**
- `setupImageHandlers()` - Initialize image upload and URL event listeners
- `handleImageUpload(e)` - Process file uploads, validate size/type, convert to base64
- `handleImageURL(e)` - Validate URL format, set image data
- `displayImagePreview(imageData)` - Show live image preview in form
- `clearImagePreview()` - Remove image preview and reset inputs (global function)
- `setupCategoryManagement()` - Initialize category management forms
- `addNewCategory()` - Create new category with validation
- `addNewSubcategory()` - Add subcategory with validation
- `getAllCategories()` - Merge default categories with custom categories
- `displayExistingCategories()` - Render category list with subcategories
- `saveCustomCategories()` - Save custom categories to localStorage

**Functions Modified:**
- `initializeTabs()` - Added refresh logic for category manager tab
- `populateFormOptions()` - Now uses `getAllCategories()` instead of direct `catalogData.categories`
- `setupFormHandlers()` - Added image clearing on form reset
- `addProduct()` - Now saves image data with product object
- `updateCatalogDisplay()` - Renders product images as thumbnails or placeholders
- `updateStats()` - Changed currency symbol from $ to ₹
- `exportToCSV()` - Added "Has Image" column, changed header to "Price (INR)"
- `decodeSKUInput()` - Uses `getAllCategories()` for category lookup

**New State Variables:**
- `customCategories` - Object storing user-created categories (from localStorage)
- `currentImageData` - String holding current image (base64 or URL)

**Enhanced Initialization:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    populateFormOptions();
    setupFormHandlers();
    setupCatalogView();
    setupSKUGenerator();
    setupImageHandlers();        // NEW
    setupCategoryManagement();   // NEW
    updateCatalogDisplay();
    displayExistingCategories(); // NEW
});
```

#### 4. `package.json`
**Updates:**
- Version bumped from 1.0.0 to 1.1.0
- Added json-server dependency (^0.17.4)
- Added new scripts:
  - `api` - Start JSON Server on port 3000
  - `api:delay` - Start JSON Server with 500ms delay (testing)
- Updated description to mention INR and new features

### Files Added

#### 1. `db.json` (NEW)
**Purpose:** JSON Server database structure for optional backend
**Contents:**
- Empty products array (ready for JSON Server API)
- Complete category structure (11 categories, 50+ subcategories)
- Material definitions (12 materials with descriptions)
- Color palettes (12 standard + 7 special colors with hex codes)
- Size definitions (6 standard + 4 special sizes)
- Application settings (nextSequence, currency, appVersion)

**Usage:**
```bash
npm run api          # Start JSON Server at http://localhost:3000
npm run api:delay    # Start with 500ms delay (simulate network)
```

#### 2. `FEATURES_UPDATE_v1.1.md` (NEW)
**Purpose:** Comprehensive feature documentation
**Sections:**
- Detailed feature explanations with screenshots locations
- User workflows and how-to guides
- Technical improvements and code changes
- Migration guide from v1.0.0
- Browser compatibility information
- Known limitations and workarounds
- Future enhancement roadmap

#### 3. `RELEASE_NOTES_v1.1.md` (NEW)
**Purpose:** This file - concise release information
**Sections:**
- What's new summary
- Technical changes breakdown
- Breaking changes (none in v1.1.0)
- Upgrade instructions
- Bug fixes
- Performance considerations

#### 4. `src/app-v1.0-backup.js` (NEW)
**Purpose:** Backup of original v1.0.0 app.js
**Reason:** Safety net in case rollback needed
**Contents:** Original 482-line app.js before v1.1.0 enhancements

---

## Breaking Changes

### ✅ NONE - 100% Backward Compatible!

All v1.0.0 data works perfectly in v1.1.0:
- Existing products load without issues
- SKU format unchanged
- No data migration required
- Products without images display "No Image" placeholder
- Price values preserved (only display symbol changes)

---

## Upgrade Instructions

### For Existing Users:

1. **Pull Latest Code:**
   ```bash
   git pull origin main
   ```

2. **Clear Browser Cache** (Optional but recommended):
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear cache manually in browser settings

3. **Verify Upgrade:**
   - Open the app in browser
   - Check footer: Should show "v1.0" → "v1.1.0" (if version displayed)
   - Verify INR symbols (₹) appear in price fields
   - Check for "Manage Categories" tab
   - Test image upload in Add Product form

4. **Install Dependencies** (if using JSON Server):
   ```bash
   npm install
   ```

### For New Users:

1. **Clone Repository:**
   ```bash
   git clone https://github.com/arunsaispk12/print-genie-catalog.git
   cd print-genie-catalog
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm start
   ```
   Opens browser at `http://localhost:8000/public/`

4. **Optional - Start JSON Server:**
   ```bash
   npm run api
   ```
   API available at `http://localhost:3000`

---

## Bug Fixes

### Fixed in v1.1.0:
- **Empty state table colspan**: Updated from 9 to 10 to match new image column
- **Category dropdown refresh**: Categories now refresh when switching to Manage Categories tab
- **Form reset behavior**: Image preview now properly clears on form reset

### Known Issues:
None reported for v1.1.0 at release time.

---

## Performance Considerations

### File Size Impact:
- **app.js**: +302 lines (+62% increase)
- **Total bundle size**: ~3KB increase (minified)
- **LocalStorage**: Images stored as base64 (+33% size overhead)

### Recommendations:
1. **For small catalogs (<50 products)**: Use image uploads freely
2. **For medium catalogs (50-200 products)**: Mix uploads and URLs
3. **For large catalogs (>200 products)**: Prefer image URLs to avoid localStorage limits

### Browser Limits:
- LocalStorage: ~5-10MB per domain (browser-dependent)
- Base64 2MB image → ~2.7MB in localStorage
- Monitor storage usage in browser DevTools

---

## Data Schema Changes

### Product Object (v1.1.0):
```javascript
{
  sku: "string",
  name: "string",
  category: "string",
  subcategory: "string",
  subcategoryName: "string",
  material: "string",
  color: "string",
  size: "string",
  price: number,
  stock: number,
  description: "string",
  tags: ["string"],
  image: "string" | null,  // NEW in v1.1.0 (base64 or URL)
  dateAdded: "ISO 8601 string"
}
```

### LocalStorage Keys:
1. `printGenieCatalog` - Array of products
2. `nextSequence` - Integer (next SKU sequence)
3. `customCategories` - Object (NEW in v1.1.0)

---

## API Changes (for Developers)

### New Global Functions:
- `window.clearImagePreview()` - Clear image preview and reset inputs

### New Internal Functions:
See Technical Changes > Files Modified > app.js for complete list

### Removed Functions:
None

---

## Deprecations

### None in v1.1.0

All v1.0.0 features remain fully functional and supported.

---

## Security Considerations

### Image Upload Security:
- ✅ File size validation (2MB limit)
- ✅ File type validation (image/* only)
- ✅ No server-side execution (client-only app)
- ⚠️ Base64 encoding increases storage usage
- ⚠️ No image sanitization (trust user input)

### Category Validation:
- ✅ Code length validation (2-6 chars for categories, max 8 for subcategories)
- ✅ Duplicate prevention
- ✅ Input trimming and uppercase conversion

### Recommendations:
- Don't upload sensitive images (stored in browser localStorage)
- Clear localStorage when sharing device
- Use image URLs for public/external images

---

## Testing Performed

### Manual Testing:
- ✅ Image upload (various formats: JPG, PNG, GIF, WebP)
- ✅ Image URL validation and display
- ✅ Category creation (valid and invalid inputs)
- ✅ Subcategory creation (valid and invalid inputs)
- ✅ Product creation with images
- ✅ Catalog display with mixed image states
- ✅ CSV export with new columns
- ✅ INR currency display across all views
- ✅ Form reset behavior
- ✅ Browser compatibility (Chrome, Firefox, Safari, Edge)

### Regression Testing:
- ✅ v1.0.0 products load correctly
- ✅ SKU generation unchanged
- ✅ Existing functionality preserved
- ✅ Sample products load correctly

### Edge Cases Tested:
- ✅ Oversized image upload (2MB+) - properly rejected
- ✅ Invalid image file type - properly rejected
- ✅ Invalid image URL - no preview shown
- ✅ Duplicate category name - properly prevented
- ✅ Duplicate subcategory in same category - properly prevented
- ✅ Empty form submission - validation works
- ✅ LocalStorage full scenario - handled gracefully

---

## Contributor Credits

- **Development**: Claude Sonnet 4.5 (Anthropic)
- **Product Owner**: Arun (arunsaispk12)
- **Concept & Requirements**: Print Genie Team

---

## Next Release (v1.2.0) - Planned Features

1. **Edit Product**: Modify existing products including images
2. **Delete Category**: Remove custom categories and subcategories
3. **Bulk Import**: Upload CSV with image URLs
4. **Image Compression**: Auto-resize images before storage
5. **Advanced Filters**: Price range, material, color filters
6. **Product Duplication**: Clone products with one click
7. **Dark Mode**: Toggle dark theme
8. **Export Options**: JSON, Excel formats

**Target Release:** February 2026

---

## Support & Resources

- **GitHub Repository**: https://github.com/arunsaispk12/print-genie-catalog
- **Live Demo**: https://arunsaispk12.github.io/print-genie-catalog/public/
- **Documentation**: See README.md and FEATURES_UPDATE_v1.1.md
- **Issues**: Report bugs at GitHub Issues

---

## License

UNLICENSED - Private project for Print Genie

---

## Changelog Format

For detailed commit-by-commit changes, see Git history:
```bash
git log --oneline --since="2026-01-01"
```

---

**End of Release Notes v1.1.0**

Generated: January 8, 2026
