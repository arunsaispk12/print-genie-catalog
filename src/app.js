// Print Genie Catalog Builder - Main Application
import catalogData from './data/catalogData.js';

// Application State
let catalog = JSON.parse(localStorage.getItem('printGenieCatalog')) || [];
let nextSequence = parseInt(localStorage.getItem('nextSequence')) || 1;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    populateFormOptions();
    setupFormHandlers();
    setupCatalogView();
    setupSKUGenerator();
    updateCatalogDisplay();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Populate Form Options
function populateFormOptions() {
    // Populate Categories
    const categorySelect = document.getElementById('category');
    const filterCategory = document.getElementById('filterCategory');

    Object.entries(catalogData.categories).forEach(([name, data]) => {
        const option = new Option(name, name);
        categorySelect.add(option);

        const filterOption = new Option(name, name);
        filterCategory.add(filterOption);
    });

    // Populate Materials
    const materialSelect = document.getElementById('material');
    Object.entries(catalogData.materials).forEach(([code, data]) => {
        const option = new Option(`${code} - ${data.name}`, code);
        materialSelect.add(option);
    });

    // Populate Colors
    const colorSelect = document.getElementById('color');
    const standardColors = catalogData.colors.standard;
    const specialColors = catalogData.colors.special;

    const standardGroup = document.createElement('optgroup');
    standardGroup.label = 'Standard Colors';
    Object.entries(standardColors).forEach(([code, data]) => {
        const option = new Option(`${code} - ${data.name}`, code);
        standardGroup.appendChild(option);
    });
    colorSelect.add(standardGroup);

    const specialGroup = document.createElement('optgroup');
    specialGroup.label = 'Special Colors';
    Object.entries(specialColors).forEach(([code, data]) => {
        const option = new Option(`${code} - ${data.name}`, code);
        specialGroup.appendChild(option);
    });
    colorSelect.add(specialGroup);

    // Populate Sizes
    const sizeSelect = document.getElementById('size');
    const standardSizes = catalogData.sizes.standard;
    const specialSizes = catalogData.sizes.special;

    const sizeStandardGroup = document.createElement('optgroup');
    sizeStandardGroup.label = 'Standard Sizes';
    Object.entries(standardSizes).forEach(([code, data]) => {
        const option = new Option(`${code} - ${data.name}`, code);
        sizeStandardGroup.appendChild(option);
    });
    sizeSelect.add(sizeStandardGroup);

    const sizeSpecialGroup = document.createElement('optgroup');
    sizeSpecialGroup.label = 'Special Sizes';
    Object.entries(specialSizes).forEach(([code, data]) => {
        const option = new Option(`${code} - ${data.name}`, code);
        sizeSpecialGroup.appendChild(option);
    });
    sizeSelect.add(sizeSpecialGroup);
}

// Setup Form Handlers
function setupFormHandlers() {
    const form = document.getElementById('productForm');
    const categorySelect = document.getElementById('category');
    const subcategorySelect = document.getElementById('subcategory');

    // Handle category change to populate subcategories
    categorySelect.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        subcategorySelect.innerHTML = '<option value="">Select subcategory...</option>';

        if (selectedCategory && catalogData.categories[selectedCategory]) {
            subcategorySelect.disabled = false;
            const subcategories = catalogData.categories[selectedCategory].subcategories;

            Object.entries(subcategories).forEach(([name, data]) => {
                const option = new Option(`${name} (${data.code})`, data.code);
                subcategorySelect.add(option);
            });
        } else {
            subcategorySelect.disabled = true;
        }

        updateSKUPreview();
    });

    // Update SKU preview on any form change
    const formInputs = form.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('change', updateSKUPreview);
        input.addEventListener('input', updateSKUPreview);
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addProduct();
    });

    // Handle form reset
    form.addEventListener('reset', () => {
        setTimeout(() => {
            subcategorySelect.disabled = true;
            subcategorySelect.innerHTML = '<option value="">Select category first...</option>';
            updateSKUPreview();
        }, 0);
    });
}

// Update SKU Preview
function updateSKUPreview() {
    const subcategory = document.getElementById('subcategory').value;
    const material = document.getElementById('material').value;
    const color = document.getElementById('color').value;
    const size = document.getElementById('size').value;
    const customSize = document.getElementById('customSize').value;

    const skuDisplay = document.getElementById('skuDisplay');
    const skuBreakdown = document.getElementById('skuBreakdown');

    if (subcategory && material && color && (size || customSize)) {
        const finalSize = customSize ? customSize.toUpperCase() : size;
        const sequenceNum = String(nextSequence).padStart(4, '0');
        const sku = `PG-${subcategory}-${material}-${color}-${finalSize}-${sequenceNum}`;

        skuDisplay.innerHTML = `<span class="sku-code">${sku}</span>`;

        // Breakdown
        const breakdown = `
            PG: Print Genie Brand |
            ${subcategory}: Category |
            ${material}: Material |
            ${color}: Color |
            ${finalSize}: Size |
            ${sequenceNum}: Sequence #${nextSequence}
        `;
        skuBreakdown.textContent = breakdown;
    } else {
        skuDisplay.innerHTML = '<span class="sku-code">Complete form to generate SKU</span>';
        skuBreakdown.textContent = '';
    }
}

// Add Product
function addProduct() {
    const productData = {
        sku: generateSKU(),
        name: document.getElementById('productName').value,
        category: document.getElementById('category').value,
        subcategory: document.getElementById('subcategory').value,
        subcategoryName: document.getElementById('subcategory').selectedOptions[0]?.text.split(' (')[0] || '',
        material: document.getElementById('material').value,
        color: document.getElementById('color').value,
        size: document.getElementById('customSize').value || document.getElementById('size').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value) || 0,
        description: document.getElementById('description').value,
        tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
        dateAdded: new Date().toISOString()
    };

    catalog.push(productData);
    nextSequence++;

    // Save to localStorage
    localStorage.setItem('printGenieCatalog', JSON.stringify(catalog));
    localStorage.setItem('nextSequence', nextSequence.toString());

    // Reset form
    document.getElementById('productForm').reset();
    document.getElementById('subcategory').disabled = true;
    updateSKUPreview();

    // Update catalog view
    updateCatalogDisplay();

    // Switch to catalog view
    document.querySelector('[data-tab="catalog-view"]').click();

    // Show success message
    alert(`✅ Product added successfully!\n\nSKU: ${productData.sku}\nName: ${productData.name}`);
}

// Generate SKU
function generateSKU() {
    const subcategory = document.getElementById('subcategory').value;
    const material = document.getElementById('material').value;
    const color = document.getElementById('color').value;
    const customSize = document.getElementById('customSize').value;
    const size = customSize ? customSize.toUpperCase() : document.getElementById('size').value;
    const sequenceNum = String(nextSequence).padStart(4, '0');

    return `PG-${subcategory}-${material}-${color}-${size}-${sequenceNum}`;
}

// Setup Catalog View
function setupCatalogView() {
    const searchInput = document.getElementById('searchCatalog');
    const filterCategory = document.getElementById('filterCategory');
    const exportBtn = document.getElementById('exportBtn');

    searchInput.addEventListener('input', updateCatalogDisplay);
    filterCategory.addEventListener('change', updateCatalogDisplay);
    exportBtn.addEventListener('click', exportToCSV);
}

// Update Catalog Display
function updateCatalogDisplay() {
    const searchTerm = document.getElementById('searchCatalog')?.value.toLowerCase() || '';
    const filterCat = document.getElementById('filterCategory')?.value || '';

    // Filter catalog
    let filteredCatalog = catalog.filter(product => {
        const matchesSearch = !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        const matchesCategory = !filterCat || product.category === filterCat;

        return matchesSearch && matchesCategory;
    });

    // Update table
    const tbody = document.getElementById('catalogTableBody');

    if (filteredCatalog.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No products found</td></tr>';
    } else {
        tbody.innerHTML = filteredCatalog.map(product => `
            <tr>
                <td><strong>${product.sku}</strong></td>
                <td>${product.name}</td>
                <td>${product.subcategoryName || product.category}</td>
                <td>${product.material}</td>
                <td>${product.color}</td>
                <td>${product.size}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.sku}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Update stats
    updateStats(filteredCatalog);
}

// Update Stats
function updateStats(displayedCatalog = catalog) {
    const totalProducts = catalog.length;
    const uniqueCategories = new Set(catalog.map(p => p.category)).size;
    const totalValue = catalog.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = catalog.filter(p => p.stock < 5 && p.stock > 0).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalCategories').textContent = uniqueCategories;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('lowStock').textContent = lowStock;
}

// Delete Product
window.deleteProduct = function(sku) {
    if (confirm(`Are you sure you want to delete product ${sku}?`)) {
        catalog = catalog.filter(p => p.sku !== sku);
        localStorage.setItem('printGenieCatalog', JSON.stringify(catalog));
        updateCatalogDisplay();
    }
};

// Export to CSV
function exportToCSV() {
    if (catalog.length === 0) {
        alert('No products to export!');
        return;
    }

    const headers = ['SKU', 'Product Name', 'Category', 'Subcategory', 'Material', 'Color', 'Size', 'Price', 'Stock', 'Description', 'Tags', 'Date Added'];

    const csvContent = [
        headers.join(','),
        ...catalog.map(p => [
            p.sku,
            `"${p.name}"`,
            `"${p.category}"`,
            `"${p.subcategoryName}"`,
            p.material,
            p.color,
            p.size,
            p.price,
            p.stock,
            `"${p.description}"`,
            `"${p.tags.join(', ')}"`,
            p.dateAdded
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `print-genie-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Setup SKU Generator
function setupSKUGenerator() {
    const genInputs = ['genCategory', 'genMaterial', 'genColor', 'genSize'];

    genInputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', updateGeneratedSKU);
    });

    const decodeSKU = document.getElementById('decodeSKU');
    decodeSKU.addEventListener('input', decodeSKUInput);
}

// Update Generated SKU
function updateGeneratedSKU() {
    const category = document.getElementById('genCategory').value.toUpperCase();
    const material = document.getElementById('genMaterial').value.toUpperCase();
    const color = document.getElementById('genColor').value.toUpperCase();
    const size = document.getElementById('genSize').value.toUpperCase();

    const sku = `PG-${category || 'XXXXX'}-${material || 'XXX'}-${color || 'XXX'}-${size || 'XXX'}-${String(nextSequence).padStart(4, '0')}`;

    document.getElementById('generatedSKU').textContent = sku;
}

// Decode SKU
function decodeSKUInput() {
    const sku = document.getElementById('decodeSKU').value.trim().toUpperCase();
    const decodedResult = document.getElementById('decodedResult');

    if (!sku) {
        decodedResult.innerHTML = '<p>Enter a SKU to see its breakdown</p>';
        return;
    }

    const parts = sku.split('-');

    if (parts.length !== 6 || parts[0] !== 'PG') {
        decodedResult.innerHTML = '<p style="color: var(--danger-color);">❌ Invalid SKU format. Expected: PG-[CAT]-[MAT]-[COL]-[SIZE]-[SEQ]</p>';
        return;
    }

    const [brand, category, material, color, size, sequence] = parts;

    // Find category name
    let categoryName = 'Unknown';
    Object.entries(catalogData.categories).forEach(([name, data]) => {
        Object.entries(data.subcategories).forEach(([subName, subData]) => {
            if (subData.code === category) {
                categoryName = `${name} > ${subName}`;
            }
        });
    });

    // Find material name
    const materialName = catalogData.materials[material]?.name || 'Unknown';

    // Find color name
    const colorName = catalogData.colors.standard[color]?.name ||
                      catalogData.colors.special[color]?.name ||
                      'Unknown';

    // Find size name
    const sizeName = catalogData.sizes.standard[size]?.name ||
                     catalogData.sizes.special[size]?.name ||
                     size;

    decodedResult.innerHTML = `
        <h4 style="color: var(--success-color); margin-bottom: 15px;">✅ Valid SKU</h4>
        <ul>
            <li><strong>Brand:</strong> ${brand} (Print Genie)</li>
            <li><strong>Category:</strong> ${category} (${categoryName})</li>
            <li><strong>Material:</strong> ${material} (${materialName})</li>
            <li><strong>Color:</strong> ${color} (${colorName})</li>
            <li><strong>Size:</strong> ${size} (${sizeName})</li>
            <li><strong>Sequence:</strong> ${sequence} (#${parseInt(sequence)})</li>
        </ul>
    `;
}

// Initial stats update
updateStats();
