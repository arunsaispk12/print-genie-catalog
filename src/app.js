// Print Genie Catalog Builder - Main Application v1.1.0
import catalogData from './data/catalogData.js';
import sampleProducts from './data/sampleProducts.js';

// Application State
let catalog = JSON.parse(localStorage.getItem('printGenieCatalog')) || [];
let nextSequence = parseInt(localStorage.getItem('nextSequence')) || 1;
let customCategories = JSON.parse(localStorage.getItem('customCategories')) || {};
let currentImageData = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    populateFormOptions();
    setupFormHandlers();
    setupCatalogView();
    setupSKUGenerator();
    setupImageHandlers();
    setupCategoryManagement();
    setupSettings();
    updateCatalogDisplay();
    displayExistingCategories();
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

            // Refresh category display when switching to category manager
            if (targetTab === 'category-manager') {
                displayExistingCategories();
            }
        });
    });
}

// Get All Categories (default + custom)
function getAllCategories() {
    const allCategories = { ...catalogData.categories };

    // Merge custom categories
    Object.entries(customCategories).forEach(([categoryName, categoryData]) => {
        if (allCategories[categoryName]) {
            // Merge subcategories if category exists
            allCategories[categoryName].subcategories = {
                ...allCategories[categoryName].subcategories,
                ...categoryData.subcategories
            };
        } else {
            // Add new category
            allCategories[categoryName] = categoryData;
        }
    });

    return allCategories;
}

// Populate Form Options
function populateFormOptions() {
    // Populate Categories
    const categorySelect = document.getElementById('category');
    const filterCategory = document.getElementById('filterCategory');
    const parentCategory = document.getElementById('parentCategory');

    // Clear existing options (except first)
    categorySelect.innerHTML = '<option value="">Select category...</option>';
    filterCategory.innerHTML = '<option value="">All Categories</option>';
    if (parentCategory) {
        parentCategory.innerHTML = '<option value="">Select parent category...</option>';
    }

    const allCategories = getAllCategories();

    Object.entries(allCategories).forEach(([name, data]) => {
        const option = new Option(name, name);
        categorySelect.add(option);

        const filterOption = new Option(name, name);
        filterCategory.add(filterOption);

        if (parentCategory) {
            const parentOption = new Option(name, name);
            parentCategory.add(parentOption);
        }
    });

    // Populate Materials
    const materialSelect = document.getElementById('material');
    materialSelect.innerHTML = '<option value="">Select material...</option>';
    Object.entries(catalogData.materials).forEach(([code, data]) => {
        const option = new Option(`${code} - ${data.name}`, code);
        materialSelect.add(option);
    });

    // Populate Colors
    const colorSelect = document.getElementById('color');
    colorSelect.innerHTML = '<option value="">Select color...</option>';
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
    sizeSelect.innerHTML = '<option value="">Select size...</option>';
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

        const allCategories = getAllCategories();

        if (selectedCategory && allCategories[selectedCategory]) {
            subcategorySelect.disabled = false;
            const subcategories = allCategories[selectedCategory].subcategories;

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
            clearImagePreview();
            currentImageData = null;
        }, 0);
    });
}

// Setup Image Handlers
function setupImageHandlers() {
    const imageUpload = document.getElementById('imageUpload');
    const imageUrl = document.getElementById('imageUrl');

    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }

    if (imageUrl) {
        imageUrl.addEventListener('input', handleImageURL);
    }
}

// Handle Image Upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        e.target.value = '';
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        currentImageData = event.target.result;
        displayImagePreview(currentImageData);
        // Clear URL input if image was uploaded
        document.getElementById('imageUrl').value = '';
    };
    reader.readAsDataURL(file);
}

// Handle Image URL
function handleImageURL(e) {
    const url = e.target.value.trim();
    if (!url) {
        clearImagePreview();
        currentImageData = null;
        return;
    }

    // Basic URL validation
    try {
        new URL(url);
        currentImageData = url;
        displayImagePreview(url);
        // Clear file input if URL was provided
        document.getElementById('imageUpload').value = '';
    } catch (error) {
        // Invalid URL, don't show preview yet
        clearImagePreview();
        currentImageData = null;
    }
}

// Display Image Preview
function displayImagePreview(imageData) {
    const form = document.getElementById('productForm');
    let preview = form.querySelector('.image-preview');

    if (!preview) {
        preview = document.createElement('div');
        preview.className = 'image-preview';
        const imageUrlGroup = form.querySelector('#imageUrl').closest('.form-group');
        imageUrlGroup.after(preview);
    }

    preview.innerHTML = `
        <img src="${imageData}" alt="Preview" style="max-width: 200px; border-radius: 8px; border: 2px solid var(--border-color);">
        <button type="button" class="btn btn-secondary btn-small" onclick="clearImagePreview()" style="margin-top: 10px; display: block;">Clear Image</button>
    `;
}

// Clear Image Preview
window.clearImagePreview = function() {
    const preview = document.querySelector('.image-preview');
    if (preview) {
        preview.remove();
    }
    currentImageData = null;
    document.getElementById('imageUpload').value = '';
    document.getElementById('imageUrl').value = '';
};

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
        image: currentImageData || null,
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
    clearImagePreview();
    currentImageData = null;

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
    const loadSamplesBtn = document.getElementById('loadSamplesBtn');
    const publishCatalogBtn = document.getElementById('publishCatalogBtn');
    const shareCatalogBtn = document.getElementById('shareCatalogBtn');

    searchInput.addEventListener('input', updateCatalogDisplay);
    filterCategory.addEventListener('change', updateCatalogDisplay);
    exportBtn.addEventListener('click', exportToCSV);
    if (loadSamplesBtn) {
        loadSamplesBtn.addEventListener('click', loadSampleProducts);
    }
    if (publishCatalogBtn) {
        publishCatalogBtn.addEventListener('click', publishCatalog);
    }
    if (shareCatalogBtn) {
        shareCatalogBtn.addEventListener('click', showShareCatalogDialog);
    }
}

// Load Sample Products
function loadSampleProducts() {
    const confirmLoad = confirm(
        `Load ${sampleProducts.length} sample products?\n\n` +
        `This will add:\n` +
        `- ${sampleProducts.filter(p => p.category.includes('Tech')).length} Tech products\n` +
        `- ${sampleProducts.filter(p => p.category.includes('Home')).length} Home products\n` +
        `- ${sampleProducts.filter(p => p.category.includes('Toys')).length} Toys\n` +
        `- ${sampleProducts.filter(p => p.category.includes('Custom')).length} Custom prints\n` +
        `- ${sampleProducts.filter(p => p.category.includes('Material')).length} Materials\n` +
        `- And more...\n\n` +
        `Existing products will be preserved.`
    );

    if (!confirmLoad) return;

    // Update sequence number to avoid conflicts
    const highestSeq = Math.max(
        ...catalog.map(p => parseInt(p.sku.split('-').pop())),
        ...sampleProducts.map(p => parseInt(p.sku.split('-').pop())),
        0
    );
    nextSequence = highestSeq + 1;

    // Add sample products
    catalog.push(...sampleProducts);

    // Save to localStorage
    localStorage.setItem('printGenieCatalog', JSON.stringify(catalog));
    localStorage.setItem('nextSequence', nextSequence.toString());

    // Update display
    updateCatalogDisplay();

    // Show success message
    alert(
        `✅ Successfully loaded ${sampleProducts.length} sample products!\n\n` +
        `Check out the catalog to see products from all categories:\n` +
        `- Pre-designed products (Tech, Home, Toys, Auto, Jewelry, Office)\n` +
        `- Custom prints and prototypes\n` +
        `- Filaments and accessories\n\n` +
        `Total products in catalog: ${catalog.length}`
    );
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
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No products found</td></tr>';
    } else {
        tbody.innerHTML = filteredCatalog.map(product => {
            const imageCell = product.image
                ? `<img src="${product.image}" class="product-image" alt="${product.name}">`
                : `<div class="product-image-placeholder">No Image</div>`;

            return `
            <tr>
                <td>${imageCell}</td>
                <td><strong>${product.sku}</strong></td>
                <td>${product.name}</td>
                <td>${product.subcategoryName || product.category}</td>
                <td>${product.material}</td>
                <td>${product.color}</td>
                <td>${product.size}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.sku}')">Delete</button>
                </td>
            </tr>
        `;
        }).join('');
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
    document.getElementById('totalValue').textContent = `₹${totalValue.toFixed(2)}`;
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

    const headers = ['SKU', 'Product Name', 'Category', 'Subcategory', 'Material', 'Color', 'Size', 'Price (INR)', 'Stock', 'Description', 'Tags', 'Has Image', 'Date Added'];

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
            p.image ? 'Yes' : 'No',
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

// Publish Catalog - Auto-publish to GitHub or manual download
async function publishCatalog() {
    if (catalog.length === 0) {
        alert('📦 No products in catalog yet!\n\nAdd some products first, then publish your catalog.');
        return;
    }

    // Create catalog data
    const catalogData = {
        products: catalog,
        lastUpdated: new Date().toISOString(),
        metadata: {
            businessName: "Print Genie",
            currency: "INR",
            currencySymbol: "₹",
            totalProducts: catalog.length,
            categories: Array.from(new Set(catalog.map(p => p.category))),
            version: "1.1"
        }
    };

    // Check if GitHub settings are configured
    const githubSettings = getGitHubSettings();

    if (githubSettings) {
        // AUTO-PUBLISH via GitHub API
        const confirmed = confirm(
            `🚀 Auto-Publish to GitHub\n\n` +
            `This will automatically:\n` +
            `✅ Update catalog-data.json in your repository\n` +
            `✅ Create a commit with your products\n` +
            `✅ Make your catalog live in 1-2 minutes\n\n` +
            `Current products: ${catalog.length}\n` +
            `Repository: ${githubSettings.username}/${githubSettings.repo}\n\n` +
            `Ready to publish?`
        );

        if (!confirmed) return;

        // Show loading
        const publishBtn = document.getElementById('publishCatalogBtn');
        const originalText = publishBtn.textContent;
        publishBtn.textContent = '⏳ Publishing...';
        publishBtn.disabled = true;

        try {
            await publishToGitHub(catalogData);

            alert(
                `✅ Catalog published successfully!\n\n` +
                `📊 Published: ${catalog.length} products\n` +
                `⏰ Wait 1-2 minutes for GitHub Pages to deploy\n\n` +
                `Your customers will see the updated catalog at:\n` +
                `${window.location.origin}${window.location.pathname.replace('index.html', '')}catalog.html\n\n` +
                `💡 Share the link with your customers!`
            );
        } catch (error) {
            console.error('Publish error:', error);
            alert(
                `❌ Publishing failed!\n\n` +
                `Error: ${error.message}\n\n` +
                `Possible solutions:\n` +
                `1. Check your GitHub token in Settings tab\n` +
                `2. Make sure token has 'repo' permissions\n` +
                `3. Verify repository name is correct\n` +
                `4. Check your internet connection\n\n` +
                `Or use manual download instead.`
            );
        } finally {
            publishBtn.textContent = originalText;
            publishBtn.disabled = false;
        }
    } else {
        // MANUAL DOWNLOAD (fallback if no GitHub settings)
        const choice = confirm(
            `📥 Manual Download Mode\n\n` +
            `GitHub auto-publish is not configured.\n\n` +
            `Choose an option:\n` +
            `• Click OK to download catalog-data.json (manual)\n` +
            `• Click Cancel to go to Settings and configure auto-publish\n\n` +
            `💡 Tip: Configure GitHub settings for one-click publishing!`
        );

        if (choice) {
            // Download file manually
            const jsonContent = JSON.stringify(catalogData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'catalog-data.json';
            a.click();
            URL.revokeObjectURL(url);

            setTimeout(() => {
                alert(
                    `✅ catalog-data.json downloaded!\n\n` +
                    `📋 Next steps:\n\n` +
                    `1. Replace public/catalog-data.json in your repo\n` +
                    `2. Run: git add public/catalog-data.json\n` +
                    `3. Run: git commit -m "Update catalog"\n` +
                    `4. Run: git push\n` +
                    `5. Wait 1-2 minutes for deployment\n\n` +
                    `💡 Want auto-publish? Go to Settings tab!`
                );
            }, 500);
        } else {
            // Go to Settings tab
            document.querySelector('[data-tab="settings"]').click();
        }
    }
}

// Show Share Catalog Dialog
function showShareCatalogDialog() {
    if (catalog.length === 0) {
        alert('📦 No products in catalog yet!\n\nAdd some products first, then share your catalog with customers.');
        return;
    }

    // Get the public catalog URL - handle both local and GitHub Pages
    let catalogUrl;
    const currentUrl = window.location.href;

    if (currentUrl.includes('index.html')) {
        // Replace index.html with catalog.html
        catalogUrl = currentUrl.replace('index.html', 'catalog.html');
    } else if (currentUrl.endsWith('/public/')) {
        // Add catalog.html to the end
        catalogUrl = currentUrl + 'catalog.html';
    } else if (currentUrl.endsWith('/public')) {
        // Add /catalog.html
        catalogUrl = currentUrl + '/catalog.html';
    } else {
        // Fallback: use current directory + catalog.html
        const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
        catalogUrl = baseUrl + 'catalog.html';
    }

    // Show share dialog with better formatting
    const confirmed = confirm(
        `🎉 Your Public Catalog is Ready!\n\n` +
        `You have ${catalog.length} product${catalog.length !== 1 ? 's' : ''} ready to share.\n\n` +
        `Catalog URL:\n${catalogUrl}\n\n` +
        `Click OK to see sharing options, or Cancel to close.`
    );

    if (!confirmed) return;

    // Show options
    const choice = prompt(
        `📤 Share Your Catalog\n\n` +
        `Choose an option:\n\n` +
        `1 - Copy link to clipboard\n` +
        `2 - Open catalog preview\n` +
        `3 - Share via WhatsApp\n` +
        `4 - Show link (to copy manually)\n` +
        `\nEnter 1, 2, 3, or 4:`,
        '1'
    );

    switch(choice) {
        case '1':
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(catalogUrl).then(() => {
                    alert('✅ Link copied to clipboard!\n\n' + catalogUrl + '\n\nPaste this link to share with your customers.');
                }).catch((err) => {
                    console.error('Clipboard error:', err);
                    prompt('Copy this link manually (Ctrl+C or Cmd+C):', catalogUrl);
                });
            } else {
                // Fallback for browsers without clipboard API
                prompt('Copy this link (Ctrl+C or Cmd+C, then press OK):', catalogUrl);
            }
            break;
        case '2':
            // Open in new tab
            const newWindow = window.open(catalogUrl, '_blank');
            if (!newWindow) {
                alert('⚠️ Pop-up blocked!\n\nPlease allow pop-ups and try again.\n\nOr copy this link manually:\n' + catalogUrl);
            }
            break;
        case '3':
            // Share via WhatsApp
            const whatsappText = encodeURIComponent(`Check out Print Genie's 3D printing catalog! 🧞\n\n${catalogUrl}`);
            const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
            const whatsappWindow = window.open(whatsappUrl, '_blank');
            if (!whatsappWindow) {
                alert('⚠️ Pop-up blocked!\n\nPlease allow pop-ups, or copy this link:\n' + catalogUrl);
            }
            break;
        case '4':
            // Show link for manual copy
            prompt('Copy this link (Ctrl+C or Cmd+C):', catalogUrl);
            break;
        default:
            if (choice !== null) {
                alert('Invalid choice. Please click the Share button again and enter 1, 2, 3, or 4.');
            }
    }
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
    const allCategories = getAllCategories();
    Object.entries(allCategories).forEach(([name, data]) => {
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

// Setup Category Management
function setupCategoryManagement() {
    const categoryForm = document.getElementById('categoryForm');
    const subcategoryForm = document.getElementById('subcategoryForm');

    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewCategory();
        });
    }

    if (subcategoryForm) {
        subcategoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewSubcategory();
        });
    }
}

// Add New Category
function addNewCategory() {
    const categoryName = document.getElementById('newCategoryName').value.trim();
    const categoryCode = document.getElementById('newCategoryCode').value.trim().toUpperCase();

    if (!categoryName || !categoryCode) {
        alert('Please fill in all fields');
        return;
    }

    // Validate code format
    if (categoryCode.length < 2 || categoryCode.length > 6) {
        alert('Category code must be 2-6 characters');
        return;
    }

    // Check if category already exists
    const allCategories = getAllCategories();
    if (allCategories[categoryName]) {
        alert('Category already exists!');
        return;
    }

    // Add new category
    customCategories[categoryName] = {
        subcategories: {}
    };

    saveCustomCategories();
    populateFormOptions();
    displayExistingCategories();

    // Reset form
    document.getElementById('categoryForm').reset();

    alert(`✅ Category "${categoryName}" added successfully!`);
}

// Add New Subcategory
function addNewSubcategory() {
    const parentCategory = document.getElementById('parentCategory').value;
    const subcategoryName = document.getElementById('newSubcategoryName').value.trim();
    const subcategoryCode = document.getElementById('newSubcategoryCode').value.trim().toUpperCase();

    if (!parentCategory || !subcategoryName || !subcategoryCode) {
        alert('Please fill in all fields');
        return;
    }

    // Validate code format
    if (subcategoryCode.length > 8) {
        alert('Subcategory code must be max 8 characters');
        return;
    }

    // Get or create parent category in custom categories
    if (!customCategories[parentCategory]) {
        customCategories[parentCategory] = {
            subcategories: {}
        };
    }

    // Check if subcategory already exists
    const allCategories = getAllCategories();
    if (allCategories[parentCategory]?.subcategories[subcategoryName]) {
        alert('Subcategory already exists in this category!');
        return;
    }

    // Add subcategory
    customCategories[parentCategory].subcategories[subcategoryName] = {
        code: subcategoryCode
    };

    saveCustomCategories();
    populateFormOptions();
    displayExistingCategories();

    // Reset form
    document.getElementById('subcategoryForm').reset();

    alert(`✅ Subcategory "${subcategoryName}" added to "${parentCategory}" successfully!`);
}

// Save Custom Categories
function saveCustomCategories() {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
}

// Display Existing Categories
function displayExistingCategories() {
    const container = document.getElementById('existingCategories');
    if (!container) return;

    const allCategories = getAllCategories();

    if (Object.keys(allCategories).length === 0) {
        container.innerHTML = '<p class="text-secondary">No categories available</p>';
        return;
    }

    container.innerHTML = Object.entries(allCategories).map(([categoryName, categoryData]) => {
        const subcategoriesHTML = Object.entries(categoryData.subcategories || {})
            .map(([subName, subData]) => `
                <li>
                    <strong>${subName}</strong> - Code: <code>${subData.code}</code>
                </li>
            `).join('');

        const isCustom = customCategories[categoryName] ? ' (Custom)' : '';

        return `
            <div class="category-item">
                <h4>${categoryName}${isCustom}</h4>
                <ul class="subcategory-list">
                    ${subcategoriesHTML || '<li>No subcategories</li>'}
                </ul>
            </div>
        `;
    }).join('');
}

// Setup Settings
function setupSettings() {
    const settingsForm = document.getElementById('githubSettingsForm');
    const testBtn = document.getElementById('testConnectionBtn');
    const clearBtn = document.getElementById('clearSettingsBtn');

    if (settingsForm) {
        settingsForm.addEventListener('submit', saveGitHubSettings);
    }
    if (testBtn) {
        testBtn.addEventListener('click', testGitHubConnection);
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', clearGitHubSettings);
    }

    // Load existing settings
    loadGitHubSettings();
}

// Save GitHub Settings
function saveGitHubSettings(e) {
    e.preventDefault();

    const settings = {
        username: document.getElementById('githubUsername').value.trim(),
        repo: document.getElementById('githubRepo').value.trim(),
        token: document.getElementById('githubToken').value.trim(),
        branch: document.getElementById('githubBranch').value.trim() || 'main'
    };

    // Validate
    if (!settings.username || !settings.repo || !settings.token) {
        alert('❌ Please fill in all required fields!');
        return;
    }

    // Save to localStorage
    localStorage.setItem('githubSettings', JSON.stringify(settings));

    // Update UI
    updateSettingsStatus();
    document.getElementById('autoPublishInfo').style.display = 'block';

    alert('✅ GitHub settings saved successfully!\n\nYou can now use one-click publishing from the View Catalog tab.');
}

// Load GitHub Settings
function loadGitHubSettings() {
    const settings = getGitHubSettings();

    if (settings) {
        document.getElementById('githubUsername').value = settings.username;
        document.getElementById('githubRepo').value = settings.repo;
        document.getElementById('githubToken').value = settings.token;
        document.getElementById('githubBranch').value = settings.branch || 'main';

        updateSettingsStatus();
        document.getElementById('autoPublishInfo').style.display = 'block';
    }
}

// Get GitHub Settings
function getGitHubSettings() {
    const settingsStr = localStorage.getItem('githubSettings');
    return settingsStr ? JSON.parse(settingsStr) : null;
}

// Update Settings Status
function updateSettingsStatus() {
    const settings = getGitHubSettings();
    const statusDiv = document.getElementById('settingsStatus');

    if (settings) {
        statusDiv.className = 'settings-status success';
        statusDiv.innerHTML = `
            <h4 style="color: var(--success-color);">✅ Connected to GitHub</h4>
            <p><strong>Repository:</strong> ${settings.username}/${settings.repo}</p>
            <p><strong>Branch:</strong> ${settings.branch}</p>
            <p><strong>Token:</strong> ${'*'.repeat(20)} (hidden)</p>
            <p style="margin-top: 10px;"><small>Auto-publish is ready! Go to View Catalog → Click "🚀 Publish Catalog"</small></p>
        `;
    } else {
        statusDiv.className = 'settings-status';
        statusDiv.innerHTML = '<p>No GitHub credentials configured. Please complete steps above.</p>';
    }
}

// Test GitHub Connection
async function testGitHubConnection() {
    const settings = getGitHubSettings();

    if (!settings) {
        alert('❌ Please save your GitHub settings first!');
        return;
    }

    const btn = document.getElementById('testConnectionBtn');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Testing...';
    btn.disabled = true;

    try {
        // Test API connection
        const response = await fetch(`https://api.github.com/repos/${settings.username}/${settings.repo}`, {
            headers: {
                'Authorization': `token ${settings.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            alert(`✅ Connection successful!\n\nRepository: ${data.full_name}\nDefault Branch: ${data.default_branch}\n\nAuto-publish is ready to use!`);
        } else if (response.status === 401) {
            alert('❌ Authentication failed!\n\nYour token is invalid or expired. Please create a new one.');
        } else if (response.status === 404) {
            alert('❌ Repository not found!\n\nPlease check your username and repository name.');
        } else {
            alert(`❌ Error: ${response.status}\n\nPlease check your settings and try again.`);
        }
    } catch (error) {
        console.error('Connection test error:', error);
        alert(`❌ Connection failed!\n\nError: ${error.message}\n\nPlease check your internet connection and try again.`);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Clear GitHub Settings
function clearGitHubSettings() {
    if (confirm('⚠️ Are you sure you want to clear GitHub settings?\n\nYou will need to reconfigure auto-publish.')) {
        localStorage.removeItem('githubSettings');
        document.getElementById('githubSettingsForm').reset();
        document.getElementById('githubBranch').value = 'main';
        updateSettingsStatus();
        document.getElementById('autoPublishInfo').style.display = 'none';
        alert('✅ Settings cleared successfully!');
    }
}

// Publish to GitHub via API
async function publishToGitHub(catalogData) {
    const settings = getGitHubSettings();

    if (!settings) {
        throw new Error('GitHub settings not configured. Please go to Settings tab.');
    }

    const filePath = 'public/catalog-data.json';
    const jsonContent = JSON.stringify(catalogData, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));

    // Get current file SHA (needed for updating)
    const getFileUrl = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${filePath}?ref=${settings.branch}`;

    let sha = null;
    try {
        const getResponse = await fetch(getFileUrl, {
            headers: {
                'Authorization': `token ${settings.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
        }
    } catch (error) {
        console.log('File does not exist yet, will create new');
    }

    // Update or create file
    const putUrl = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${filePath}`;
    const putData = {
        message: `🚀 Auto-publish catalog - ${catalogData.metadata.totalProducts} products`,
        content: base64Content,
        branch: settings.branch
    };

    if (sha) {
        putData.sha = sha; // Include SHA for update
    }

    const putResponse = await fetch(putUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${settings.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(putData)
    });

    if (!putResponse.ok) {
        const errorData = await putResponse.json();
        throw new Error(errorData.message || 'Failed to update GitHub');
    }

    return await putResponse.json();
}

// Initial stats update
updateStats();
