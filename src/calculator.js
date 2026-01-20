// Print Genie - Price Calculator Module
// Handles pricing calculations and quote exports

import { pricingModes, complexityTiers, defaultCostSettings, getVolumeDiscount, getVolumeDiscountTier } from './pricing-modes.js';

// Calculator State
let currentMode = 'retail';
let currentCostSettings = null;
let lastCalculation = null;

// Initialize Calculator
export function initializeCalculator() {
    // Load cost settings from localStorage
    loadCostSettings();

    // Setup mode toggle
    setupModeToggle();

    // Setup calculate button
    setupCalculateButton();

    // Setup form reset
    setupFormReset();

    // Setup export buttons
    setupExportButtons();

    // Setup cost settings form
    setupCostSettingsForm();

    // Setup quantity change listener for bulk mode warnings
    setupQuantityListener();

    // Auto-update complexity based on weight
    setupWeightListener();
}

// Load Cost Settings from localStorage
function loadCostSettings() {
    const savedSettings = localStorage.getItem('printerCostSettings');
    if (savedSettings) {
        currentCostSettings = JSON.parse(savedSettings);
        populateCostSettingsForm(currentCostSettings);
    } else {
        currentCostSettings = { ...defaultCostSettings };
    }
}

// Save Cost Settings to localStorage
function saveCostSettings() {
    localStorage.setItem('printerCostSettings', JSON.stringify(currentCostSettings));
}

// Populate Cost Settings Form
function populateCostSettingsForm(settings) {
    // Electricity
    const electricityRate = document.getElementById('electricityRate');
    const printerConsumption = document.getElementById('printerConsumption');
    if (electricityRate) electricityRate.value = settings.electricity?.rate || 8;
    if (printerConsumption) printerConsumption.value = settings.electricity?.consumption || 0.2;

    // Depreciation
    const printerCost = document.getElementById('printerCost');
    const printerLifespan = document.getElementById('printerLifespan');
    if (printerCost) printerCost.value = settings.depreciation?.purchasePrice || 25000;
    if (printerLifespan) printerLifespan.value = settings.depreciation?.lifespan || 5000;

    // Maintenance
    const maintenanceBudget = document.getElementById('maintenanceBudget');
    const monthlyPrintHours = document.getElementById('monthlyPrintHours');
    if (maintenanceBudget) maintenanceBudget.value = settings.maintenance?.monthlyBudget || 500;
    if (monthlyPrintHours) monthlyPrintHours.value = settings.maintenance?.monthlyHours || 100;

    // Labor
    const setupRate = document.getElementById('setupRate');
    const monitoringRate = document.getElementById('monitoringRate');
    const postProcessingRate = document.getElementById('postProcessingRate');
    if (setupRate) setupRate.value = settings.laborRates?.setup || 50;
    if (monitoringRate) monitoringRate.value = settings.laborRates?.monitoring || 20;
    if (postProcessingRate) postProcessingRate.value = settings.laborRates?.postProcessing || 30;

    // Material costs
    const materialInputs = document.querySelectorAll('.material-cost-input');
    materialInputs.forEach(input => {
        const material = input.dataset.material;
        if (settings.materialCosts && settings.materialCosts[material] !== undefined) {
            input.value = settings.materialCosts[material];
        }
    });
}

// Setup Cost Settings Form
function setupCostSettingsForm() {
    const form = document.getElementById('printerCostForm');
    const resetBtn = document.getElementById('resetCostSettingsBtn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCurrentCostSettings();
            alert('Cost settings saved successfully!');
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset all cost settings to default values?')) {
                currentCostSettings = { ...defaultCostSettings };
                populateCostSettingsForm(currentCostSettings);
                saveCostSettings();
                alert('Cost settings reset to defaults!');
            }
        });
    }
}

// Save Current Form Values to Cost Settings
function saveCurrentCostSettings() {
    currentCostSettings = {
        electricity: {
            rate: parseFloat(document.getElementById('electricityRate')?.value) || 8,
            consumption: parseFloat(document.getElementById('printerConsumption')?.value) || 0.2
        },
        depreciation: {
            purchasePrice: parseFloat(document.getElementById('printerCost')?.value) || 25000,
            lifespan: parseFloat(document.getElementById('printerLifespan')?.value) || 5000
        },
        maintenance: {
            monthlyBudget: parseFloat(document.getElementById('maintenanceBudget')?.value) || 500,
            monthlyHours: parseFloat(document.getElementById('monthlyPrintHours')?.value) || 100
        },
        laborRates: {
            setup: parseFloat(document.getElementById('setupRate')?.value) || 50,
            monitoring: parseFloat(document.getElementById('monitoringRate')?.value) || 20,
            postProcessing: parseFloat(document.getElementById('postProcessingRate')?.value) || 30
        },
        materialCosts: {}
    };

    // Get material costs from form
    const materialInputs = document.querySelectorAll('.material-cost-input');
    materialInputs.forEach(input => {
        const material = input.dataset.material;
        currentCostSettings.materialCosts[material] = parseFloat(input.value) || 0;
    });

    saveCostSettings();
}

// Setup Mode Toggle
function setupModeToggle() {
    const modeButtons = document.querySelectorAll('.mode-toggle-btn');

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            setPricingMode(mode);

            // Update button states
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Set Pricing Mode
function setPricingMode(mode) {
    currentMode = mode;

    const volumeDiscountInfo = document.getElementById('volumeDiscountInfo');
    const minQtyWarning = document.getElementById('minQtyWarning');

    if (mode === 'bulk') {
        // Show volume discount info
        if (volumeDiscountInfo) volumeDiscountInfo.style.display = 'block';

        // Check current quantity
        const quantity = parseInt(document.getElementById('calcQuantity')?.value) || 1;
        validateBulkOrder(quantity);
    } else {
        // Hide bulk-specific UI
        if (volumeDiscountInfo) volumeDiscountInfo.style.display = 'none';
        if (minQtyWarning) minQtyWarning.style.display = 'none';
    }

    // Hide results when mode changes
    const results = document.getElementById('calculatorResults');
    if (results) results.style.display = 'none';
}

// Validate Bulk Order Quantity
function validateBulkOrder(quantity) {
    const minQtyWarning = document.getElementById('minQtyWarning');

    if (currentMode === 'bulk' && quantity < pricingModes.bulk.minOrderQty) {
        if (minQtyWarning) minQtyWarning.style.display = 'flex';
        return false;
    } else {
        if (minQtyWarning) minQtyWarning.style.display = 'none';
        return true;
    }
}

// Setup Quantity Listener
function setupQuantityListener() {
    const quantityInput = document.getElementById('calcQuantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', () => {
            const quantity = parseInt(quantityInput.value) || 1;
            validateBulkOrder(quantity);
        });
    }
}

// Setup Weight Listener (auto-suggest complexity)
function setupWeightListener() {
    const weightInput = document.getElementById('calcWeight');
    const complexitySelect = document.getElementById('calcComplexity');

    if (weightInput && complexitySelect) {
        weightInput.addEventListener('change', () => {
            const weight = parseFloat(weightInput.value) || 0;

            // Auto-select complexity based on weight
            if (weight > 0 && weight < 50) {
                complexitySelect.value = 'tier1';
            } else if (weight >= 50 && weight < 150) {
                complexitySelect.value = 'tier2';
            } else if (weight >= 150 && weight < 300) {
                complexitySelect.value = 'tier3';
            } else if (weight >= 300) {
                complexitySelect.value = 'tier4';
            }
        });
    }
}

// Setup Calculate Button
function setupCalculateButton() {
    const calculateBtn = document.getElementById('calculatePriceBtn');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            calculatePrice();
        });
    }
}

// Setup Form Reset
function setupFormReset() {
    const form = document.getElementById('calculatorForm');

    if (form) {
        form.addEventListener('reset', () => {
            setTimeout(() => {
                // Hide results
                const results = document.getElementById('calculatorResults');
                if (results) results.style.display = 'none';

                // Reset mode to retail
                setPricingMode('retail');
                const modeButtons = document.querySelectorAll('.mode-toggle-btn');
                modeButtons.forEach(b => b.classList.remove('active'));
                const retailBtn = document.querySelector('.mode-toggle-btn[data-mode="retail"]');
                if (retailBtn) retailBtn.classList.add('active');
            }, 10);
        });
    }
}

// Main Calculation Function
function calculatePrice() {
    // Get form values
    const weight = parseFloat(document.getElementById('calcWeight')?.value);
    const printTime = parseFloat(document.getElementById('calcTime')?.value);
    const material = document.getElementById('calcMaterial')?.value;
    const complexity = document.getElementById('calcComplexity')?.value;
    const quantity = parseInt(document.getElementById('calcQuantity')?.value) || 1;
    const itemName = document.getElementById('calcItemName')?.value || 'Custom 3D Print';
    const description = document.getElementById('calcDescription')?.value || '';

    // Validate required fields
    if (!weight || !printTime || !material || !complexity) {
        alert('Please fill in all required fields (Weight, Time, Material, Complexity)');
        return;
    }

    // Get pricing mode config
    const modeConfig = pricingModes[currentMode];
    const tierConfig = complexityTiers[complexity];

    // Get cost settings
    const settings = currentCostSettings || defaultCostSettings;

    // Calculate individual costs
    const materialCostPerKg = settings.materialCosts[material] || 1000;
    const materialCost = (weight / 1000) * materialCostPerKg;

    const electricityCost = printTime * settings.electricity.consumption * settings.electricity.rate;

    const depreciationCost = printTime * (settings.depreciation.purchasePrice / settings.depreciation.lifespan);

    const maintenanceCost = printTime * (settings.maintenance.monthlyBudget / settings.maintenance.monthlyHours);

    // Labor cost with mode multiplier
    const setupCost = settings.laborRates.setup;
    const monitoringCost = settings.laborRates.monitoring * printTime;
    const postProcessingCost = settings.laborRates.postProcessing * tierConfig.postProcessingTime;
    const laborCost = (setupCost + monitoringCost + postProcessingCost) * modeConfig.laborMultiplier;

    // Total production cost
    const totalCost = materialCost + electricityCost + depreciationCost + maintenanceCost + laborCost;

    // Get profit margin based on complexity tier
    const profitMargin = modeConfig.profitMargins[complexity];
    const profitAmount = totalCost * (profitMargin / 100);

    // Calculate base price
    const basePrice = totalCost + profitAmount;

    // Round to nearest 10
    const unitPrice = Math.ceil(basePrice / 10) * 10;

    // Calculate totals
    const subtotal = unitPrice * quantity;

    // Get volume discount
    const discountPercent = getVolumeDiscount(quantity, currentMode);
    const discountAmount = subtotal * (discountPercent / 100);
    const finalTotal = subtotal - discountAmount;

    // Store calculation result
    lastCalculation = {
        itemName,
        description,
        mode: currentMode,
        modeName: modeConfig.name,
        weight,
        printTime,
        material,
        complexity,
        complexityName: tierConfig.name,
        quantity,
        costs: {
            material: materialCost,
            electricity: electricityCost,
            depreciation: depreciationCost,
            maintenance: maintenanceCost,
            labor: laborCost,
            total: totalCost
        },
        profitMargin,
        profitAmount,
        unitPrice,
        subtotal,
        discountPercent,
        discountAmount,
        finalTotal,
        quoteId: generateQuoteId(),
        quoteDate: new Date().toISOString()
    };

    // Display results
    displayResults(lastCalculation);
}

// Generate Quote ID
function generateQuoteId() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PG-Q${dateStr}-${random}`;
}

// Display Calculation Results
function displayResults(data) {
    const resultsSection = document.getElementById('calculatorResults');
    if (!resultsSection) return;

    // Show results section
    resultsSection.style.display = 'block';

    // Update item name
    document.getElementById('resultItemName').textContent = data.itemName;

    // Update mode badge
    const modeBadge = document.getElementById('resultModeBadge');
    modeBadge.textContent = data.modeName;
    modeBadge.className = `result-mode-badge ${data.mode}`;

    // Show/hide cost breakdown based on mode
    const costBreakdown = document.getElementById('costBreakdown');
    if (data.mode === 'bulk') {
        costBreakdown.style.display = 'block';

        // Populate breakdown values
        document.getElementById('materialCostValue').textContent = formatCurrency(data.costs.material);
        document.getElementById('electricityCostValue').textContent = formatCurrency(data.costs.electricity);
        document.getElementById('depreciationCostValue').textContent = formatCurrency(data.costs.depreciation);
        document.getElementById('maintenanceCostValue').textContent = formatCurrency(data.costs.maintenance);
        document.getElementById('laborCostValue').textContent = formatCurrency(data.costs.labor);
        document.getElementById('totalCostValue').textContent = formatCurrency(data.costs.total);
        document.getElementById('profitMarginPercent').textContent = data.profitMargin;
        document.getElementById('profitAmountValue').textContent = formatCurrency(data.profitAmount);
    } else {
        costBreakdown.style.display = 'none';
    }

    // Update pricing summary
    document.getElementById('unitPriceValue').textContent = formatCurrency(data.unitPrice);
    document.getElementById('quantityValue').textContent = data.quantity;
    document.getElementById('subtotalValue').textContent = formatCurrency(data.subtotal);

    // Show/hide discount row
    const discountRow = document.getElementById('discountRow');
    if (data.discountPercent > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discountPercent').textContent = data.discountPercent;
        document.getElementById('discountValue').textContent = `-${formatCurrency(data.discountAmount)}`;
    } else {
        discountRow.style.display = 'none';
    }

    // Update final total
    document.getElementById('finalTotalValue').textContent = formatCurrency(data.finalTotal);

    // Update result info
    document.getElementById('resultMaterial').textContent = data.material;
    document.getElementById('resultComplexity').textContent = data.complexityName;
    document.getElementById('resultPrintTime').textContent = data.printTime;

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Format Currency
function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
}

// Setup Export Buttons
function setupExportButtons() {
    const pdfBtn = document.getElementById('exportPdfBtn');
    const whatsappBtn = document.getElementById('exportWhatsappBtn');
    const emailBtn = document.getElementById('exportEmailBtn');
    const csvBtn = document.getElementById('exportCsvBtn');
    const imageBtn = document.getElementById('exportImageBtn');

    if (pdfBtn) pdfBtn.addEventListener('click', exportToPDF);
    if (whatsappBtn) whatsappBtn.addEventListener('click', exportToWhatsApp);
    if (emailBtn) emailBtn.addEventListener('click', exportToEmail);
    if (csvBtn) csvBtn.addEventListener('click', exportToCSV);
    if (imageBtn) imageBtn.addEventListener('click', exportToImage);
}

// Company Info for PDF
const companyInfo = {
    name: 'Print Genie',
    tagline: 'Digital Craftsmanship & Automation',
    phone: '+91 98765 43210',
    email: 'orders@printgenie.in',
    website: 'www.printgenie.in',
    address: 'Hyderabad, India',
    upiId: 'printgenie@upi',
    bankName: 'State Bank of India',
    accountNo: 'XXXXXXXXXXXX',
    ifscCode: 'SBIN0XXXXXX'
};

// Format currency for PDF (using Rs. for better compatibility)
function formatPDFCurrency(amount) {
    return `Rs. ${amount.toFixed(2)}`;
}

// Export to PDF - Enhanced Version
function exportToPDF() {
    if (!lastCalculation) {
        alert('Please calculate a price first!');
        return;
    }

    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please try again.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const data = lastCalculation;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Calculate validity date (7 days from now)
    const validityDate = new Date();
    validityDate.setDate(validityDate.getDate() + 7);
    const validityDateStr = validityDate.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    // ========== HEADER WITH GRADIENT EFFECT ==========
    // Purple gradient header bar
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Gradient overlay (darker at bottom)
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 35, pageWidth, 10, 'F');

    // Company name
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name, 20, 22);

    // Tagline
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(companyInfo.tagline, 20, 32);

    // Quote info on right
    doc.setFontSize(10);
    doc.text(`Quote: ${data.quoteId}`, pageWidth - 20, 18, { align: 'right' });
    doc.setFontSize(9);
    doc.text(`Date: ${new Date(data.quoteDate).toLocaleDateString('en-IN')}`, pageWidth - 20, 26, { align: 'right' });

    // Mode badge
    const badgeText = data.mode === 'bulk' ? 'WHOLESALE' : 'RETAIL';
    const badgeColor = data.mode === 'bulk' ? [16, 185, 129] : [99, 102, 241];
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 55, 30, 35, 8, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...badgeColor);
    doc.setFont('helvetica', 'bold');
    doc.text(badgeText, pageWidth - 37.5, 35.5, { align: 'center' });

    let yPos = 55;

    // ========== CUSTOMER & ITEM SECTION ==========
    doc.setFont('helvetica', 'normal');

    // Customer section (left)
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('PREPARED FOR', 20, yPos);

    yPos += 6;
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text('Valued Customer', 20, yPos);

    // Item section (right)
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('ITEM', 110, yPos - 6);

    doc.setFontSize(12);
    doc.setTextColor(99, 102, 241);
    doc.setFont('helvetica', 'bold');
    doc.text(data.itemName, 110, yPos);

    yPos += 12;

    // Divider line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);

    yPos += 10;

    // ========== SPECIFICATIONS GRID ==========
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text('Specifications', 20, yPos);

    yPos += 8;

    // Specs in a grid layout
    const specs = [
        { label: 'Material', value: data.material },
        { label: 'Weight', value: `${data.weight}g` },
        { label: 'Print Time', value: `${data.printTime} hrs` },
        { label: 'Complexity', value: data.complexityName },
        { label: 'Quantity', value: `${data.quantity} units` },
        { label: 'Delivery', value: 'Standard (5-7 days)' }
    ];

    // Draw spec boxes
    const boxWidth = 55;
    const boxHeight = 18;
    let boxX = 20;
    let boxY = yPos;

    specs.forEach((spec, i) => {
        // Box background
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'F');

        // Label
        doc.setFontSize(7);
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(spec.label, boxX + boxWidth / 2, boxY + 6, { align: 'center' });

        // Value
        doc.setFontSize(9);
        doc.setTextColor(17, 24, 39);
        doc.setFont('helvetica', 'bold');
        doc.text(spec.value, boxX + boxWidth / 2, boxY + 13, { align: 'center' });

        boxX += boxWidth + 3;
        if ((i + 1) % 3 === 0) {
            boxX = 20;
            boxY += boxHeight + 3;
        }
    });

    yPos = boxY + boxHeight + 10;

    // ========== COST BREAKDOWN (WHOLESALE ONLY) ==========
    if (data.mode === 'bulk') {
        // Cost breakdown box
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(20, yPos, pageWidth - 40, 55, 3, 3, 'F');

        yPos += 8;
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'bold');
        doc.text('Cost Breakdown (Per Unit)', 25, yPos);

        yPos += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        const costs = [
            ['Material Cost', formatPDFCurrency(data.costs.material)],
            ['Electricity Cost', formatPDFCurrency(data.costs.electricity)],
            ['Machine Costs', formatPDFCurrency(data.costs.depreciation + data.costs.maintenance)],
            ['Labor Cost', formatPDFCurrency(data.costs.labor)],
            ['Production Cost', formatPDFCurrency(data.costs.total)],
            [`Profit (${data.profitMargin}%)`, formatPDFCurrency(data.profitAmount)]
        ];

        let costY = yPos;
        costs.forEach(([label, value], i) => {
            const xOffset = i < 3 ? 0 : 85;
            const yOffset = i < 3 ? i * 7 : (i - 3) * 7;

            doc.setTextColor(107, 114, 128);
            doc.text(label, 30 + xOffset, costY + yOffset);
            doc.setTextColor(17, 24, 39);
            doc.text(value, 75 + xOffset, costY + yOffset, { align: 'right' });
        });

        yPos += 40;
    }

    // ========== PRICING SUMMARY ==========
    yPos += 5;
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text('Pricing Summary', 20, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    // Pricing rows
    const pricingRows = [
        ['Unit Price', formatPDFCurrency(data.unitPrice)],
        ['Quantity', `x ${data.quantity}`],
        ['Subtotal', formatPDFCurrency(data.subtotal)]
    ];

    pricingRows.forEach(([label, value]) => {
        doc.setTextColor(75, 85, 99);
        doc.text(label, 25, yPos);
        doc.setTextColor(17, 24, 39);
        doc.setFont('helvetica', 'bold');
        doc.text(value, pageWidth - 25, yPos, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        yPos += 8;
    });

    // Volume discount row (if applicable)
    if (data.discountPercent > 0) {
        doc.setFillColor(236, 253, 245);
        doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
        doc.setTextColor(16, 185, 129);
        doc.text(`Volume Discount (${data.discountPercent}%)`, 25, yPos + 2);
        doc.setFont('helvetica', 'bold');
        doc.text(`- ${formatPDFCurrency(data.discountAmount)}`, pageWidth - 25, yPos + 2, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        yPos += 12;
    }

    // Total row with gradient background
    yPos += 3;
    doc.setFillColor(99, 102, 241);
    doc.roundedRect(20, yPos - 5, pageWidth - 40, 16, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT', 25, yPos + 5);
    doc.setFontSize(14);
    doc.text(formatPDFCurrency(data.finalTotal), pageWidth - 25, yPos + 5, { align: 'right' });

    yPos += 20;

    // ========== VOLUME DISCOUNT TABLE (WHOLESALE) ==========
    if (data.mode === 'bulk') {
        yPos += 5;
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'bold');
        doc.text('Volume Pricing Tiers', 20, yPos);

        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);

        // Table header
        doc.setFillColor(99, 102, 241);
        doc.rect(20, yPos, pageWidth - 40, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Quantity', 30, yPos + 5);
        doc.text('Discount', 80, yPos + 5);
        doc.text('Est. Unit Price', 130, yPos + 5);

        yPos += 8;

        const volumeTiers = [
            { range: '10-24 units', discount: '0%', multiplier: 1.0 },
            { range: '25-49 units', discount: '5%', multiplier: 0.95 },
            { range: '50-99 units', discount: '10%', multiplier: 0.90 },
            { range: '100+ units', discount: '15%', multiplier: 0.85 }
        ];

        volumeTiers.forEach((tier, i) => {
            const isCurrent = (
                (data.quantity >= 10 && data.quantity <= 24 && i === 0) ||
                (data.quantity >= 25 && data.quantity <= 49 && i === 1) ||
                (data.quantity >= 50 && data.quantity <= 99 && i === 2) ||
                (data.quantity >= 100 && i === 3)
            );

            if (isCurrent) {
                doc.setFillColor(236, 253, 245);
                doc.rect(20, yPos, pageWidth - 40, 7, 'F');
            } else if (i % 2 === 0) {
                doc.setFillColor(249, 250, 251);
                doc.rect(20, yPos, pageWidth - 40, 7, 'F');
            }

            doc.setTextColor(isCurrent ? 16 : 75, isCurrent ? 185 : 85, isCurrent ? 129 : 99);
            doc.setFont('helvetica', isCurrent ? 'bold' : 'normal');
            doc.text(tier.range, 30, yPos + 5);
            doc.text(tier.discount, 80, yPos + 5);
            const estPrice = data.unitPrice * tier.multiplier;
            doc.text(formatPDFCurrency(Math.ceil(estPrice / 5) * 5) + (isCurrent ? ' (Current)' : ''), 130, yPos + 5);

            yPos += 7;
        });

        yPos += 5;
    }

    // ========== TERMS & PAYMENT INFO ==========
    yPos += 5;

    // Two columns: Terms and Payment
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(20, yPos, 82, 45, 2, 2, 'F');
    doc.roundedRect(108, yPos, 82, 45, 2, 2, 'F');

    // Terms column
    yPos += 6;
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions', 25, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);

    const terms = [
        `Valid until: ${validityDateStr}`,
        '50% advance to confirm order',
        'Balance before delivery',
        'Colors may vary slightly',
        'Custom orders non-refundable'
    ];

    terms.forEach(term => {
        doc.text(`• ${term}`, 25, yPos);
        yPos += 5;
    });

    // Payment column
    yPos -= 25;
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', 113, yPos - 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);

    const paymentInfo = [
        `UPI: ${companyInfo.upiId}`,
        `Bank: ${companyInfo.bankName}`,
        `A/C: ${companyInfo.accountNo}`,
        `IFSC: ${companyInfo.ifscCode}`,
        'GPay/PhonePe accepted'
    ];

    paymentInfo.forEach(info => {
        doc.text(`• ${info}`, 113, yPos);
        yPos += 5;
    });

    // ========== FOOTER ==========
    const footerY = 275;

    // Footer background
    doc.setFillColor(31, 41, 55);
    doc.rect(0, footerY - 5, pageWidth, 25, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name, pageWidth / 2, footerY + 2, { align: 'center' });

    // Contact info
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const contactLine = `${companyInfo.phone}  |  ${companyInfo.email}  |  ${companyInfo.website}`;
    doc.text(contactLine, pageWidth / 2, footerY + 9, { align: 'center' });

    // Thank you message
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(6);
    doc.text('Thank you for choosing Print Genie! We look forward to bringing your ideas to life.', pageWidth / 2, footerY + 15, { align: 'center' });

    // Save PDF
    doc.save(`PrintGenie-Quote-${data.quoteId}.pdf`);
}

// Export to WhatsApp
function exportToWhatsApp() {
    if (!lastCalculation) {
        alert('Please calculate a price first!');
        return;
    }

    const data = lastCalculation;
    let message = `*Print Genie Quote*\n`;
    message += `Quote ID: ${data.quoteId}\n`;
    message += `━━━━━━━━━━━━━━━━\n\n`;
    message += `*${data.itemName}*\n\n`;
    message += `Material: ${data.material}\n`;
    message += `Complexity: ${data.complexityName}\n`;
    message += `Weight: ${data.weight}g\n`;
    message += `Print Time: ${data.printTime} hours\n\n`;
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `*Pricing (${data.modeName})*\n`;
    message += `Unit Price: ${formatCurrency(data.unitPrice)}\n`;
    message += `Quantity: ${data.quantity}\n`;

    if (data.discountPercent > 0) {
        message += `Discount: ${data.discountPercent}% off\n`;
    }

    message += `\n*TOTAL: ${formatCurrency(data.finalTotal)}*\n\n`;
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `Valid for 7 days\n`;
    message += `Contact us to place your order!`;

    // Copy to clipboard
    navigator.clipboard.writeText(message).then(() => {
        alert('Quote copied to clipboard!\n\nOpening WhatsApp...');

        // Open WhatsApp
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }).catch(() => {
        // Fallback - just open WhatsApp
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    });
}

// Export to Email
function exportToEmail() {
    if (!lastCalculation) {
        alert('Please calculate a price first!');
        return;
    }

    const data = lastCalculation;

    const subject = `Print Genie Quote - ${data.quoteId}`;

    let body = `Print Genie - 3D Printing Price Quote\n\n`;
    body += `Quote ID: ${data.quoteId}\n`;
    body += `Date: ${new Date(data.quoteDate).toLocaleDateString()}\n`;
    body += `Customer Type: ${data.modeName}\n\n`;
    body += `=== Item Details ===\n`;
    body += `Item: ${data.itemName}\n`;
    body += `Material: ${data.material}\n`;
    body += `Complexity: ${data.complexityName}\n`;
    body += `Weight: ${data.weight}g\n`;
    body += `Print Time: ${data.printTime} hours\n\n`;
    body += `=== Pricing Summary ===\n`;
    body += `Unit Price: ${formatCurrency(data.unitPrice)}\n`;
    body += `Quantity: ${data.quantity}\n`;
    body += `Subtotal: ${formatCurrency(data.subtotal)}\n`;

    if (data.discountPercent > 0) {
        body += `Volume Discount (${data.discountPercent}%): -${formatCurrency(data.discountAmount)}\n`;
    }

    body += `\nTOTAL: ${formatCurrency(data.finalTotal)}\n\n`;
    body += `=== Terms ===\n`;
    body += `- Prices valid for 7 days\n`;
    body += `- 50% advance payment required\n`;
    body += `- Delivery time varies by complexity\n\n`;
    body += `Thank you for choosing Print Genie!\n`;

    // Open email client
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// Export to CSV
function exportToCSV() {
    if (!lastCalculation) {
        alert('Please calculate a price first!');
        return;
    }

    const data = lastCalculation;

    const headers = [
        'Quote ID', 'Date', 'Customer Type', 'Item Name',
        'Material', 'Complexity', 'Weight (g)', 'Print Time (hrs)',
        'Unit Price', 'Quantity', 'Subtotal', 'Discount %', 'Discount Amount', 'Final Total'
    ];

    const values = [
        data.quoteId,
        new Date(data.quoteDate).toLocaleDateString(),
        data.modeName,
        data.itemName,
        data.material,
        data.complexityName,
        data.weight,
        data.printTime,
        data.unitPrice,
        data.quantity,
        data.subtotal,
        data.discountPercent,
        data.discountAmount,
        data.finalTotal
    ];

    // Add cost breakdown for bulk orders
    if (data.mode === 'bulk') {
        headers.push('Material Cost', 'Electricity Cost', 'Depreciation Cost', 'Maintenance Cost', 'Labor Cost', 'Total Cost', 'Profit Margin %', 'Profit Amount');
        values.push(
            data.costs.material.toFixed(2),
            data.costs.electricity.toFixed(2),
            data.costs.depreciation.toFixed(2),
            data.costs.maintenance.toFixed(2),
            data.costs.labor.toFixed(2),
            data.costs.total.toFixed(2),
            data.profitMargin,
            data.profitAmount.toFixed(2)
        );
    }

    const csvContent = [
        headers.join(','),
        values.map(v => typeof v === 'string' ? `"${v}"` : v).join(',')
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrintGenie-Quote-${data.quoteId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Export to Image (Canvas-based)
function exportToImage() {
    if (!lastCalculation) {
        alert('Please calculate a price first!');
        return;
    }

    const data = lastCalculation;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // White card
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 60, 60, 960, 960, 30);
    ctx.fill();

    // Header
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('Print Genie', 100, 140);

    ctx.fillStyle = '#6b7280';
    ctx.font = '24px Arial';
    ctx.fillText('3D Printing Price Quote', 100, 180);

    // Quote ID
    ctx.fillStyle = '#111827';
    ctx.font = '20px Arial';
    ctx.fillText(`Quote ID: ${data.quoteId}`, 100, 240);

    // Divider
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 270);
    ctx.lineTo(980, 270);
    ctx.stroke();

    // Item Name
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(data.itemName, 100, 340);

    // Details
    ctx.font = '24px Arial';
    ctx.fillStyle = '#6b7280';

    let yPos = 400;
    ctx.fillText(`Material: ${data.material}`, 100, yPos);
    ctx.fillText(`Complexity: ${data.complexityName}`, 550, yPos);

    yPos += 50;
    ctx.fillText(`Weight: ${data.weight}g`, 100, yPos);
    ctx.fillText(`Print Time: ${data.printTime} hours`, 550, yPos);

    // Pricing Box
    yPos += 80;
    ctx.fillStyle = '#f3f4f6';
    roundRect(ctx, 100, yPos, 880, 200, 20);
    ctx.fill();

    yPos += 50;
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`${data.modeName}`, 140, yPos);

    yPos += 50;
    ctx.font = '24px Arial';
    ctx.fillText(`Unit Price: ${formatCurrency(data.unitPrice)}`, 140, yPos);
    ctx.fillText(`Qty: ${data.quantity}`, 500, yPos);

    yPos += 50;
    if (data.discountPercent > 0) {
        ctx.fillStyle = '#10b981';
        ctx.fillText(`${data.discountPercent}% Volume Discount Applied!`, 140, yPos);
    }

    // Total
    yPos += 100;
    ctx.fillStyle = '#6366f1';
    roundRect(ctx, 100, yPos, 880, 120, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('TOTAL', 140, yPos + 55);

    ctx.font = 'bold 48px Arial';
    ctx.fillText(formatCurrency(data.finalTotal), 700, yPos + 60);

    // Footer
    yPos += 180;
    ctx.fillStyle = '#6b7280';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Valid for 7 days | Contact us to place your order!', 540, yPos);

    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('printgenie.com', 540, yPos + 40);

    // Download image
    const link = document.createElement('a');
    link.download = `PrintGenie-Quote-${data.quoteId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Helper function for rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Export the initialization function
export default {
    initializeCalculator
};
