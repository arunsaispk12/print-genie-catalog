// Print Genie - Quote Generator v2.0
// Visual quote generation with HTML and PDF export

import pricingEngine from './pricingEngine.js';

// Quote Generator Class
class QuoteGenerator {
    constructor() {
        this.brandColors = {
            primary: '#6366f1',      // Purple
            secondary: '#8b5cf6',    // Violet
            accent: '#a855f7',       // Light purple
            success: '#10b981',      // Green
            warning: '#f59e0b',      // Amber
            dark: '#1f2937',         // Dark gray
            light: '#f3f4f6',        // Light gray
            white: '#ffffff'
        };
        this.companyInfo = {
            name: 'Print Genie',
            tagline: 'Digital Craftsmanship & Automation',
            phone: '+91 XXXXX XXXXX',
            email: 'orders@printgenie.in',
            website: 'printgenie.in',
            address: 'Your City, India'
        };
    }

    // Generate unique quote ID
    generateQuoteId() {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `PG-Q${dateStr}-${random}`;
    }

    // Format currency
    formatCurrency(amount) {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Generate HTML quote
    generateHTMLQuote(calculationResult, options = {}) {
        const {
            customerName = 'Valued Customer',
            customerEmail = '',
            customerPhone = '',
            itemName = 'Custom 3D Print',
            itemDescription = '',
            notes = '',
            showCostBreakdown = calculationResult.params.isWholesale,
            validityDays = 7
        } = options;

        const quoteId = this.generateQuoteId();
        const quoteDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const validUntil = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        const r = calculationResult;

        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote ${quoteId} - Print Genie</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6; color: #1f2937; line-height: 1.6; }
        .quote-container { max-width: 800px; margin: 20px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }

        /* Header */
        .quote-header { background: linear-gradient(135deg, ${this.brandColors.primary} 0%, ${this.brandColors.secondary} 100%); color: white; padding: 30px; }
        .header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .brand { }
        .brand-name { font-size: 2rem; font-weight: bold; }
        .brand-tagline { opacity: 0.9; font-size: 0.9rem; }
        .quote-info { text-align: right; }
        .quote-id { font-size: 1.1rem; font-weight: 600; }
        .quote-date { opacity: 0.9; font-size: 0.9rem; }
        .quote-type { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; margin-top: 8px; font-size: 0.85rem; }

        /* Body */
        .quote-body { padding: 30px; }

        /* Customer Info */
        .customer-section { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
        .customer-info, .item-info { flex: 1; min-width: 250px; }
        .section-title { font-size: 0.85rem; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; font-weight: 600; }
        .customer-name { font-size: 1.2rem; font-weight: 600; color: #1f2937; }
        .customer-detail { color: #6b7280; font-size: 0.95rem; }
        .item-name { font-size: 1.2rem; font-weight: 600; color: ${this.brandColors.primary}; }
        .item-detail { color: #6b7280; font-size: 0.95rem; }

        /* Specifications */
        .specs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .spec-card { background: #f9fafb; padding: 15px; border-radius: 10px; text-align: center; }
        .spec-label { font-size: 0.8rem; color: #6b7280; margin-bottom: 4px; }
        .spec-value { font-size: 1.1rem; font-weight: 600; color: #1f2937; }

        /* Cost Breakdown */
        .cost-breakdown { background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
        .cost-breakdown h3 { font-size: 1rem; color: #374151; margin-bottom: 15px; }
        .cost-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e5e7eb; }
        .cost-row:last-child { border-bottom: none; }
        .cost-label { color: #6b7280; }
        .cost-value { font-weight: 500; color: #1f2937; }
        .cost-row.total { border-top: 2px solid #d1d5db; border-bottom: none; padding-top: 12px; margin-top: 8px; }
        .cost-row.total .cost-label, .cost-row.total .cost-value { font-weight: 700; color: #1f2937; }

        /* Pricing Summary */
        .pricing-summary { margin-bottom: 25px; }
        .pricing-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .pricing-row:last-child { border-bottom: none; }
        .pricing-label { color: #4b5563; }
        .pricing-value { font-weight: 600; color: #1f2937; }
        .pricing-row.discount { background: #ecfdf5; margin: 0 -30px; padding: 12px 30px; }
        .pricing-row.discount .pricing-value { color: ${this.brandColors.success}; }
        .pricing-row.final { background: linear-gradient(135deg, ${this.brandColors.primary} 0%, ${this.brandColors.secondary} 100%); margin: 15px -30px -30px; padding: 20px 30px; border-radius: 0 0 16px 16px; }
        .pricing-row.final .pricing-label { color: rgba(255,255,255,0.9); font-weight: 600; }
        .pricing-row.final .pricing-value { color: white; font-size: 1.5rem; }

        /* Volume Discounts Table */
        .volume-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .volume-table th { background: ${this.brandColors.primary}; color: white; padding: 12px; text-align: left; font-weight: 600; }
        .volume-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .volume-table tr:nth-child(even) { background: #f9fafb; }
        .volume-table tr.current { background: #ecfdf5; }
        .volume-table tr.current td { font-weight: 600; }

        /* Terms */
        .terms-section { background: #f9fafb; padding: 20px; border-radius: 12px; margin-top: 25px; }
        .terms-section h4 { font-size: 0.9rem; color: #374151; margin-bottom: 12px; }
        .terms-list { list-style: none; }
        .terms-list li { padding: 6px 0; color: #6b7280; font-size: 0.9rem; padding-left: 20px; position: relative; }
        .terms-list li:before { content: "•"; position: absolute; left: 0; color: ${this.brandColors.primary}; }

        /* Footer */
        .quote-footer { background: #1f2937; color: white; padding: 25px 30px; text-align: center; }
        .footer-brand { font-size: 1.2rem; font-weight: bold; margin-bottom: 5px; }
        .footer-contact { opacity: 0.8; font-size: 0.9rem; }
        .footer-note { margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.8rem; opacity: 0.7; }

        /* Print Styles */
        @media print {
            body { background: white; }
            .quote-container { box-shadow: none; margin: 0; max-width: none; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="quote-container">
        <!-- Header -->
        <div class="quote-header">
            <div class="header-content">
                <div class="brand">
                    <div class="brand-name">${this.companyInfo.name}</div>
                    <div class="brand-tagline">${this.companyInfo.tagline}</div>
                </div>
                <div class="quote-info">
                    <div class="quote-id">Quote #${quoteId}</div>
                    <div class="quote-date">${quoteDate}</div>
                    <div class="quote-type">${r.meta.pricingMode} Pricing</div>
                </div>
            </div>
        </div>

        <!-- Body -->
        <div class="quote-body">
            <!-- Customer & Item Info -->
            <div class="customer-section">
                <div class="customer-info">
                    <div class="section-title">Prepared For</div>
                    <div class="customer-name">${customerName}</div>
                    ${customerEmail ? `<div class="customer-detail">${customerEmail}</div>` : ''}
                    ${customerPhone ? `<div class="customer-detail">${customerPhone}</div>` : ''}
                </div>
                <div class="item-info">
                    <div class="section-title">Item Details</div>
                    <div class="item-name">${itemName}</div>
                    ${itemDescription ? `<div class="item-detail">${itemDescription}</div>` : ''}
                </div>
            </div>

            <!-- Specifications -->
            <div class="specs-grid">
                <div class="spec-card">
                    <div class="spec-label">Material</div>
                    <div class="spec-value">${r.params.materialName}</div>
                </div>
                <div class="spec-card">
                    <div class="spec-label">Weight</div>
                    <div class="spec-value">${r.params.weightGrams}g</div>
                </div>
                <div class="spec-card">
                    <div class="spec-label">Print Time</div>
                    <div class="spec-value">${r.params.printTimeHours} hrs</div>
                </div>
                <div class="spec-card">
                    <div class="spec-label">Complexity</div>
                    <div class="spec-value">${r.params.complexityLabel}</div>
                </div>
                <div class="spec-card">
                    <div class="spec-label">Quantity</div>
                    <div class="spec-value">${r.params.quantity} units</div>
                </div>
                <div class="spec-card">
                    <div class="spec-label">Delivery</div>
                    <div class="spec-value">${r.params.rushLabel}</div>
                </div>
            </div>`;

        // Cost Breakdown (wholesale only)
        if (showCostBreakdown) {
            html += `
            <!-- Cost Breakdown -->
            <div class="cost-breakdown">
                <h3>Cost Breakdown (Per Unit)</h3>
                <div class="cost-row">
                    <span class="cost-label">Material Cost</span>
                    <span class="cost-value">${this.formatCurrency(r.costs.material)}</span>
                </div>
                <div class="cost-row">
                    <span class="cost-label">Electricity Cost</span>
                    <span class="cost-value">${this.formatCurrency(r.costs.electricity)}</span>
                </div>
                <div class="cost-row">
                    <span class="cost-label">Machine Costs</span>
                    <span class="cost-value">${this.formatCurrency(r.costs.depreciation + r.costs.maintenance)}</span>
                </div>
                <div class="cost-row">
                    <span class="cost-label">Labor & Processing</span>
                    <span class="cost-value">${this.formatCurrency(r.costs.labor + r.costs.postProcessing)}</span>
                </div>
                <div class="cost-row">
                    <span class="cost-label">Buffer (${(pricingEngine.config.machine.failureBuffer * 100).toFixed(0)}%)</span>
                    <span class="cost-value">${this.formatCurrency(r.costs.failureBuffer)}</span>
                </div>
                <div class="cost-row total">
                    <span class="cost-label">Total Production Cost</span>
                    <span class="cost-value">${this.formatCurrency(r.costs.totalCost)}</span>
                </div>
            </div>`;
        }

        // Pricing Summary
        html += `
            <!-- Pricing Summary -->
            <div class="pricing-summary">
                <div class="pricing-row">
                    <span class="pricing-label">Unit Price</span>
                    <span class="pricing-value">${this.formatCurrency(r.pricing.unitPrice)}</span>
                </div>
                <div class="pricing-row">
                    <span class="pricing-label">Quantity</span>
                    <span class="pricing-value">× ${r.pricing.quantity}</span>
                </div>
                <div class="pricing-row">
                    <span class="pricing-label">Subtotal</span>
                    <span class="pricing-value">${this.formatCurrency(r.pricing.subtotal)}</span>
                </div>`;

        if (r.pricing.volumeDiscount.percent > 0) {
            html += `
                <div class="pricing-row discount">
                    <span class="pricing-label">Volume Discount (${r.pricing.volumeDiscount.percent}%)</span>
                    <span class="pricing-value">-${this.formatCurrency(r.pricing.totalDiscount)}</span>
                </div>`;
        }

        if (r.pricing.rushPremium.percent > 0) {
            html += `
                <div class="pricing-row">
                    <span class="pricing-label">${r.pricing.rushPremium.label}</span>
                    <span class="pricing-value">+${this.formatCurrency(r.pricing.totalRushPremium)}</span>
                </div>`;
        }

        html += `
                <div class="pricing-row final">
                    <span class="pricing-label">Total Amount</span>
                    <span class="pricing-value">${this.formatCurrency(r.pricing.finalTotal)}</span>
                </div>
            </div>`;

        // Volume Discount Table (wholesale)
        if (r.params.isWholesale && r.params.quantity >= 3) {
            const volumeTiers = pricingEngine.getVolumeTiers();
            html += `
            <h4 style="margin: 25px 0 15px; color: #374151;">Volume Pricing Tiers</h4>
            <table class="volume-table">
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>Unit Price</th>
                    </tr>
                </thead>
                <tbody>`;

            volumeTiers.forEach(tier => {
                const isCurrent = r.params.quantity >= tier.minQty && r.params.quantity <= tier.maxQty;
                const tierResult = pricingEngine.calculateCosts({
                    ...r.params,
                    quantity: tier.minQty
                });
                html += `
                    <tr class="${isCurrent ? 'current' : ''}">
                        <td>${tier.label}</td>
                        <td>${tier.discount}% off</td>
                        <td>${this.formatCurrency(tierResult.pricing.unitPrice)}${isCurrent ? ' (Current)' : ''}</td>
                    </tr>`;
            });

            html += `
                </tbody>
            </table>`;
        }

        // Terms
        html += `
            <!-- Terms -->
            <div class="terms-section">
                <h4>Terms & Conditions</h4>
                <ul class="terms-list">
                    <li>Quote valid until ${validUntil}</li>
                    <li>50% advance payment required to confirm order</li>
                    <li>Balance due upon completion, before delivery</li>
                    <li>Delivery time: ${r.params.rushLabel}</li>
                    <li>Minor color variations may occur between batches</li>
                    <li>Cancellation after production starts: 50% charge</li>
                </ul>
                ${notes ? `<p style="margin-top: 15px; font-style: italic; color: #6b7280;">Note: ${notes}</p>` : ''}
            </div>
        </div>

        <!-- Footer -->
        <div class="quote-footer">
            <div class="footer-brand">${this.companyInfo.name}</div>
            <div class="footer-contact">
                ${this.companyInfo.phone} | ${this.companyInfo.email} | ${this.companyInfo.website}
            </div>
            <div class="footer-note">
                Thank you for choosing Print Genie! We look forward to bringing your ideas to life.
            </div>
        </div>
    </div>
</body>
</html>`;

        return {
            html,
            quoteId,
            quoteDate,
            validUntil
        };
    }

    // Generate PDF from calculation result
    async generatePDF(calculationResult, options = {}) {
        // Check if jsPDF is available
        if (typeof window === 'undefined' || !window.jspdf) {
            console.error('jsPDF not loaded');
            return null;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const quoteId = this.generateQuoteId();
        const r = calculationResult;
        const {
            customerName = 'Valued Customer',
            itemName = 'Custom 3D Print',
            showCostBreakdown = r.params.isWholesale
        } = options;

        let y = 20;

        // Helper functions
        const addText = (text, x, size = 10, color = [0, 0, 0], style = 'normal') => {
            doc.setFontSize(size);
            doc.setTextColor(...color);
            doc.setFont('helvetica', style);
            doc.text(text, x, y);
        };

        const addLine = () => {
            doc.setDrawColor(229, 231, 235);
            doc.line(20, y, 190, y);
            y += 5;
        };

        // Header with gradient simulation
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 0, 210, 45, 'F');

        // Brand name
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(this.companyInfo.name, 20, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(this.companyInfo.tagline, 20, 33);

        // Quote info (right side)
        doc.setFontSize(11);
        doc.text(`Quote #${quoteId}`, 190, 20, { align: 'right' });
        doc.setFontSize(9);
        doc.text(new Date().toLocaleDateString('en-IN'), 190, 27, { align: 'right' });

        // Pricing mode badge
        doc.setFillColor(255, 255, 255, 50);
        doc.roundedRect(150, 30, 40, 8, 2, 2, 'F');
        doc.setFontSize(8);
        doc.text(r.meta.pricingMode, 170, 35, { align: 'center' });

        y = 55;

        // Customer & Item
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.text('PREPARED FOR', 20, y);
        doc.text('ITEM', 110, y);

        y += 8;
        doc.setTextColor(31, 41, 55);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(customerName, 20, y);
        doc.setTextColor(99, 102, 241);
        doc.text(itemName, 110, y);

        y += 15;
        addLine();

        // Specifications
        y += 5;
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);

        const specs = [
            ['Material', r.params.materialName],
            ['Weight', `${r.params.weightGrams}g`],
            ['Print Time', `${r.params.printTimeHours} hrs`],
            ['Complexity', r.params.complexityLabel],
            ['Quantity', `${r.params.quantity} units`],
            ['Delivery', r.params.rushLabel]
        ];

        let specX = 20;
        specs.forEach(([label, value], i) => {
            doc.setTextColor(107, 114, 128);
            doc.setFontSize(8);
            doc.text(label, specX, y);
            doc.setTextColor(31, 41, 55);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(value, specX, y + 6);
            doc.setFont('helvetica', 'normal');
            specX += 30;
            if (i === 2) {
                specX = 20;
                y += 18;
            }
        });

        y += 25;
        addLine();

        // Cost Breakdown (wholesale only)
        if (showCostBreakdown) {
            y += 5;
            doc.setFillColor(249, 250, 251);
            doc.roundedRect(20, y - 5, 170, 60, 3, 3, 'F');

            doc.setFontSize(10);
            doc.setTextColor(55, 65, 81);
            doc.setFont('helvetica', 'bold');
            doc.text('Cost Breakdown (Per Unit)', 25, y + 3);
            doc.setFont('helvetica', 'normal');

            y += 12;
            const costs = [
                ['Material Cost', this.formatCurrency(r.costs.material)],
                ['Electricity Cost', this.formatCurrency(r.costs.electricity)],
                ['Machine Costs', this.formatCurrency(r.costs.depreciation + r.costs.maintenance)],
                ['Labor & Processing', this.formatCurrency(r.costs.labor + r.costs.postProcessing)],
                ['Total Production Cost', this.formatCurrency(r.costs.totalCost)]
            ];

            costs.forEach(([label, value], i) => {
                doc.setFontSize(9);
                doc.setTextColor(107, 114, 128);
                doc.text(label, 25, y);
                doc.setTextColor(31, 41, 55);
                doc.text(value, 180, y, { align: 'right' });
                y += 8;
                if (i === 3) {
                    doc.setDrawColor(209, 213, 219);
                    doc.line(25, y - 3, 185, y - 3);
                    doc.setFont('helvetica', 'bold');
                }
            });
            doc.setFont('helvetica', 'normal');

            y += 10;
        }

        // Pricing Summary
        y += 5;
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);

        const pricing = [
            ['Unit Price', this.formatCurrency(r.pricing.unitPrice)],
            ['Quantity', `× ${r.pricing.quantity}`],
            ['Subtotal', this.formatCurrency(r.pricing.subtotal)]
        ];

        pricing.forEach(([label, value]) => {
            doc.setTextColor(75, 85, 99);
            doc.text(label, 20, y);
            doc.setTextColor(31, 41, 55);
            doc.setFont('helvetica', 'bold');
            doc.text(value, 190, y, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            y += 10;
        });

        // Volume Discount
        if (r.pricing.volumeDiscount.percent > 0) {
            doc.setFillColor(236, 253, 245);
            doc.rect(15, y - 6, 180, 12, 'F');
            doc.setTextColor(16, 185, 129);
            doc.text(`Volume Discount (${r.pricing.volumeDiscount.percent}%)`, 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`-${this.formatCurrency(r.pricing.totalDiscount)}`, 190, y, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            y += 12;
        }

        // Final Total
        y += 5;
        doc.setFillColor(99, 102, 241);
        doc.roundedRect(15, y - 8, 180, 20, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL AMOUNT', 20, y + 2);
        doc.setFontSize(16);
        doc.text(this.formatCurrency(r.pricing.finalTotal), 190, y + 3, { align: 'right' });

        y += 25;

        // Terms
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, y, 180, 45, 3, 3, 'F');

        y += 8;
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'bold');
        doc.text('Terms & Conditions', 20, y);
        doc.setFont('helvetica', 'normal');

        y += 8;
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        const terms = [
            `• Quote valid for 7 days`,
            `• 50% advance payment required`,
            `• Delivery: ${r.params.rushLabel}`,
            `• Balance due before delivery`
        ];
        terms.forEach(term => {
            doc.text(term, 20, y);
            y += 6;
        });

        // Footer
        y = 275;
        doc.setFillColor(31, 41, 55);
        doc.rect(0, y - 5, 210, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(this.companyInfo.name, 105, y + 3, { align: 'center' });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${this.companyInfo.phone} | ${this.companyInfo.email} | ${this.companyInfo.website}`, 105, y + 10, { align: 'center' });

        doc.setFontSize(7);
        doc.setTextColor(200, 200, 200);
        doc.text('Thank you for choosing Print Genie!', 105, y + 17, { align: 'center' });

        return {
            pdf: doc,
            quoteId,
            filename: `PrintGenie-Quote-${quoteId}.pdf`,
            download: () => doc.save(`PrintGenie-Quote-${quoteId}.pdf`)
        };
    }

    // Generate WhatsApp message
    generateWhatsAppMessage(calculationResult, options = {}) {
        const {
            itemName = 'Custom 3D Print',
            customerName = ''
        } = options;

        const r = calculationResult;
        const quoteId = this.generateQuoteId();

        let msg = `*${this.companyInfo.name} Quote*\n`;
        msg += `Quote ID: ${quoteId}\n`;
        msg += `━━━━━━━━━━━━━━━━\n\n`;

        if (customerName) {
            msg += `Dear ${customerName},\n\n`;
        }

        msg += `*${itemName}*\n\n`;
        msg += `📦 Material: ${r.params.materialName}\n`;
        msg += `⚖️ Weight: ${r.params.weightGrams}g\n`;
        msg += `⏱️ Print Time: ${r.params.printTimeHours} hrs\n`;
        msg += `🔧 Complexity: ${r.params.complexityLabel}\n`;
        msg += `📊 Quantity: ${r.params.quantity} units\n`;
        msg += `🚚 Delivery: ${r.params.rushLabel}\n\n`;

        msg += `━━━━━━━━━━━━━━━━\n`;
        msg += `*${r.meta.pricingMode} Pricing*\n\n`;
        msg += `Unit Price: ${this.formatCurrency(r.pricing.unitPrice)}\n`;

        if (r.pricing.volumeDiscount.percent > 0) {
            msg += `Volume Discount: ${r.pricing.volumeDiscount.percent}% off\n`;
        }

        msg += `\n*TOTAL: ${this.formatCurrency(r.pricing.finalTotal)}*\n\n`;
        msg += `━━━━━━━━━━━━━━━━\n`;
        msg += `✓ Quote valid for 7 days\n`;
        msg += `✓ 50% advance to confirm\n\n`;
        msg += `Contact us to place your order!\n`;
        msg += `📞 ${this.companyInfo.phone}\n`;
        msg += `🌐 ${this.companyInfo.website}`;

        return {
            message: msg,
            quoteId,
            shareUrl: `https://wa.me/?text=${encodeURIComponent(msg)}`
        };
    }

    // Generate email content
    generateEmailContent(calculationResult, options = {}) {
        const {
            itemName = 'Custom 3D Print',
            customerName = 'Valued Customer'
        } = options;

        const r = calculationResult;
        const quoteId = this.generateQuoteId();

        const subject = `${this.companyInfo.name} Quote #${quoteId} - ${itemName}`;

        let body = `${this.companyInfo.name} - Price Quote\n\n`;
        body += `Quote ID: ${quoteId}\n`;
        body += `Date: ${new Date().toLocaleDateString('en-IN')}\n`;
        body += `Customer: ${customerName}\n\n`;

        body += `=== Item Details ===\n`;
        body += `Item: ${itemName}\n`;
        body += `Material: ${r.params.materialName}\n`;
        body += `Weight: ${r.params.weightGrams}g\n`;
        body += `Print Time: ${r.params.printTimeHours} hours\n`;
        body += `Complexity: ${r.params.complexityLabel}\n`;
        body += `Quantity: ${r.params.quantity} units\n`;
        body += `Delivery: ${r.params.rushLabel}\n\n`;

        body += `=== Pricing (${r.meta.pricingMode}) ===\n`;
        body += `Unit Price: ${this.formatCurrency(r.pricing.unitPrice)}\n`;
        body += `Subtotal: ${this.formatCurrency(r.pricing.subtotal)}\n`;

        if (r.pricing.volumeDiscount.percent > 0) {
            body += `Volume Discount (${r.pricing.volumeDiscount.percent}%): -${this.formatCurrency(r.pricing.totalDiscount)}\n`;
        }

        body += `\nTOTAL: ${this.formatCurrency(r.pricing.finalTotal)}\n\n`;

        body += `=== Terms ===\n`;
        body += `- Quote valid for 7 days\n`;
        body += `- 50% advance payment required\n`;
        body += `- Balance due before delivery\n\n`;

        body += `Contact us to proceed:\n`;
        body += `Phone: ${this.companyInfo.phone}\n`;
        body += `Email: ${this.companyInfo.email}\n`;
        body += `Website: ${this.companyInfo.website}\n\n`;

        body += `Thank you for choosing ${this.companyInfo.name}!`;

        return {
            subject,
            body,
            quoteId,
            mailtoLink: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        };
    }

    // Update company info
    updateCompanyInfo(info) {
        this.companyInfo = { ...this.companyInfo, ...info };
    }
}

// Create singleton instance
const quoteGenerator = new QuoteGenerator();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuoteGenerator, quoteGenerator };
}

// Export for ES6 modules
export { QuoteGenerator, quoteGenerator };
export default quoteGenerator;
