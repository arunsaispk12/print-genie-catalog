// Print Genie - Enhanced Pricing Engine v2.0
// Core pricing logic with editable parameters and volume discounts

const STORAGE_KEY = 'printGeniePricingConfig';

// Default Configuration
const defaultConfig = {
    version: '2.0',

    // Material Costs (per kg in INR)
    materials: {
        'PLA': { name: 'PLA', cost: 800, density: 1.24, description: 'Standard, easy to print' },
        'PLA+': { name: 'PLA+', cost: 1000, density: 1.24, description: 'Enhanced strength PLA' },
        'PETG': { name: 'PETG', cost: 1000, density: 1.27, description: 'Durable, chemical resistant' },
        'ABS': { name: 'ABS', cost: 900, density: 1.04, description: 'Heat resistant, strong' },
        'TPU': { name: 'TPU', cost: 2000, density: 1.21, description: 'Flexible, rubber-like' },
        'Nylon': { name: 'Nylon', cost: 2500, density: 1.14, description: 'Very strong, wear resistant' },
        'ASA': { name: 'ASA', cost: 1500, density: 1.07, description: 'UV resistant, outdoor use' },
        'Polycarbonate': { name: 'Polycarbonate', cost: 3000, density: 1.20, description: 'Impact resistant, clear' },
        'Wood-Fill': { name: 'Wood-Fill', cost: 1800, density: 1.15, description: 'Wood appearance' },
        'Metal-Fill': { name: 'Metal-Fill', cost: 3500, density: 3.00, description: 'Metallic finish' },
        'Carbon Fiber': { name: 'Carbon Fiber', cost: 4000, density: 1.30, description: 'Lightweight, very strong' },
        'Silk PLA': { name: 'Silk PLA', cost: 1200, density: 1.24, description: 'Shiny, silk-like finish' },
        'Glow PLA': { name: 'Glow PLA', cost: 1500, density: 1.24, description: 'Glows in the dark' },
        'Resin (Standard)': { name: 'Resin (Standard)', cost: 2500, density: 1.10, description: 'High detail resin' },
        'Resin (Tough)': { name: 'Resin (Tough)', cost: 3500, density: 1.15, description: 'Durable resin' }
    },

    // Electricity Costs - UPDATED to ₹6/hour
    electricity: {
        ratePerHour: 6.0,      // ₹6 per hour of printing (your actual rate)
        fdmConsumption: 0.2,   // kW for reference
        slaConsumption: 0.15   // kW for reference
    },

    // Machine Costs
    machine: {
        depreciationPerHour: 5.0,  // Based on ₹25,000 printer / 5000 hours
        maintenancePerHour: 5.0,   // ₹500/month / 100 hours
        failureBuffer: 0.03        // 3% for failed prints
    },

    // Labor Costs
    labor: {
        setupCost: 30,              // Per print setup (reduced with automation)
        monitoringPerHour: 5,       // Minimal with remote monitoring
        postProcessingPerHour: 50,  // Support removal, sanding, finishing
        automationFactor: 0.5       // 50% reduction for automated monitoring
    },

    // Complexity Multipliers
    complexity: {
        'simple': { multiplier: 1.0, label: 'Simple', description: 'Basic shapes, no supports' },
        'moderate': { multiplier: 1.15, label: 'Moderate', description: 'Some details, minimal supports' },
        'complex': { multiplier: 1.3, label: 'Complex', description: 'Detailed, supports needed' },
        'very-complex': { multiplier: 1.5, label: 'Very Complex', description: 'Intricate, heavy supports' }
    },

    // Markup Strategy
    markup: {
        retail: {
            base: 0.50,           // 50% base markup for retail
            targetMargin: 0.45,   // Target 45% profit margin
            minMargin: 0.35       // Never go below 35%
        },
        wholesale: {
            base: 0.30,           // 30% base markup for wholesale
            targetMargin: 0.35,   // Target 35% profit margin
            minMargin: 0.25       // Never go below 25%
        }
    },

    // Volume Discounts (Wholesale Only)
    volumeDiscounts: [
        { minQty: 1, maxQty: 2, discount: 0, label: '1-2 units' },
        { minQty: 3, maxQty: 5, discount: 5, label: '3-5 units (5% off)' },
        { minQty: 6, maxQty: 10, discount: 10, label: '6-10 units (10% off)' },
        { minQty: 11, maxQty: 25, discount: 15, label: '11-25 units (15% off)' },
        { minQty: 26, maxQty: 50, discount: 20, label: '26-50 units (20% off)' },
        { minQty: 51, maxQty: 100, discount: 25, label: '51-100 units (25% off)' },
        { minQty: 101, maxQty: Infinity, discount: 30, label: '100+ units (30% off)' }
    ],

    // Rush Order Premiums
    rushPremiums: {
        'standard': { days: 7, premium: 0, label: 'Standard (5-7 days)' },
        'express': { days: 3, premium: 0.20, label: 'Express (2-3 days, +20%)' },
        'rush': { days: 1, premium: 0.40, label: 'Rush (24 hours, +40%)' },
        'same-day': { days: 0, premium: 0.75, label: 'Same Day (+75%)' }
    },

    // Post-Processing Options
    postProcessing: {
        'none': { cost: 0, timeMultiplier: 0, label: 'None' },
        'support-removal': { cost: 20, timeMultiplier: 0.25, label: 'Support Removal' },
        'sanding': { cost: 50, timeMultiplier: 0.5, label: 'Sanding & Smoothing' },
        'painting': { cost: 100, timeMultiplier: 1.0, label: 'Painting' },
        'assembly': { cost: 75, timeMultiplier: 0.75, label: 'Assembly' },
        'full-finish': { cost: 200, timeMultiplier: 2.0, label: 'Full Finishing' }
    }
};

// Pricing Engine Class
class PricingEngine {
    constructor() {
        this.config = this.loadConfig();
    }

    // Load configuration from localStorage or use defaults
    loadConfig() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all fields exist
                return this.mergeConfig(defaultConfig, parsed);
            }
        } catch (e) {
            console.warn('Failed to load pricing config:', e);
        }
        return JSON.parse(JSON.stringify(defaultConfig));
    }

    // Deep merge configurations
    mergeConfig(defaults, saved) {
        const result = JSON.parse(JSON.stringify(defaults));
        for (const key in saved) {
            if (typeof saved[key] === 'object' && !Array.isArray(saved[key])) {
                result[key] = this.mergeConfig(defaults[key] || {}, saved[key]);
            } else {
                result[key] = saved[key];
            }
        }
        return result;
    }

    // Save configuration to localStorage
    saveConfig() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
            return true;
        } catch (e) {
            console.error('Failed to save pricing config:', e);
            return false;
        }
    }

    // Reset to defaults
    resetToDefaults() {
        this.config = JSON.parse(JSON.stringify(defaultConfig));
        this.saveConfig();
        return this.config;
    }

    // Update material cost
    updateMaterialCost(materialKey, newCost) {
        if (this.config.materials[materialKey]) {
            this.config.materials[materialKey].cost = parseFloat(newCost);
            this.saveConfig();
            return true;
        }
        return false;
    }

    // Update electricity rate
    updateElectricityRate(ratePerHour) {
        this.config.electricity.ratePerHour = parseFloat(ratePerHour);
        this.saveConfig();
    }

    // Get volume discount for quantity
    getVolumeDiscount(quantity, isWholesale = false) {
        if (!isWholesale) return { discount: 0, label: 'Retail (No volume discount)' };

        for (const tier of this.config.volumeDiscounts) {
            if (quantity >= tier.minQty && quantity <= tier.maxQty) {
                return tier;
            }
        }
        return this.config.volumeDiscounts[this.config.volumeDiscounts.length - 1];
    }

    // Calculate all costs for a print job
    calculateCosts(params) {
        const {
            weightGrams,
            printTimeHours,
            material = 'PLA',
            complexity = 'moderate',
            quantity = 1,
            isWholesale = false,
            rushOrder = 'standard',
            postProcessing = ['none']
        } = params;

        const materialConfig = this.config.materials[material] || this.config.materials['PLA'];
        const complexityConfig = this.config.complexity[complexity] || this.config.complexity['moderate'];
        const rushConfig = this.config.rushPremiums[rushOrder] || this.config.rushPremiums['standard'];

        // === COST CALCULATIONS ===

        // 1. Material Cost
        const materialCostPerKg = materialConfig.cost;
        const materialCost = (weightGrams / 1000) * materialCostPerKg;

        // 2. Electricity Cost (₹6/hour)
        const electricityCost = printTimeHours * this.config.electricity.ratePerHour;

        // 3. Machine Costs
        const depreciationCost = printTimeHours * this.config.machine.depreciationPerHour;
        const maintenanceCost = printTimeHours * this.config.machine.maintenancePerHour;

        // 4. Labor Costs (with automation factor)
        const setupCost = this.config.labor.setupCost;
        const monitoringCost = printTimeHours * this.config.labor.monitoringPerHour * this.config.labor.automationFactor;

        // 5. Post-Processing Costs
        let postProcessingCost = 0;
        let postProcessingTime = 0;
        if (Array.isArray(postProcessing)) {
            postProcessing.forEach(pp => {
                const ppConfig = this.config.postProcessing[pp];
                if (ppConfig) {
                    postProcessingCost += ppConfig.cost;
                    postProcessingTime += printTimeHours * ppConfig.timeMultiplier;
                }
            });
        }
        const postProcessingLabor = postProcessingTime * this.config.labor.postProcessingPerHour;

        // 6. Total Labor
        const totalLaborCost = setupCost + monitoringCost + postProcessingLabor;

        // 7. Base Production Cost (per unit)
        const baseProductionCost = materialCost + electricityCost + depreciationCost + maintenanceCost + totalLaborCost + postProcessingCost;

        // 8. Apply Complexity Multiplier
        const adjustedCost = baseProductionCost * complexityConfig.multiplier;

        // 9. Add Failure Buffer
        const failureBuffer = adjustedCost * this.config.machine.failureBuffer;
        const totalCostPerUnit = adjustedCost + failureBuffer;

        // === PRICING CALCULATIONS ===

        const markupConfig = isWholesale ? this.config.markup.wholesale : this.config.markup.retail;

        // 10. Base Price with Markup
        const baseMarkup = totalCostPerUnit * markupConfig.base;
        let unitPrice = totalCostPerUnit + baseMarkup;

        // 11. Apply Volume Discount (wholesale only)
        const volumeDiscount = this.getVolumeDiscount(quantity, isWholesale);
        const discountAmount = unitPrice * (volumeDiscount.discount / 100);
        unitPrice = unitPrice - discountAmount;

        // 12. Apply Rush Premium
        const rushPremium = unitPrice * rushConfig.premium;
        unitPrice = unitPrice + rushPremium;

        // 13. Round to nearest 5
        unitPrice = Math.ceil(unitPrice / 5) * 5;

        // 14. Calculate Totals
        const subtotal = unitPrice * quantity;
        const totalDiscount = discountAmount * quantity;
        const totalRushPremium = rushPremium * quantity;
        const finalTotal = subtotal;

        // 15. Calculate Margins
        const profitPerUnit = unitPrice - totalCostPerUnit;
        const profitMargin = (profitPerUnit / unitPrice) * 100;
        const totalProfit = profitPerUnit * quantity;

        // Return comprehensive result
        return {
            // Input Parameters
            params: {
                weightGrams,
                printTimeHours,
                material,
                materialName: materialConfig.name,
                complexity,
                complexityLabel: complexityConfig.label,
                quantity,
                isWholesale,
                rushOrder,
                rushLabel: rushConfig.label,
                postProcessing
            },

            // Cost Breakdown (per unit)
            costs: {
                material: round2(materialCost),
                electricity: round2(electricityCost),
                depreciation: round2(depreciationCost),
                maintenance: round2(maintenanceCost),
                labor: round2(totalLaborCost),
                postProcessing: round2(postProcessingCost),
                baseProduction: round2(baseProductionCost),
                complexityAdjustment: round2(adjustedCost - baseProductionCost),
                failureBuffer: round2(failureBuffer),
                totalCost: round2(totalCostPerUnit)
            },

            // Pricing
            pricing: {
                costPerUnit: round2(totalCostPerUnit),
                markup: round2(baseMarkup),
                volumeDiscount: {
                    percent: volumeDiscount.discount,
                    label: volumeDiscount.label,
                    amount: round2(discountAmount)
                },
                rushPremium: {
                    percent: rushConfig.premium * 100,
                    label: rushConfig.label,
                    amount: round2(rushPremium)
                },
                unitPrice: round2(unitPrice),
                quantity: quantity,
                subtotal: round2(subtotal),
                totalDiscount: round2(totalDiscount),
                totalRushPremium: round2(totalRushPremium),
                finalTotal: round2(finalTotal)
            },

            // Profit Analysis
            profit: {
                perUnit: round2(profitPerUnit),
                margin: round2(profitMargin),
                total: round2(totalProfit),
                isHealthy: profitMargin >= (markupConfig.minMargin * 100)
            },

            // Metadata
            meta: {
                calculatedAt: new Date().toISOString(),
                configVersion: this.config.version,
                pricingMode: isWholesale ? 'Wholesale' : 'Retail'
            }
        };
    }

    // Quick retail price calculation
    calculateRetailPrice(weightGrams, printTimeHours, material = 'PLA', complexity = 'moderate') {
        const result = this.calculateCosts({
            weightGrams,
            printTimeHours,
            material,
            complexity,
            quantity: 1,
            isWholesale: false
        });
        return result.pricing.unitPrice;
    }

    // Quick wholesale price calculation
    calculateWholesalePrice(weightGrams, printTimeHours, material = 'PLA', complexity = 'moderate', quantity = 10) {
        const result = this.calculateCosts({
            weightGrams,
            printTimeHours,
            material,
            complexity,
            quantity,
            isWholesale: true
        });
        return result.pricing.unitPrice;
    }

    // Get all materials
    getMaterials() {
        return this.config.materials;
    }

    // Get volume discount tiers
    getVolumeTiers() {
        return this.config.volumeDiscounts;
    }

    // Get rush options
    getRushOptions() {
        return this.config.rushPremiums;
    }

    // Get post-processing options
    getPostProcessingOptions() {
        return this.config.postProcessing;
    }

    // Get complexity options
    getComplexityOptions() {
        return this.config.complexity;
    }

    // Get current electricity rate
    getElectricityRate() {
        return this.config.electricity.ratePerHour;
    }

    // Generate price comparison table
    generatePriceTable(weightGrams, printTimeHours, material = 'PLA') {
        const table = [];
        const quantities = [1, 3, 5, 10, 25, 50, 100];

        quantities.forEach(qty => {
            const retail = this.calculateCosts({
                weightGrams, printTimeHours, material,
                quantity: 1, isWholesale: false
            });

            const wholesale = this.calculateCosts({
                weightGrams, printTimeHours, material,
                quantity: qty, isWholesale: true
            });

            table.push({
                quantity: qty,
                retailUnit: retail.pricing.unitPrice,
                retailTotal: retail.pricing.unitPrice * qty,
                wholesaleUnit: wholesale.pricing.unitPrice,
                wholesaleTotal: wholesale.pricing.finalTotal,
                savings: (retail.pricing.unitPrice * qty) - wholesale.pricing.finalTotal,
                savingsPercent: round2(((retail.pricing.unitPrice * qty - wholesale.pricing.finalTotal) / (retail.pricing.unitPrice * qty)) * 100)
            });
        });

        return table;
    }
}

// Utility function
function round2(num) {
    return Math.round(num * 100) / 100;
}

// Create singleton instance
const pricingEngine = new PricingEngine();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PricingEngine, pricingEngine, defaultConfig };
}

// Export for ES6 modules
export { PricingEngine, pricingEngine, defaultConfig };
export default pricingEngine;
