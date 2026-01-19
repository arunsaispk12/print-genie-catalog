// Print Genie - Pricing Modes Configuration
// Defines retail and bulk pricing configurations with volume discounts

export const pricingModes = {
    retail: {
        id: 'retail',
        name: "Retail Pricing",
        description: "For individual customers and small orders",
        minOrderQty: 1,
        profitMargins: {
            tier1: 35, // Small (under 50g)
            tier2: 30, // Medium (50-150g)
            tier3: 25, // Large (150-300g)
            tier4: 25  // Complex (300g+)
        },
        laborMultiplier: 1.0, // Full labor cost
        volumeDiscounts: null, // No volume discounts for retail
        display: {
            showCostBreakdown: false,
            priceLabel: "Price",
            showVolumeDiscounts: false
        }
    },
    bulk: {
        id: 'bulk',
        name: "Bulk/Wholesale Pricing",
        description: "For resellers, businesses, and large orders",
        minOrderQty: 10,
        profitMargins: {
            tier1: 20, // Small (under 50g)
            tier2: 18, // Medium (50-150g)
            tier3: 15, // Large (150-300g)
            tier4: 15  // Complex (300g+)
        },
        laborMultiplier: 0.8, // Reduced labor cost for bulk
        volumeDiscounts: {
            qty10to24: { min: 10, max: 24, discount: 0, label: "10-24 units" },
            qty25to49: { min: 25, max: 49, discount: 5, label: "25-49 units (5% off)" },
            qty50to99: { min: 50, max: 99, discount: 10, label: "50-99 units (10% off)" },
            qty100plus: { min: 100, max: Infinity, discount: 15, label: "100+ units (15% off)" }
        },
        display: {
            showCostBreakdown: true,
            priceLabel: "Wholesale Price",
            showVolumeDiscounts: true
        }
    }
};

export const complexityTiers = {
    tier1: {
        id: 'tier1',
        name: "Small",
        description: "Simple prints under 50g",
        weightRange: { min: 0, max: 50 },
        setupTime: 0.25, // hours
        postProcessingTime: 0.25 // hours
    },
    tier2: {
        id: 'tier2',
        name: "Medium",
        description: "Standard prints 50-150g",
        weightRange: { min: 50, max: 150 },
        setupTime: 0.5,
        postProcessingTime: 0.5
    },
    tier3: {
        id: 'tier3',
        name: "Large",
        description: "Large prints 150-300g",
        weightRange: { min: 150, max: 300 },
        setupTime: 0.75,
        postProcessingTime: 0.75
    },
    tier4: {
        id: 'tier4',
        name: "Complex",
        description: "Complex/heavy prints 300g+",
        weightRange: { min: 300, max: Infinity },
        setupTime: 1.0,
        postProcessingTime: 1.0
    }
};

export const defaultCostSettings = {
    electricity: {
        rate: 8,           // INR per unit (kWh)
        consumption: 0.2   // kW average printer consumption
    },
    depreciation: {
        purchasePrice: 25000, // INR - printer cost
        lifespan: 5000        // hours of print time
    },
    maintenance: {
        monthlyBudget: 500,   // INR per month
        monthlyHours: 100     // estimated print hours per month
    },
    materialCosts: {
        // Cost per kg in INR
        'PLA': 800,
        'PLA+': 1000,
        'PETG': 1200,
        'ABS': 900,
        'TPU': 2000,
        'Nylon': 2500,
        'Polycarbonate': 3000,
        'ASA': 1500,
        'Wood-Fill': 1800,
        'Metal-Fill': 3500,
        'Carbon Fiber': 4000,
        'Silk PLA': 1200,
        'Glow PLA': 1500,
        'Multi-Color': 1600
    },
    laborRates: {
        setup: 50,          // INR per print (one-time)
        monitoring: 20,     // INR per hour
        postProcessing: 30  // INR per hour
    }
};

// Helper function to get complexity tier from weight
export function getComplexityTierFromWeight(weightGrams) {
    for (const [tierId, tier] of Object.entries(complexityTiers)) {
        if (weightGrams >= tier.weightRange.min && weightGrams < tier.weightRange.max) {
            return tierId;
        }
    }
    return 'tier4'; // Default to complex for very heavy prints
}

// Helper function to get volume discount percentage
export function getVolumeDiscount(quantity, mode) {
    if (mode !== 'bulk' || !pricingModes.bulk.volumeDiscounts) {
        return 0;
    }

    for (const tier of Object.values(pricingModes.bulk.volumeDiscounts)) {
        if (quantity >= tier.min && quantity <= tier.max) {
            return tier.discount;
        }
    }
    return 0;
}

// Helper function to get volume discount tier info
export function getVolumeDiscountTier(quantity, mode) {
    if (mode !== 'bulk' || !pricingModes.bulk.volumeDiscounts) {
        return null;
    }

    for (const tier of Object.values(pricingModes.bulk.volumeDiscounts)) {
        if (quantity >= tier.min && quantity <= tier.max) {
            return tier;
        }
    }
    return null;
}

export default {
    pricingModes,
    complexityTiers,
    defaultCostSettings,
    getComplexityTierFromWeight,
    getVolumeDiscount,
    getVolumeDiscountTier
};
