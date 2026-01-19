# Print Genie - Complete Implementation Prompt (HYBRID + Bulk/Retail Pricing Edition)

## Project Context

I need you to implement advanced features for my existing Print Genie 3D printing catalog web application with a **HYBRID flexible pricing system**, **Bulk/Retail pricing tiers**, and **comprehensive quote export options**:

1. **Analytics Dashboard** - Business metrics and insights
2. **Customer Quote Generator** - Public-facing quote request system
3. **Batch Calculator** - Calculate costs for multiple items at once
4. **Flexible Cost Management** - Modifiable pricing with multiple calculation methods
5. **Bulk & Retail Pricing** - Separate pricing for individual vs wholesale customers
6. **Quote Export System** - Export quotes as PDF, WhatsApp, Email, CSV

**Repository:** https://github.com/arunsaispk12/print-genie-catalog

## Current Tech Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript (NO frameworks)
- **Data Storage:** Browser localStorage
- **Deployment:** GitHub Pages (static site)
- **Structure:**
  - `public/index.html` - Main application interface
  - `src/app.js` - Application logic
  - `src/data/catalogData.js` - Category, material, color data
  - `public/styles.css` - Styling

---

# 💰 CRITICAL: HYBRID Flexible Pricing System with Bulk/Retail Tiers

## Overview

The pricing system supports:
1. **Three calculation methods** (Flat/Hourly/Market-based)
2. **Two customer types** (Retail/Bulk-Wholesale)
3. **Multiple export formats** (PDF/WhatsApp/Email/CSV)

---

# 🏷️ FEATURE: BULK & RETAIL PRICING

## Customer Type Selection

Add toggle in calculator to switch between pricing modes:

```javascript
const pricingModes = {
  retail: {
    name: "Retail Pricing",
    description: "Individual customers, standard margins",
    minOrderQty: 1,
    profitMargins: {
      tier1: 35,  // Small items
      tier2: 30,  // Medium items
      tier3: 25,  // Large items
      tier4: 25   // Complex items
    },
    laborMultiplier: 1.0,  // Standard labor cost
    display: {
      showCostBreakdown: false,  // Don't show costs to retail customers
      priceLabel: "Price",
      customerType: "Retail Customer"
    }
  },
  
  bulk: {
    name: "Bulk/Wholesale Pricing",
    description: "Business customers, volume discounts",
    minOrderQty: 10,  // Minimum 10 items for bulk pricing
    profitMargins: {
      tier1: 20,  // Lower margins
      tier2: 18,
      tier3: 15,
      tier4: 15
    },
    laborMultiplier: 0.8,  // 20% labor discount for bulk
    volumeDiscounts: {
      qty10to24: 0,     // No additional discount (already in margin)
      qty25to49: 5,     // 5% off for 25-49 items
      qty50to99: 10,    // 10% off for 50-99 items
      qty100plus: 15    // 15% off for 100+ items
    },
    display: {
      showCostBreakdown: true,  // Show transparency to B2B customers
      priceLabel: "Wholesale Price",
      customerType: "Bulk/Wholesale Customer"
    }
  }
};
```

## UI Implementation

### Pricing Mode Toggle in Calculator

```html
<div class="pricing-mode-selector">
  <h3>Customer Type</h3>
  <div class="mode-toggle-buttons">
    <button class="mode-toggle-btn active" onclick="setPricingMode('retail')" data-mode="retail">
      <div class="mode-icon">🛒</div>
      <div class="mode-info">
        <strong>Retail</strong>
        <small>Individual customers</small>
      </div>
    </button>
    
    <button class="mode-toggle-btn" onclick="setPricingMode('bulk')" data-mode="bulk">
      <div class="mode-icon">📦</div>
      <div class="mode-info">
        <strong>Bulk/Wholesale</strong>
        <small>10+ items, business clients</small>
      </div>
    </button>
  </div>
  
  <div class="mode-details" id="current-mode-details">
    <div class="detail-item">
      <span class="label">Profit Margin:</span>
      <span class="value" id="mode-margin">25-35%</span>
    </div>
    <div class="detail-item">
      <span class="label">Min Order Qty:</span>
      <span class="value" id="mode-min-qty">1</span>
    </div>
    <div class="detail-item">
      <span class="label">Volume Discounts:</span>
      <span class="value" id="mode-discounts">Not applicable</span>
    </div>
  </div>
</div>
```

### Volume Discount Calculator (Bulk Mode)

```html
<!-- Shown only in Bulk mode -->
<div class="volume-discount-info" id="bulk-discount-calculator" style="display: none;">
  <h4>Volume Discount Tiers</h4>
  <div class="discount-tiers">
    <div class="discount-tier">
      <span class="tier-qty">10-24 items</span>
      <span class="tier-discount">Standard wholesale price</span>
    </div>
    <div class="discount-tier">
      <span class="tier-qty">25-49 items</span>
      <span class="tier-discount">5% additional discount</span>
    </div>
    <div class="discount-tier">
      <span class="tier-qty">50-99 items</span>
      <span class="tier-discount">10% additional discount</span>
    </div>
    <div class="discount-tier active">
      <span class="tier-qty">100+ items</span>
      <span class="tier-discount">15% additional discount</span>
    </div>
  </div>
  
  <div class="current-volume-discount" id="active-discount">
    <strong>Your Order:</strong> 
    <span id="order-qty">0</span> items → 
    <span id="discount-percentage">0%</span> discount → 
    Save <span id="discount-amount">₹0</span>
  </div>
</div>
```

## Pricing Calculation Logic with Bulk/Retail

```javascript
function calculatePriceWithMode(costs, tier, quantity, pricingMode) {
  const mode = pricingModes[pricingMode];
  
  // Check minimum order quantity
  if (quantity < mode.minOrderQty) {
    return {
      error: true,
      message: `${mode.name} requires minimum ${mode.minOrderQty} items. Current: ${quantity}`,
      suggestedMode: 'retail'
    };
  }
  
  // Calculate base cost with labor multiplier
  const laborCost = costs.labor * mode.laborMultiplier;
  const totalCost = costs.material + costs.electricity + 
                    costs.depreciation + costs.maintenance + laborCost;
  
  // Apply profit margin for this mode
  const profitMargin = mode.profitMargins[tier];
  const profitAmount = totalCost * (profitMargin / 100);
  const basePrice = totalCost + profitAmount;
  
  // Apply volume discounts (bulk mode only)
  let volumeDiscount = 0;
  let discountPercentage = 0;
  
  if (pricingMode === 'bulk' && mode.volumeDiscounts) {
    if (quantity >= 100) {
      discountPercentage = mode.volumeDiscounts.qty100plus;
    } else if (quantity >= 50) {
      discountPercentage = mode.volumeDiscounts.qty50to99;
    } else if (quantity >= 25) {
      discountPercentage = mode.volumeDiscounts.qty25to49;
    }
    
    volumeDiscount = basePrice * quantity * (discountPercentage / 100);
  }
  
  const finalUnitPrice = Math.ceil(basePrice / 10) * 10; // Round to ₹10
  const subtotal = finalUnitPrice * quantity;
  const finalTotal = subtotal - volumeDiscount;
  
  return {
    error: false,
    mode: pricingMode,
    modeName: mode.name,
    
    // Cost breakdown
    costs: {
      material: costs.material,
      operating: costs.electricity + costs.depreciation + costs.maintenance,
      labor: laborCost,
      total: totalCost
    },
    
    // Pricing
    profitMargin: profitMargin,
    profitAmount: profitAmount,
    basePrice: basePrice,
    
    // Volume discount
    quantity: quantity,
    discountPercentage: discountPercentage,
    discountAmount: volumeDiscount,
    
    // Finals
    unitPrice: finalUnitPrice,
    subtotal: subtotal,
    finalTotal: finalTotal,
    
    // Display
    showCostBreakdown: mode.display.showCostBreakdown,
    priceLabel: mode.display.priceLabel,
    customerType: mode.display.customerType
  };
}
```

## Display Price Breakdown

```html
<div class="price-result-card">
  <!-- Header shows customer type -->
  <div class="result-header">
    <span class="customer-type-badge" id="customer-type-display">Retail Customer</span>
    <span class="mode-badge" id="pricing-mode-display">Standard Pricing</span>
  </div>
  
  <!-- Cost breakdown (shown only for bulk customers) -->
  <div class="cost-breakdown" id="cost-breakdown-section" style="display: none;">
    <h4>Cost Breakdown (Transparent Pricing)</h4>
    <div class="breakdown-line">
      <span>Material Cost:</span>
      <span id="breakdown-material">₹35</span>
    </div>
    <div class="breakdown-line">
      <span>Operating Costs:</span>
      <span id="breakdown-operating">₹113</span>
    </div>
    <div class="breakdown-line">
      <span>Labor Cost:</span>
      <span id="breakdown-labor">₹60</span>
      <small>(20% bulk discount applied)</small>
    </div>
    <div class="breakdown-line total">
      <span>Total Cost:</span>
      <span id="breakdown-total-cost">₹208</span>
    </div>
    <div class="breakdown-line profit">
      <span>Our Margin (20%):</span>
      <span id="breakdown-profit">₹42</span>
    </div>
  </div>
  
  <!-- Pricing display -->
  <div class="pricing-display">
    <div class="price-line">
      <span id="price-label">Unit Price:</span>
      <span class="price-value" id="unit-price">₹250</span>
    </div>
    
    <div class="price-line quantity">
      <span>Quantity:</span>
      <span id="display-quantity">50 items</span>
    </div>
    
    <div class="price-line subtotal">
      <span>Subtotal:</span>
      <span id="display-subtotal">₹12,500</span>
    </div>
    
    <!-- Volume discount (bulk only) -->
    <div class="price-line discount" id="volume-discount-line" style="display: none;">
      <span>Volume Discount (10%):</span>
      <span class="discount-amount">-₹1,250</span>
    </div>
    
    <!-- Final total -->
    <div class="price-line final-total">
      <span><strong>Final Total:</strong></span>
      <span class="final-price" id="final-total-price">₹11,250</span>
    </div>
    
    <!-- Savings message (bulk only) -->
    <div class="savings-message" id="savings-display" style="display: none;">
      <span class="savings-icon">🎉</span>
      <span>You save ₹1,250 with bulk pricing!</span>
    </div>
  </div>
  
  <!-- Comparison (bulk mode shows retail vs bulk) -->
  <div class="price-comparison" id="bulk-vs-retail" style="display: none;">
    <h5>💡 Bulk Savings Comparison</h5>
    <table class="comparison-table">
      <tr>
        <th></th>
        <th>Retail Price</th>
        <th>Your Bulk Price</th>
      </tr>
      <tr>
        <td>Unit Price</td>
        <td id="retail-unit-price">₹400</td>
        <td class="highlight" id="bulk-unit-price">₹250</td>
      </tr>
      <tr>
        <td>50 Items Total</td>
        <td id="retail-total">₹20,000</td>
        <td class="highlight" id="bulk-total">₹11,250</td>
      </tr>
      <tr class="savings-row">
        <td><strong>Your Savings</strong></td>
        <td colspan="2" class="savings-highlight">₹8,750 (44% off retail)</td>
      </tr>
    </table>
  </div>
</div>
```

## Minimum Order Quantity Warning

```javascript
function validateBulkOrder(quantity, pricingMode) {
  if (pricingMode === 'bulk' && quantity < 10) {
    showWarningMessage(`
      <div class="min-qty-warning">
        <span class="warning-icon">⚠️</span>
        <div class="warning-content">
          <strong>Minimum Order for Bulk Pricing</strong>
          <p>Bulk/wholesale pricing requires a minimum of 10 items.</p>
          <p>Current quantity: ${quantity}</p>
          <button onclick="setPricingMode('retail')">Switch to Retail Pricing</button>
          <button onclick="increaseQuantityTo(10)">Increase to 10 items</button>
        </div>
      </div>
    `);
    return false;
  }
  return true;
}
```

---

# 📤 FEATURE: QUOTE EXPORT SYSTEM

## Export Format Options

```javascript
const exportFormats = {
  pdf: {
    name: "PDF Quote",
    description: "Professional PDF document",
    icon: "📄",
    features: ["Branding", "Detailed breakdown", "Terms & conditions", "Signature field"]
  },
  
  whatsapp: {
    name: "WhatsApp Message",
    description: "Formatted text for WhatsApp",
    icon: "💬",
    features: ["Copy to clipboard", "Direct share", "Emoji formatting", "Concise"]
  },
  
  email: {
    name: "Email Template",
    description: "HTML email with formatting",
    icon: "📧",
    features: ["Professional layout", "Inline images", "Call-to-action", "Contact info"]
  },
  
  csv: {
    name: "CSV Data",
    description: "Spreadsheet format for records",
    icon: "📊",
    features: ["Import to Excel", "Data analysis", "Record keeping"]
  },
  
  image: {
    name: "Image Quote",
    description: "Social media ready image",
    icon: "🖼️",
    features: ["Instagram/Facebook ready", "Branded design", "Quick share"]
  }
};
```

## Export UI

```html
<div class="quote-export-section">
  <h3>Export Quote</h3>
  
  <div class="export-format-selector">
    <button class="export-btn" onclick="exportQuote('pdf')">
      <span class="export-icon">📄</span>
      <span class="export-label">PDF Quote</span>
      <small>Professional document</small>
    </button>
    
    <button class="export-btn" onclick="exportQuote('whatsapp')">
      <span class="export-icon">💬</span>
      <span class="export-label">WhatsApp</span>
      <small>Copy & send</small>
    </button>
    
    <button class="export-btn" onclick="exportQuote('email')">
      <span class="export-icon">📧</span>
      <span class="export-label">Email</span>
      <small>HTML template</small>
    </button>
    
    <button class="export-btn" onclick="exportQuote('csv')">
      <span class="export-icon">📊</span>
      <span class="export-label">CSV Data</span>
      <small>For records</small>
    </button>
    
    <button class="export-btn" onclick="exportQuote('image')">
      <span class="export-icon">🖼️</span>
      <span class="export-label">Image</span>
      <small>Social media</small>
    </button>
  </div>
  
  <!-- Quick settings for export -->
  <div class="export-settings">
    <h4>Quote Settings</h4>
    <label>
      <input type="checkbox" id="include-branding" checked>
      Include Print Genie branding
    </label>
    <label>
      <input type="checkbox" id="include-cost-breakdown">
      Show cost breakdown (Bulk customers only)
    </label>
    <label>
      <input type="checkbox" id="include-terms" checked>
      Include terms & conditions
    </label>
    <label>
      <input type="checkbox" id="include-payment-info" checked>
      Include payment information
    </label>
  </div>
</div>
```

## PDF Export Implementation

```javascript
function exportQuotePDF(quoteData) {
  // Using jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Settings
  const includeBreakdown = document.getElementById('include-cost-breakdown').checked;
  const includeTerms = document.getElementById('include-terms').checked;
  const includePayment = document.getElementById('include-payment-info').checked;
  
  let yPos = 20;
  
  // Header with branding
  doc.setFontSize(24);
  doc.setTextColor(102, 126, 234); // Purple brand color
  doc.text("🧞 Print Genie", 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Digital Craftsmanship and Automation", 20, yPos);
  doc.text(`Quote Date: ${new Date().toLocaleDateString()}`, 150, yPos);
  
  yPos += 15;
  
  // Quote details box
  doc.setFillColor(248, 249, 250);
  doc.rect(20, yPos, 170, 30, 'F');
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Quote ID: ${quoteData.quoteId}`, 25, yPos);
  
  yPos += 7;
  doc.text(`Customer Type: ${quoteData.customerType}`, 25, yPos);
  
  yPos += 7;
  doc.text(`Valid Until: ${quoteData.validUntil}`, 25, yPos);
  
  yPos += 15;
  
  // Item details
  doc.setFontSize(14);
  doc.setTextColor(102, 126, 234);
  doc.text("Quote Details", 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Table header
  doc.setFillColor(102, 126, 234);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text("Item", 25, yPos + 5);
  doc.text("Qty", 100, yPos + 5);
  doc.text("Unit Price", 120, yPos + 5);
  doc.text("Total", 160, yPos + 5);
  
  yPos += 8;
  doc.setTextColor(0, 0, 0);
  
  // Items
  quoteData.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250);
      doc.rect(20, yPos, 170, 7, 'F');
    }
    
    doc.text(item.name, 25, yPos + 5);
    doc.text(item.quantity.toString(), 100, yPos + 5);
    doc.text(`₹${item.unitPrice}`, 120, yPos + 5);
    doc.text(`₹${item.total}`, 160, yPos + 5);
    
    yPos += 7;
  });
  
  yPos += 5;
  
  // Cost breakdown (if enabled and bulk customer)
  if (includeBreakdown && quoteData.pricingMode === 'bulk') {
    doc.setFontSize(12);
    doc.setTextColor(102, 126, 234);
    doc.text("Cost Breakdown (Transparent Pricing)", 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Material Cost: ₹${quoteData.costs.material}`, 25, yPos);
    yPos += 6;
    doc.text(`Operating Costs: ₹${quoteData.costs.operating}`, 25, yPos);
    yPos += 6;
    doc.text(`Labor Cost: ₹${quoteData.costs.labor}`, 25, yPos);
    yPos += 6;
    doc.text(`Our Margin (${quoteData.profitMargin}%): ₹${quoteData.profitAmount}`, 25, yPos);
    
    yPos += 10;
  }
  
  // Pricing summary
  doc.setFillColor(248, 249, 250);
  doc.rect(20, yPos, 170, 35, 'F');
  
  yPos += 8;
  doc.setFontSize(11);
  doc.text("Subtotal:", 130, yPos);
  doc.text(`₹${quoteData.subtotal}`, 170, yPos, { align: 'right' });
  
  if (quoteData.discountAmount > 0) {
    yPos += 7;
    doc.setTextColor(16, 185, 129); // Green
    doc.text(`Volume Discount (${quoteData.discountPercentage}%):`, 130, yPos);
    doc.text(`-₹${quoteData.discountAmount}`, 170, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  }
  
  yPos += 7;
  doc.setDrawColor(200, 200, 200);
  doc.line(130, yPos, 190, yPos);
  
  yPos += 7;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("Total Amount:", 130, yPos);
  doc.text(`₹${quoteData.finalTotal}`, 170, yPos, { align: 'right' });
  doc.setFont(undefined, 'normal');
  
  yPos += 15;
  
  // Terms & Conditions
  if (includeTerms) {
    doc.setFontSize(12);
    doc.setTextColor(102, 126, 234);
    doc.text("Terms & Conditions", 20, yPos);
    
    yPos += 7;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    const terms = [
      "• Payment: 50% advance, 50% before delivery",
      "• Delivery time: 5-7 business days (standard), 2-3 days (rush)",
      "• Price includes: Material, printing, basic post-processing",
      "• Additional charges apply for: Premium finishes, special materials",
      "• Quote valid for 7 days from date of issue",
      "• Cancellation: Full refund if cancelled before production starts"
    ];
    
    terms.forEach(term => {
      doc.text(term, 20, yPos);
      yPos += 5;
    });
    
    yPos += 5;
  }
  
  // Payment information
  if (includePayment) {
    doc.setFontSize(12);
    doc.setTextColor(102, 126, 234);
    doc.text("Payment Information", 20, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    doc.text("Bank Transfer:", 20, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.text("Account Name: Print Genie", 25, yPos);
    yPos += 5;
    doc.text("Account Number: XXXX-XXXX-XXXX", 25, yPos);
    yPos += 5;
    doc.text("IFSC Code: XXXX0001234", 25, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.text("UPI: printgenie@upi", 20, yPos);
    yPos += 6;
    doc.text("Phone/WhatsApp: +91-XXXXXXXXXX", 20, yPos);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Print Genie | Bashettihalli, Karnataka | printgenie@example.com", 105, 285, { align: 'center' });
  
  // Save PDF
  const filename = `PrintGenie_Quote_${quoteData.quoteId}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  
  return filename;
}
```

## WhatsApp Export Implementation

```javascript
function exportQuoteWhatsApp(quoteData) {
  const message = `
🧞 *PRINT GENIE QUOTE*

📋 *Quote ID:* ${quoteData.quoteId}
📅 *Date:* ${new Date().toLocaleDateString()}
👤 *Customer Type:* ${quoteData.customerType}

━━━━━━━━━━━━━━━━━━━━

📦 *ORDER DETAILS*

${quoteData.items.map((item, i) => `
${i + 1}. ${item.name}
   • Qty: ${item.quantity}
   • Price: ₹${item.unitPrice} each
   • Total: ₹${item.total}
`).join('')}

━━━━━━━━━━━━━━━━━━━━

💰 *PRICING*

Subtotal: ₹${quoteData.subtotal}
${quoteData.discountAmount > 0 ? `🎉 Volume Discount (${quoteData.discountPercentage}%): -₹${quoteData.discountAmount}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
*TOTAL: ₹${quoteData.finalTotal}*

${quoteData.discountAmount > 0 ? `\n💡 You save ₹${quoteData.discountAmount} with bulk pricing!\n` : ''}
━━━━━━━━━━━━━━━━━━━━

⏰ *Delivery:* 5-7 business days
💳 *Payment:* 50% advance, 50% before delivery

📱 *To order, reply to this message or call:*
+91-XXXXXXXXXX

Valid for 7 days | www.printgenie.com
  `.trim();
  
  // Copy to clipboard
  navigator.clipboard.writeText(message).then(() => {
    showSuccessMessage("Quote copied to clipboard! Ready to paste in WhatsApp.");
    
    // Show preview with option to open WhatsApp
    showWhatsAppPreview(message, quoteData.customerPhone);
  });
  
  return message;
}

function showWhatsAppPreview(message, phone) {
  const modal = `
    <div class="export-preview-modal">
      <div class="modal-content">
        <h3>WhatsApp Quote Preview</h3>
        <div class="whatsapp-preview">
          <pre>${message}</pre>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" onclick="openWhatsApp('${phone}', '${encodeURIComponent(message)}')">
            💬 Open in WhatsApp
          </button>
          <button class="btn-secondary" onclick="copyToClipboard('${message}')">
            📋 Copy Again
          </button>
          <button class="btn-secondary" onclick="closeModal()">
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modal);
}

function openWhatsApp(phone, message) {
  // Remove +91 if present, WhatsApp API handles it
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const whatsappURL = `https://wa.me/91${cleanPhone}?text=${message}`;
  window.open(whatsappURL, '_blank');
}
```

## Email Export Implementation

```javascript
function exportQuoteEmail(quoteData) {
  const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 32px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; }
    .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
    .quote-info { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
    .quote-info p { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #667eea; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
    tr:nth-child(even) { background: #f8f9fa; }
    .pricing-summary { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .pricing-line { display: flex; justify-content: space-between; padding: 8px 0; }
    .pricing-line.total { border-top: 2px solid #667eea; font-size: 18px; font-weight: bold; 
                          color: #667eea; margin-top: 10px; padding-top: 10px; }
    .discount { color: #10b981; font-weight: bold; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; 
              font-size: 14px; color: #666; }
    .terms { font-size: 12px; color: #666; padding: 20px; background: #fafafa; 
             border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧞 Print Genie</h1>
      <p>Digital Craftsmanship and Automation</p>
    </div>
    
    <div class="content">
      <h2>Your Quote is Ready!</h2>
      
      <div class="quote-info">
        <p><strong>Quote ID:</strong> ${quoteData.quoteId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Customer Type:</strong> ${quoteData.customerType}</p>
        <p><strong>Valid Until:</strong> ${quoteData.validUntil}</p>
      </div>
      
      <h3>Order Details</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${quoteData.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>₹${item.unitPrice}</td>
              <td>₹${item.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="pricing-summary">
        <div class="pricing-line">
          <span>Subtotal:</span>
          <span>₹${quoteData.subtotal}</span>
        </div>
        ${quoteData.discountAmount > 0 ? `
        <div class="pricing-line discount">
          <span>Volume Discount (${quoteData.discountPercentage}%):</span>
          <span>-₹${quoteData.discountAmount}</span>
        </div>
        ` : ''}
        <div class="pricing-line total">
          <span>Total Amount:</span>
          <span>₹${quoteData.finalTotal}</span>
        </div>
      </div>
      
      ${quoteData.discountAmount > 0 ? `
      <div style="background: #d1fae5; color: #065f46; padding: 15px; border-radius: 6px; 
                  text-align: center; margin: 20px 0;">
        🎉 You save ₹${quoteData.discountAmount} with bulk pricing!
      </div>
      ` : ''}
      
      <div style="text-align: center;">
        <a href="tel:+91XXXXXXXXXX" class="cta-button">
          📞 Call to Confirm Order
        </a>
        <br>
        <a href="https://wa.me/91XXXXXXXXXX" class="cta-button" style="background: #25D366;">
          💬 WhatsApp Us
        </a>
      </div>
      
      <div class="terms">
        <strong>Terms & Conditions:</strong><br>
        • Payment: 50% advance, 50% before delivery<br>
        • Delivery: 5-7 business days (standard)<br>
        • Price includes: Material, printing, basic finishing<br>
        • Quote valid for 7 days from date of issue
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Print Genie</strong></p>
      <p>Bashettihalli, Karnataka</p>
      <p>📧 printgenie@example.com | 📱 +91-XXXXXXXXXX</p>
      <p>www.printgenie.com</p>
    </div>
  </div>
</body>
</html>
  `;
  
  // Create blob and download
  const blob = new Blob([emailHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PrintGenie_Email_Quote_${quoteData.quoteId}.html`;
  a.click();
  
  // Also show preview
  showEmailPreview(emailHTML);
  
  return emailHTML;
}

function showEmailPreview(html) {
  const modal = `
    <div class="export-preview-modal">
      <div class="modal-content large">
        <h3>Email Quote Preview</h3>
        <iframe srcdoc="${html.replace(/"/g, '&quot;')}" 
                style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 6px;">
        </iframe>
        <div class="modal-actions">
          <button class="btn-primary" onclick="openEmailClient('${encodeURIComponent(html)}')">
            📧 Open in Email Client
          </button>
          <button class="btn-secondary" onclick="downloadHTML('${html}')">
            💾 Download HTML
          </button>
          <button class="btn-secondary" onclick="closeModal()">
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modal);
}
```

## CSV Export Implementation

```javascript
function exportQuoteCSV(quoteData) {
  const headers = [
    'Quote ID',
    'Date',
    'Customer Type',
    'Item Name',
    'Specifications',
    'Quantity',
    'Unit Price',
    'Subtotal',
    'Discount %',
    'Discount Amount',
    'Final Total'
  ];
  
  const rows = quoteData.items.map(item => [
    quoteData.quoteId,
    new Date().toLocaleDateString(),
    quoteData.customerType,
    item.name,
    `${item.weight}g, ${item.time}h, ${item.material}`,
    item.quantity,
    item.unitPrice,
    item.total,
    quoteData.discountPercentage,
    quoteData.discountAmount,
    quoteData.finalTotal
  ]);
  
  // Add summary row
  rows.push([
    '',
    '',
    '',
    'TOTAL',
    '',
    quoteData.items.reduce((sum, item) => sum + item.quantity, 0),
    '',
    quoteData.subtotal,
    quoteData.discountPercentage,
    quoteData.discountAmount,
    quoteData.finalTotal
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PrintGenie_Quote_${quoteData.quoteId}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  
  showSuccessMessage("CSV exported successfully!");
}
```

## Image Export Implementation (Canvas-based)

```javascript
async function exportQuoteImage(quoteData) {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 1080;  // Instagram post size
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);
  
  // White card
  ctx.fillStyle = 'white';
  ctx.roundRect(60, 60, 960, 960, 20);
  ctx.fill();
  
  // Header
  ctx.fillStyle = '#667eea';
  ctx.font = 'bold 72px Arial';
  ctx.fillText('🧞 Print Genie', 100, 180);
  
  ctx.fillStyle = '#666';
  ctx.font = '32px Arial';
  ctx.fillText('QUOTE', 100, 240);
  
  // Quote ID
  ctx.fillStyle = '#333';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(`Quote: ${quoteData.quoteId}`, 100, 320);
  
  ctx.font = '28px Arial';
  ctx.fillText(`${quoteData.customerType}`, 100, 360);
  
  // Divider line
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 400);
  ctx.lineTo(980, 400);
  ctx.stroke();
  
  // Items (show first 3 items)
  let yPos = 460;
  ctx.fillStyle = '#333';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('Order Details:', 100, yPos);
  
  yPos += 60;
  ctx.font = '28px Arial';
  
  quoteData.items.slice(0, 3).forEach((item, i) => {
    ctx.fillText(`${i + 1}. ${item.name}`, 120, yPos);
    yPos += 40;
    ctx.fillStyle = '#666';
    ctx.font = '24px Arial';
    ctx.fillText(`   ${item.quantity} × ₹${item.unitPrice} = ₹${item.total}`, 140, yPos);
    yPos += 50;
    ctx.fillStyle = '#333';
    ctx.font = '28px Arial';
  });
  
  if (quoteData.items.length > 3) {
    ctx.fillStyle = '#666';
    ctx.font = 'italic 24px Arial';
    ctx.fillText(`   + ${quoteData.items.length - 3} more items...`, 140, yPos);
    yPos += 50;
  }
  
  // Divider
  ctx.strokeStyle = '#e0e0e0';
  ctx.beginPath();
  ctx.moveTo(100, yPos);
  ctx.lineTo(980, yPos);
  ctx.stroke();
  
  yPos += 50;
  
  // Pricing
  ctx.fillStyle = '#333';
  ctx.font = '32px Arial';
  ctx.fillText('Subtotal:', 100, yPos);
  ctx.fillText(`₹${quoteData.subtotal}`, 980, yPos, { align: 'right' });
  
  if (quoteData.discountAmount > 0) {
    yPos += 50;
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Discount (${quoteData.discountPercentage}%):`, 100, yPos);
    ctx.fillText(`-₹${quoteData.discountAmount}`, 980, yPos, { align: 'right' });
  }
  
  yPos += 60;
  
  // Total box
  ctx.fillStyle = '#667eea';
  ctx.roundRect(100, yPos, 880, 100, 10);
  ctx.fill();
  
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.fillText('TOTAL:', 130, yPos + 65);
  
  ctx.font = 'bold 56px Arial';
  const totalText = `₹${quoteData.finalTotal}`;
  const totalWidth = ctx.measureText(totalText).width;
  ctx.fillText(totalText, 950 - totalWidth, yPos + 65);
  
  yPos += 150;
  
  // Contact info
  ctx.fillStyle = '#666';
  ctx.font = '28px Arial';
  ctx.fillText('📱 +91-XXXXXXXXXX', 100, yPos);
  yPos += 45;
  ctx.fillText('💬 WhatsApp | 📧 Email', 100, yPos);
  yPos += 45;
  ctx.fillText('www.printgenie.com', 100, yPos);
  
  // Footer
  ctx.fillStyle = '#999';
  ctx.font = 'italic 20px Arial';
  ctx.fillText(`Valid for 7 days | ${new Date().toLocaleDateString()}`, 100, 990);
  
  // Convert to blob and download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrintGenie_Quote_${quoteData.quoteId}.png`;
    a.click();
    
    showSuccessMessage("Quote image created! Ready to share on social media.");
  });
}

// Helper for rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};
```

---

# Integration with Other Features

## Batch Calculator with Bulk/Retail Pricing

When using batch calculator, allow selecting pricing mode for entire batch:

```html
<div class="batch-pricing-mode">
  <label>Pricing Mode for Batch:</label>
  <select id="batch-pricing-mode" onchange="updateBatchPricing()">
    <option value="retail">Retail Pricing</option>
    <option value="bulk">Bulk/Wholesale Pricing</option>
  </select>
  
  <div class="batch-mode-info" id="batch-mode-details">
    <span class="info-icon">ℹ️</span>
    <span id="batch-mode-message">
      Retail pricing selected. Switch to Bulk for 10+ items.
    </span>
  </div>
</div>
```

Batch total should reflect bulk discounts:

```javascript
function calculateBatchWithMode(items, pricingMode) {
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Validate minimum for bulk
  if (pricingMode === 'bulk' && totalQty < 10) {
    showWarning(`Bulk pricing requires minimum 10 items. Current: ${totalQty}`);
    return null;
  }
  
  // Calculate each item
  const results = items.map(item => {
    return calculatePriceWithMode(item.costs, item.tier, item.quantity, pricingMode);
  });
  
  // Aggregate
  const batchTotal = {
    subtotal: results.reduce((sum, r) => sum + r.subtotal, 0),
    discount: results.reduce((sum, r) => sum + r.discountAmount, 0),
    finalTotal: results.reduce((sum, r) => sum + r.finalTotal, 0)
  };
  
  return { results, batchTotal, pricingMode };
}
```

## Customer Quote Generator with Pricing Modes

In customer-facing quote form, ask about business type:

```html
<div class="customer-type-selection">
  <h3>Are you ordering for business or personal use?</h3>
  
  <div class="customer-type-cards">
    <label class="type-card">
      <input type="radio" name="customer-type" value="retail" checked>
      <div class="card-content">
        <div class="card-icon">🛒</div>
        <h4>Personal/Retail</h4>
        <p>Individual customer, personal use</p>
      </div>
    </label>
    
    <label class="type-card">
      <input type="radio" name="customer-type" value="bulk">
      <div class="card-content">
        <div class="card-icon">🏢</div>
        <h4>Business/Wholesale</h4>
        <p>Company, reseller, or bulk order</p>
        <small>10+ items for wholesale pricing</small>
      </div>
    </label>
  </div>
</div>
```

## Analytics Dashboard with Bulk/Retail Split

Add metrics showing retail vs bulk revenue:

```html
<div class="revenue-breakdown-chart">
  <h4>Revenue by Customer Type</h4>
  <canvas id="customer-type-revenue-chart"></canvas>
  
  <div class="breakdown-stats">
    <div class="stat-item">
      <span class="stat-label">Retail Orders:</span>
      <span class="stat-value" id="retail-orders-count">0</span>
      <span class="stat-percent">(0%)</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Bulk Orders:</span>
      <span class="stat-value" id="bulk-orders-count">0</span>
      <span class="stat-percent">(0%)</span>
    </div>
  </div>
</div>
```

---

# Pricing Preset Updates

Update presets to include bulk/retail settings:

```javascript
const competitiveMode = {
  name: "Competitive Mode",
  retail: {
    flatRates: { tier1: 75, tier2: 150, tier3: 300, tier4: 500 },
    profitMargins: { tier1: 25, tier2: 25, tier3: 20, tier4: 20 }
  },
  bulk: {
    flatRates: { tier1: 60, tier2: 120, tier3: 240, tier4: 400 },
    profitMargins: { tier1: 15, tier2: 15, tier3: 12, tier4: 12 },
    volumeDiscounts: { qty10to24: 0, qty25to49: 5, qty50to99: 10, qty100plus: 15 }
  }
};

const balancedMode = {
  name: "Balanced Mode",
  retail: {
    flatRates: { tier1: 100, tier2: 200, tier3: 400, tier4: 600 },
    profitMargins: { tier1: 30, tier2: 30, tier3: 25, tier4: 25 }
  },
  bulk: {
    flatRates: { tier1: 75, tier2: 150, tier3: 300, tier4: 500 },
    profitMargins: { tier1: 20, tier2: 18, tier3: 15, tier4: 15 },
    volumeDiscounts: { qty10to24: 0, qty25to49: 5, qty50to99: 10, qty100plus: 15 }
  }
};

const premiumMode = {
  name: "Premium Mode",
  retail: {
    flatRates: { tier1: 150, tier2: 300, tier3: 600, tier4: 1000 },
    profitMargins: { tier1: 40, tier2: 35, tier3: 30, tier4: 30 }
  },
  bulk: {
    flatRates: { tier1: 100, tier2: 200, tier3: 450, tier4: 800 },
    profitMargins: { tier1: 25, tier2: 23, tier3: 20, tier4: 20 },
    volumeDiscounts: { qty10to24: 0, qty25to49: 3, qty50to99: 7, qty100plus: 12 }
  }
};
```

---

# Complete Implementation Checklist

## Phase 1: Bulk/Retail Pricing System (Days 1-2)

- [ ] Add pricing mode data structures
- [ ] Create customer type toggle UI
- [ ] Implement dual calculation logic (retail vs bulk)
- [ ] Add volume discount system
- [ ] Create minimum order validation
- [ ] Build pricing comparison display
- [ ] Add transparent cost breakdown (bulk only)
- [ ] Update all presets with bulk/retail settings
- [ ] Test pricing accuracy for both modes
- [ ] Add mode persistence in localStorage

## Phase 2: Quote Export System (Days 3-5)

### PDF Export
- [ ] Implement jsPDF quote generation
- [ ] Add branding and formatting
- [ ] Include cost breakdown (conditional)
- [ ] Add terms & conditions
- [ ] Include payment information
- [ ] Add signature field
- [ ] Test PDF generation
- [ ] Add download functionality

### WhatsApp Export
- [ ] Create formatted WhatsApp message
- [ ] Add emoji formatting
- [ ] Implement copy to clipboard
- [ ] Create preview modal
- [ ] Add "Open WhatsApp" button
- [ ] Test on mobile devices

### Email Export
- [ ] Create HTML email template
- [ ] Add responsive styling
- [ ] Include all quote details
- [ ] Add CTA buttons
- [ ] Implement preview
- [ ] Add download as HTML
- [ ] Test in email clients

### CSV Export
- [ ] Structure CSV data
- [ ] Include all relevant fields
- [ ] Add summary row
- [ ] Implement download
- [ ] Test in Excel/Sheets

### Image Export
- [ ] Create canvas-based image generator
- [ ] Design Instagram-ready layout
- [ ] Add branding elements
- [ ] Include key quote details
- [ ] Generate PNG download
- [ ] Test image quality

## Phase 3: Integration (Days 6-7)

- [ ] Integrate bulk/retail with batch calculator
- [ ] Add pricing mode to customer quote generator
- [ ] Update analytics to track retail vs bulk
- [ ] Add export options to all calculators
- [ ] Test complete user workflows
- [ ] Add export options to customer quotes
- [ ] Create export history tracking
- [ ] Test all export formats
- [ ] Mobile responsiveness testing
- [ ] Documentation updates

---

# Success Criteria

## Bulk/Retail Pricing
- [ ] Can switch between retail and bulk modes
- [ ] Bulk mode enforces 10-item minimum
- [ ] Volume discounts calculate correctly (25/50/100+ tiers)
- [ ] Cost breakdown shows only for bulk customers
- [ ] Pricing comparison displays correctly
- [ ] Both modes persist in saved calculations
- [ ] Analytics tracks retail vs bulk revenue separately

## Quote Export System
- [ ] PDF export generates professional document
- [ ] WhatsApp message copies to clipboard correctly
- [ ] WhatsApp link opens with pre-filled message
- [ ] Email HTML renders correctly in clients
- [ ] CSV imports into Excel without errors
- [ ] Image export creates Instagram-ready PNG
- [ ] All formats include correct quote details
- [ ] Bulk discount shows in all export formats
- [ ] Export history saves for reference

---

# (Previous sections from original prompt continue below...)

# Printer Specifications, Analytics Dashboard, Customer Quote Generator, Batch Calculator remain the same as in original prompt...

[All previous content about:
- Printer specs
- Material costs
- Operating costs
- Labor costs
- Analytics Dashboard
- Customer Quote Generator
- Batch Calculator
- Implementation Guidelines
- File Structure
- Testing Requirements
etc.]

---

# Final Deliverables

Claude Code will provide:

1. **Modified Files:**
   - `public/index.html` (pricing mode toggle, export buttons)
   - `src/app.js` (bulk/retail logic, export functions)
   - `src/data/catalogData.js` (pricing mode data)
   - `public/styles.css` (new UI elements)

2. **New Files:**
   - `src/pricing-modes.js` (bulk/retail calculation logic)
   - `src/quote-export.js` (all export format functions)
   - `src/cost-settings.js`
   - `src/analytics.js`
   - `src/batch-calculator.js`
   - `public/customer-quote.html`
   - `public/customer-quote.css`
   - `src/customer-quote.js`

3. **Export Templates:**
   - PDF quote template
   - WhatsApp message template
   - Email HTML template
   - Image canvas template

4. **Documentation:**
   - Updated README.md with bulk/retail pricing guide
   - Export formats user guide
   - Complete feature documentation

---

# Ready to Build!

This comprehensive prompt now includes:
✅ HYBRID flexible pricing (flat/hourly/market)
✅ Bulk & Retail pricing tiers
✅ Volume discounts (5%/10%/15%)
✅ 5 Export formats (PDF/WhatsApp/Email/CSV/Image)
✅ Analytics Dashboard
✅ Customer Quote Generator
✅ Batch Calculator
✅ Complete documentation

**Download and use with Claude Code to build your complete Print Genie platform!** 🚀
