# Print Genie - SKU System Documentation

## SKU Structure Overview

**Format:** `PG-[CATEGORY]-[MATERIAL]-[COLOR]-[SIZE]-[SEQ]`

### Components Breakdown:

```
PG  -  PDHL  -  PLA  -  BLK  -  M  -  0001
│      │       │      │      │     │
│      │       │      │      │     └─ Sequential Number (4 digits)
│      │       │      │      └─────── Size Code (1-3 chars)
│      │       │      └────────────── Color Code (3 chars)
│      │       └───────────────────── Material Code (3 chars)
│      └───────────────────────────── Category Code (2-4 chars)
└──────────────────────────────────── Brand Prefix

Example: PG-PDHL-PLA-BLK-M-0001
         Print Genie - Pre-Designed Home & Living - PLA - Black - Medium - #0001
```

---

## 1. CATEGORY CODES

### Custom Prints (CP)
- **CP01** - Functional Parts
- **CP02** - Decorative Items
- **CP03** - Prototypes
- **CP04** - Miniatures & Models
- **CP05** - Architectural Models
- **CP06** - Educational Models

### Pre-Designed Products (PD)
#### Home & Living (PDHL)
- **PDHL01** - Organization & Storage
- **PDHL02** - Kitchen & Dining
- **PDHL03** - Bathroom Accessories
- **PDHL04** - Home Decor
- **PDHL05** - Lighting

#### Toys & Games (PDTG)
- **PDTG01** - Action Figures
- **PDTG02** - Puzzles
- **PDTG03** - Educational Toys
- **PDTG04** - Board Game Accessories
- **PDTG05** - Outdoor Toys

#### Tech & Gadgets (PDTC)
- **PDTC01** - Phone & Tablet
- **PDTC02** - Computer Accessories
- **PDTC03** - Gaming Accessories
- **PDTC04** - Smart Home Mounts
- **PDTC05** - Tool Holders

#### Automotive (PDAU)
- **PDAU01** - Interior Accessories
- **PDAU02** - Exterior Accessories
- **PDAU03** - Tool Holders
- **PDAU04** - Replacement Parts

#### Jewelry & Fashion (PDJF)
- **PDJF01** - Rings & Bracelets
- **PDJF02** - Pendants & Necklaces
- **PDJF03** - Earrings
- **PDJF04** - Brooches & Pins
- **PDJF05** - Accessories

#### Office & Stationery (PDOF)
- **PDOF01** - Desk Organization
- **PDOF02** - Writing Accessories
- **PDOF03** - Bookmarks & Clips
- **PDOF04** - Name Plates

### Prototyping Services (PS)
- **PS01** - Rapid Prototyping
- **PS02** - Iterative Development
- **PS03** - Functional Testing
- **PS04** - Visual/Presentation
- **PS05** - Low-Volume Production
- **PS06** - Design Consultation

### Materials & Filaments (MF)
#### By Type (MFFT)
- **MFFT01** - PLA Filament
- **MFFT02** - PETG Filament
- **MFFT03** - ABS Filament
- **MFFT04** - TPU/Flexible
- **MFFT05** - Specialty Filaments
- **MFFT06** - Engineering Filaments

#### By Color (MFFC)
- **MFFC01** - Solid Colors
- **MFFC02** - Multi-Color/Gradient
- **MFFC03** - Metallic & Shimmer
- **MFFC04** - Translucent & Clear

#### Accessories (MFAS)
- **MFAS01** - Build Surface
- **MFAS02** - Maintenance Tools
- **MFAS03** - Post-Processing
- **MFAS04** - Storage Solutions

---

## 2. MATERIAL CODES

| Code | Material | Description |
|------|----------|-------------|
| **PLA** | PLA | Polylactic Acid (Standard) |
| **PLP** | PLA+ | Enhanced PLA |
| **PET** | PETG | Polyethylene Terephthalate Glycol |
| **ABS** | ABS | Acrylonitrile Butadiene Styrene |
| **TPU** | TPU | Thermoplastic Polyurethane (Flexible) |
| **NYL** | Nylon | Nylon (PA) |
| **PCB** | Polycarbonate | PC |
| **ASA** | ASA | UV-Resistant ABS Alternative |
| **WDF** | Wood-Fill | Wood composite filament |
| **MTF** | Metal-Fill | Metal composite filament |
| **CFB** | Carbon Fiber | Carbon fiber composite |
| **GID** | Glow-in-Dark | Glow-in-the-dark filament |
| **CHG** | Color-Change | Temperature/UV color-changing |
| **RES** | Resin | Resin (for SLA/DLP printers) |
| **MLT** | Multi-Material | Multiple materials used |
| **CST** | Custom | Custom material specification |
| **NAP** | N/A | Not applicable (services/non-material items) |

---

## 3. COLOR CODES

### Standard Colors
| Code | Color | Hex Reference |
|------|-------|---------------|
| **BLK** | Black | #000000 |
| **WHT** | White | #FFFFFF |
| **GRY** | Gray | #808080 |
| **RED** | Red | #FF0000 |
| **BLU** | Blue | #0000FF |
| **GRN** | Green | #00FF00 |
| **YEL** | Yellow | #FFFF00 |
| **ORG** | Orange | #FFA500 |
| **PUR** | Purple | #800080 |
| **PNK** | Pink | #FFC0CB |
| **BRN** | Brown | #8B4513 |
| **TAN** | Tan/Beige | #D2B48C |

### Special Colors
| Code | Color Type |
|------|------------|
| **CLR** | Clear/Transparent |
| **TRA** | Translucent |
| **MTL** | Metallic |
| **GLD** | Gold |
| **SLV** | Silver |
| **BRZ** | Bronze |
| **CPR** | Copper |
| **RNB** | Rainbow/Multi-Color |
| **GRD** | Gradient |
| **GLT** | Glitter |
| **GID** | Glow-in-Dark |
| **CHG** | Color-Changing |
| **NAT** | Natural (Uncolored) |
| **CSM** | Custom Color |
| **MIX** | Mixed/Multi-Color Print |

---

## 4. SIZE CODES

### Standard Sizes
| Code | Description | Typical Dimensions |
|------|-------------|-------------------|
| **XS** | Extra Small | < 50mm |
| **S** | Small | 50-100mm |
| **M** | Medium | 100-150mm |
| **L** | Large | 150-200mm |
| **XL** | Extra Large | 200-250mm |
| **XXL** | Extra Extra Large | > 250mm |

### Specific Dimensions (when needed)
Format: `[Width]x[Depth]x[Height]` in mm (use for custom or precise sizing)
- Example: `100X50X30` (100mm x 50mm x 30mm)

### Special Size Codes
| Code | Description |
|------|-------------|
| **UNI** | Universal/One Size |
| **ADJ** | Adjustable |
| **VAR** | Variable/Custom |
| **SET** | Set of multiple sizes |
| **KG1** | 1 KG (for filament spools) |
| **G500** | 500g (for filament spools) |
| **G250** | 250g (for filament samples) |

---

## 5. SEQUENTIAL NUMBER

- **Format:** 4-digit number (0001-9999)
- **Resets:** Never resets; continues incrementing
- **Purpose:** Ensures unique SKU even for identical products with different designs

---

## SKU EXAMPLES

### Example 1: Phone Stand
```
PG-PDTC01-PLA-BLK-M-0001
│  │      │   │   │  │
│  │      │   │   │  └─ First product in this configuration
│  │      │   │   └──── Medium size
│  │      │   └──────── Black color
│  │      └──────────── PLA material
│  └─────────────────── Tech & Gadgets > Phone & Tablet
└────────────────────── Print Genie brand
```

### Example 2: Rainbow PLA Filament 1kg
```
PG-MFFT01-PLA-RNB-KG1-0023
   │      │   │   │   │
   │      │   │   │   └─ 23rd product in sequence
   │      │   │   └───── 1 KG spool
   │      │   └───────── Rainbow/Multi-color
   │      └───────────── PLA material
   └──────────────────── Materials > Filament Type > PLA
```

### Example 3: Custom Prototype (Metal-filled, Silver, Large)
```
PG-CP03-MTF-SLV-L-0156
   │    │   │   │  │
   │    │   │   │  └─── 156th product
   │    │   │   └────── Large
   │    │   └────────── Silver
   │    └────────────── Metal-fill material
   └─────────────────── Custom Prints > Prototypes
```

### Example 4: Iterative Prototyping Service (Multi-material)
```
PG-PS02-MLT-NAP-VAR-0007
   │    │   │   │   │
   │    │   │   │   └── 7th service order
   │    │   │   └────── Variable/Custom size
   │    │   └────────── Not applicable (service)
   │    └────────────── Multi-material
   └─────────────────── Prototyping > Iterative Development
```

### Example 5: Desk Organizer Set (White PETG)
```
PG-PDOF01-PET-WHT-SET-0089
   │      │   │   │   │
   │      │   │   │   └─ 89th product
   │      │   │   └───── Set of multiple pieces
   │      │   └───────── White
   │      └───────────── PETG material
   └──────────────────── Office > Desk Organization
```

---

## SKU GENERATION RULES

1. **All SKUs must be uppercase**
2. **Use hyphens (-) as separators** between components
3. **Always include PG prefix** for brand consistency
4. **Sequential numbers never repeat** across the entire catalog
5. **For variants** (same design, different color/size):
   - Same category, material may vary
   - Different sequential numbers
6. **For services** (PS category):
   - Material code can be MLT (multi-material) or NAP (not applicable)
   - Size often VAR (variable) or specific project code
7. **For filaments**:
   - Material code matches the filament type
   - Size indicates spool weight (KG1, G500, etc.)

---

## SKU VALIDATION CHECKLIST

Before finalizing a SKU, verify:
- [ ] Starts with "PG-"
- [ ] Category code exists in CATEGORY_STRUCTURE.md
- [ ] Material code from approved list
- [ ] Color code from approved list
- [ ] Size code appropriate for product type
- [ ] Sequential number is 4 digits
- [ ] No duplicate SKUs in database
- [ ] All components uppercase
- [ ] Hyphens properly placed

---

## Version Control

- **Current Version:** 1.0
- **Last Updated:** 2026-01-07
- **Change Log:**
  - v1.0 (2026-01-07): Initial SKU system creation
