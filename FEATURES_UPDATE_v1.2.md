# Print Genie Catalog Builder - v1.2.0 Features Update

## Overview
Version 1.2.0 introduces a comprehensive Price Calculator system with cost breakdown, multiple pricing modes, volume discounts, and five export options for professional quotes.

**Release Date:** January 19, 2026

---

## New Features

### 1. Price Calculator Tab

A full-featured pricing calculator for 3D prints, accessible from the admin panel.

**Location:** Admin Panel > Calculator Tab

#### Key Components:

**A. Pricing Mode Selection**
- **Retail Mode** - For individual customers
  - Minimum order: 1 unit
  - Profit margins: 25-35% (based on complexity)
  - Full labor costs applied
  - No volume discounts

- **Bulk/Wholesale Mode** - For resellers and large orders
  - Minimum order: 10 units
  - Profit margins: 15-20% (based on complexity)
  - Reduced labor costs (80%)
  - Volume discounts available

**B. Calculator Form**
| Field | Description | Required |
|-------|-------------|----------|
| Item Name | Name for the quote (optional) | No |
| Print Weight | Total weight in grams | Yes |
| Print Time | Duration in hours | Yes |
| Material | Select from 14 materials | Yes |
| Complexity | Small/Medium/Large/Complex | Yes |
| Quantity | Number of units | Yes |
| Notes | Additional specifications | No |

**C. Complexity Tiers**
| Tier | Weight Range | Setup Time | Post-Processing |
|------|--------------|------------|-----------------|
| Small | Under 50g | 0.25 hrs | 0.25 hrs |
| Medium | 50-150g | 0.5 hrs | 0.5 hrs |
| Large | 150-300g | 0.75 hrs | 0.75 hrs |
| Complex | 300g+ | 1.0 hrs | 1.0 hrs |

---

### 2. Volume Discounts (Bulk Mode Only)

Tiered discounts automatically applied based on quantity:

| Quantity | Discount |
|----------|----------|
| 10-24 units | Base price (0%) |
| 25-49 units | 5% off |
| 50-99 units | 10% off |
| 100+ units | 15% off |

**Note:** Bulk mode requires minimum 10 units. A warning appears if quantity is below minimum.

---

### 3. Cost Breakdown Display

In Bulk mode, a detailed cost breakdown is shown:

- **Material Cost** - Based on weight and material price per kg
- **Electricity Cost** - Print time × consumption × rate
- **Depreciation Cost** - Print time × (printer cost / lifespan)
- **Maintenance Cost** - Print time × (monthly budget / monthly hours)
- **Labor Cost** - Setup + monitoring + post-processing (× 0.8 for bulk)
- **Total Production Cost** - Sum of all costs
- **Profit Margin** - Percentage based on complexity tier

---

### 4. Five Export Options

#### A. PDF Export
- Professional quote document
- Includes:
  - Print Genie branding
  - Quote ID and date
  - Customer type badge
  - Item details (material, complexity, weight, time)
  - Cost breakdown (bulk mode)
  - Pricing summary
  - Volume discount (if applicable)
  - Terms & conditions
- **Library:** jsPDF (CDN loaded)
- **Output:** `PrintGenie-Quote-[ID].pdf`

#### B. WhatsApp Export
- Emoji-formatted message
- Copy to clipboard automatically
- Opens wa.me share link
- Includes all quote details
- Perfect for quick customer communication

#### C. Email Export
- Opens default email client
- Pre-filled subject and body
- Professional text format
- Includes terms and quote ID

#### D. CSV Export
- Downloadable spreadsheet
- All quote details in columns
- Cost breakdown for bulk orders
- Easy import to Excel/Sheets
- **Output:** `PrintGenie-Quote-[ID].csv`

#### E. Image Export
- 1080x1080 PNG (Instagram-ready)
- Gradient background
- Quote card design
- Includes:
  - Branding
  - Quote ID
  - Item details
  - Pricing summary
  - Total highlighted
- **Output:** `PrintGenie-Quote-[ID].png`

---

### 5. Printer Cost Settings

New section in Settings tab for configuring all cost parameters.

**Location:** Admin Panel > Settings Tab > Printer Cost Settings

#### Configurable Parameters:

**Electricity Costs**
| Setting | Default | Description |
|---------|---------|-------------|
| Electricity Rate | ₹8/unit | Cost per kWh |
| Printer Consumption | 0.2 kW | Average power draw |

**Depreciation Costs**
| Setting | Default | Description |
|---------|---------|-------------|
| Printer Purchase Price | ₹25,000 | Total printer cost |
| Expected Lifespan | 5,000 hrs | Print hours before replacement |

**Maintenance Costs**
| Setting | Default | Description |
|---------|---------|-------------|
| Monthly Budget | ₹500 | Parts, nozzles, belts |
| Monthly Print Hours | 100 hrs | Estimated usage |

**Labor Rates**
| Setting | Default | Description |
|---------|---------|-------------|
| Setup Cost | ₹50/print | Bed prep, slicing, transfer |
| Monitoring Rate | ₹20/hr | Print supervision |
| Post-Processing Rate | ₹30/hr | Support removal, finishing |

**Material Costs (per kg)**
| Material | Default Price |
|----------|---------------|
| PLA | ₹800 |
| PLA+ | ₹1,000 |
| PETG | ₹1,200 |
| ABS | ₹900 |
| TPU | ₹2,000 |
| Nylon | ₹2,500 |
| Polycarbonate | ₹3,000 |
| ASA | ₹1,500 |
| Wood-Fill | ₹1,800 |
| Metal-Fill | ₹3,500 |
| Carbon Fiber | ₹4,000 |
| Silk PLA | ₹1,200 |
| Glow PLA | ₹1,500 |
| Multi-Color | ₹1,600 |

**Actions:**
- **Save Cost Settings** - Persist to localStorage
- **Reset to Defaults** - Restore original values

---

## Technical Details

### New Files

**`src/pricing-modes.js`**
```javascript
// Exports:
- pricingModes         // Retail/bulk configuration
- complexityTiers      // Tier definitions
- defaultCostSettings  // Default cost values
- getVolumeDiscount()  // Calculate discount %
- getVolumeDiscountTier() // Get tier info
```

**`src/calculator.js`**
```javascript
// Exports:
- initializeCalculator() // Main initialization

// Internal functions:
- loadCostSettings()
- saveCostSettings()
- setupModeToggle()
- calculatePrice()
- displayResults()
- exportToPDF()
- exportToWhatsApp()
- exportToEmail()
- exportToCSV()
- exportToImage()
```

### Modified Files

**`public/admin.html`**
- Added Calculator tab button
- Added Calculator tab content (230+ lines)
- Added Printer Cost Settings in Settings tab (150+ lines)
- Added jsPDF CDN script

**`public/styles.css`**
- Added 480+ lines of calculator-specific styles
- Pricing mode selector styles
- Cost breakdown display
- Result card design
- Export button styles
- Material costs grid
- Responsive adaptations

**`src/app.js`**
- Updated version to 1.2.0
- Added calculator import
- Added `initializeCalculator()` call

### External Dependencies

**jsPDF** (CDN)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### LocalStorage

**New Key:** `printerCostSettings`
```javascript
{
  electricity: { rate: 8, consumption: 0.2 },
  depreciation: { purchasePrice: 25000, lifespan: 5000 },
  maintenance: { monthlyBudget: 500, monthlyHours: 100 },
  laborRates: { setup: 50, monitoring: 20, postProcessing: 30 },
  materialCosts: { PLA: 800, ... }
}
```

---

## Calculation Formula

```
materialCost = (weight / 1000) × materialCostPerKg
electricityCost = printTime × consumption × rate
depreciationCost = printTime × (purchasePrice / lifespan)
maintenanceCost = printTime × (monthlyBudget / monthlyHours)
laborCost = (setup + monitoring×time + postProcessing×tierTime) × laborMultiplier
totalCost = materialCost + electricityCost + depreciationCost + maintenanceCost + laborCost
profitAmount = totalCost × (profitMargin / 100)
basePrice = totalCost + profitAmount
unitPrice = roundToNearest10(basePrice)
subtotal = unitPrice × quantity
volumeDiscount = subtotal × (discountPercentage / 100)
finalTotal = subtotal - volumeDiscount
```

---

## User Workflows

### Workflow 1: Calculate Retail Price
1. Go to Calculator tab
2. Ensure "Retail" mode is selected
3. Enter: 50g weight, 2 hours, PLA, Medium tier, Qty 1
4. Click "Calculate Price"
5. View unit price and total
6. Export quote if needed

### Workflow 2: Calculate Bulk Quote
1. Go to Calculator tab
2. Click "Bulk" mode button
3. Enter: 50g weight, 2 hours, PLA, Medium tier, Qty 50
4. Click "Calculate Price"
5. View cost breakdown
6. Note 10% volume discount applied
7. Export PDF for customer

### Workflow 3: Customize Costs
1. Go to Settings tab
2. Scroll to "Printer Cost Settings"
3. Update electricity rate to match your area
4. Adjust material costs based on your supplier
5. Click "Save Cost Settings"
6. Return to Calculator - new costs applied

### Workflow 4: Share Quote via WhatsApp
1. Calculate price as above
2. Click "WhatsApp" export button
3. Quote copied to clipboard
4. WhatsApp opens automatically
5. Select contact and send

---

## Migration Notes

### From v1.1.x
- No breaking changes
- Calculator tab appears automatically
- Cost settings use sensible defaults
- Existing data unaffected

### Default Behavior
- First load uses default cost settings
- Settings persist after customization
- Reset button restores defaults

---

## Known Limitations

1. **PDF Generation** - Requires internet (CDN library)
2. **Image Export** - Basic canvas rendering (no custom fonts)
3. **Cost Settings** - Per-browser (localStorage)
4. **Quote Storage** - Not persisted (recalculate as needed)

---

## Future Enhancements (v1.3.0+)

- [ ] Quote history/saved quotes
- [ ] Customer database integration
- [ ] Batch pricing calculator
- [ ] Custom profit margin presets
- [ ] Multi-currency support
- [ ] Quote templates
- [ ] Print queue integration

---

## Support

For issues with the Price Calculator:
1. Check cost settings in Settings tab
2. Verify all required fields are filled
3. Ensure jsPDF loaded (for PDF export)
4. Clear browser cache if issues persist

---

Last Updated: January 19, 2026
