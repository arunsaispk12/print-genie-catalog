// Print Genie - Catalog Data Structure
// This file contains all categories, materials, colors, and sizes for the catalog system

export const catalogData = {
  categories: {
    "Custom Prints": {
      code: "CP",
      subcategories: {
        "Functional Parts": { code: "CP01" },
        "Decorative Items": { code: "CP02" },
        "Prototypes": { code: "CP03" },
        "Miniatures & Models": { code: "CP04" },
        "Architectural Models": { code: "CP05" },
        "Educational Models": { code: "CP06" }
      }
    },
    "Pre-Designed: Home & Living": {
      code: "PDHL",
      subcategories: {
        "Organization & Storage": { code: "PDHL01" },
        "Kitchen & Dining": { code: "PDHL02" },
        "Bathroom Accessories": { code: "PDHL03" },
        "Home Decor": { code: "PDHL04" },
        "Lighting": { code: "PDHL05" }
      }
    },
    "Pre-Designed: Toys & Games": {
      code: "PDTG",
      subcategories: {
        "Action Figures & Collectibles": { code: "PDTG01" },
        "Puzzles & Brain Teasers": { code: "PDTG02" },
        "Educational Toys": { code: "PDTG03" },
        "Board Game Accessories": { code: "PDTG04" },
        "Outdoor Toys": { code: "PDTG05" }
      }
    },
    "Pre-Designed: Tech & Gadgets": {
      code: "PDTC",
      subcategories: {
        "Phone & Tablet Accessories": { code: "PDTC01" },
        "Computer Accessories": { code: "PDTC02" },
        "Gaming Accessories": { code: "PDTC03" },
        "Smart Home Mounts": { code: "PDTC04" },
        "Tool & Equipment Holders": { code: "PDTC05" }
      }
    },
    "Pre-Designed: Automotive": {
      code: "PDAU",
      subcategories: {
        "Interior Accessories": { code: "PDAU01" },
        "Exterior Accessories": { code: "PDAU02" },
        "Tool Holders & Organizers": { code: "PDAU03" },
        "Replacement Parts": { code: "PDAU04" }
      }
    },
    "Pre-Designed: Jewelry & Fashion": {
      code: "PDJF",
      subcategories: {
        "Rings & Bracelets": { code: "PDJF01" },
        "Pendants & Necklaces": { code: "PDJF02" },
        "Earrings": { code: "PDJF03" },
        "Brooches & Pins": { code: "PDJF04" },
        "Accessories": { code: "PDJF05" }
      }
    },
    "Pre-Designed: Office & Stationery": {
      code: "PDOF",
      subcategories: {
        "Desk Organization": { code: "PDOF01" },
        "Writing Accessories": { code: "PDOF02" },
        "Bookmarks & Clips": { code: "PDOF03" },
        "Name Plates & Signs": { code: "PDOF04" }
      }
    },
    "Prototyping Services": {
      code: "PS",
      subcategories: {
        "Rapid Prototyping": { code: "PS01" },
        "Iterative Development": { code: "PS02" },
        "Functional Testing": { code: "PS03" },
        "Visual/Presentation Models": { code: "PS04" },
        "Low-Volume Production": { code: "PS05" },
        "Design Consultation": { code: "PS06" }
      }
    },
    "Materials: Filaments by Type": {
      code: "MFFT",
      subcategories: {
        "PLA Filament": { code: "MFFT01" },
        "PETG Filament": { code: "MFFT02" },
        "ABS Filament": { code: "MFFT03" },
        "TPU/Flexible": { code: "MFFT04" },
        "Specialty Filaments": { code: "MFFT05" },
        "Engineering Filaments": { code: "MFFT06" }
      }
    },
    "Materials: Filaments by Color": {
      code: "MFFC",
      subcategories: {
        "Solid Colors": { code: "MFFC01" },
        "Multi-Color/Gradient": { code: "MFFC02" },
        "Metallic & Shimmer": { code: "MFFC03" },
        "Translucent & Clear": { code: "MFFC04" }
      }
    },
    "Materials: Accessories & Supplies": {
      code: "MFAS",
      subcategories: {
        "Build Surface": { code: "MFAS01" },
        "Maintenance Tools": { code: "MFAS02" },
        "Post-Processing": { code: "MFAS03" },
        "Storage Solutions": { code: "MFAS04" }
      }
    }
  },

  materials: {
    "PLA": { name: "PLA", description: "Polylactic Acid (Standard)" },
    "PLP": { name: "PLA+", description: "Enhanced PLA" },
    "PET": { name: "PETG", description: "Polyethylene Terephthalate Glycol" },
    "ABS": { name: "ABS", description: "Acrylonitrile Butadiene Styrene" },
    "TPU": { name: "TPU", description: "Thermoplastic Polyurethane (Flexible)" },
    "NYL": { name: "Nylon", description: "Nylon (PA)" },
    "PCB": { name: "Polycarbonate", description: "PC" },
    "ASA": { name: "ASA", description: "UV-Resistant ABS Alternative" },
    "WDF": { name: "Wood-Fill", description: "Wood composite filament" },
    "MTF": { name: "Metal-Fill", description: "Metal composite filament" },
    "CFB": { name: "Carbon Fiber", description: "Carbon fiber composite" },
    "GID": { name: "Glow-in-Dark", description: "Glow-in-the-dark filament" },
    "CHG": { name: "Color-Change", description: "Temperature/UV color-changing" },
    "RES": { name: "Resin", description: "Resin (for SLA/DLP printers)" },
    "MLT": { name: "Multi-Material", description: "Multiple materials used" },
    "CST": { name: "Custom", description: "Custom material specification" },
    "NAP": { name: "N/A", description: "Not applicable (services/non-material items)" }
  },

  colors: {
    standard: {
      "BLK": { name: "Black", hex: "#000000" },
      "WHT": { name: "White", hex: "#FFFFFF" },
      "GRY": { name: "Gray", hex: "#808080" },
      "RED": { name: "Red", hex: "#FF0000" },
      "BLU": { name: "Blue", hex: "#0000FF" },
      "GRN": { name: "Green", hex: "#00FF00" },
      "YEL": { name: "Yellow", hex: "#FFFF00" },
      "ORG": { name: "Orange", hex: "#FFA500" },
      "PUR": { name: "Purple", hex: "#800080" },
      "PNK": { name: "Pink", hex: "#FFC0CB" },
      "BRN": { name: "Brown", hex: "#8B4513" },
      "TAN": { name: "Tan/Beige", hex: "#D2B48C" }
    },
    special: {
      "CLR": { name: "Clear/Transparent" },
      "TRA": { name: "Translucent" },
      "MTL": { name: "Metallic" },
      "GLD": { name: "Gold" },
      "SLV": { name: "Silver" },
      "BRZ": { name: "Bronze" },
      "CPR": { name: "Copper" },
      "RNB": { name: "Rainbow/Multi-Color" },
      "GRD": { name: "Gradient" },
      "GLT": { name: "Glitter" },
      "GID": { name: "Glow-in-Dark" },
      "CHG": { name: "Color-Changing" },
      "NAT": { name: "Natural (Uncolored)" },
      "CSM": { name: "Custom Color" },
      "MIX": { name: "Mixed/Multi-Color Print" }
    }
  },

  sizes: {
    standard: {
      "XS": { name: "Extra Small", description: "< 50mm" },
      "S": { name: "Small", description: "50-100mm" },
      "M": { name: "Medium", description: "100-150mm" },
      "L": { name: "Large", description: "150-200mm" },
      "XL": { name: "Extra Large", description: "200-250mm" },
      "XXL": { name: "Extra Extra Large", description: "> 250mm" }
    },
    special: {
      "UNI": { name: "Universal/One Size" },
      "ADJ": { name: "Adjustable" },
      "VAR": { name: "Variable/Custom" },
      "SET": { name: "Set of multiple sizes" },
      "KG1": { name: "1 KG", description: "For filament spools" },
      "G500": { name: "500g", description: "For filament spools" },
      "G250": { name: "250g", description: "For filament samples" }
    }
  }
};

export default catalogData;
