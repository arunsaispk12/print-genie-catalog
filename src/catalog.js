// Print Genie - Public Catalog Viewer
// Load and display products for customers

// State
let allProducts = [];
let filteredProducts = [];
let categories = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    setupShareLink();
});

// Load products from catalog-data.json
function loadProducts() {
    // Fetch catalog data from JSON file
    fetch('catalog-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Catalog data not found');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.products && data.products.length > 0) {
                allProducts = data.products;
                extractCategories();
                populateCategoryFilter();
                applyFilters();
                updateStats();
                updateCatalogInfo(data);
            } else {
                showEmptyState('No products available yet. Check back soon!');
            }
        })
        .catch(error => {
            console.error('Error loading catalog:', error);
            // Fallback to localStorage for local testing
            const localData = localStorage.getItem('printGenieCatalog');
            if (localData) {
                try {
                    allProducts = JSON.parse(localData);
                    if (allProducts.length > 0) {
                        extractCategories();
                        populateCategoryFilter();
                        applyFilters();
                        updateStats();
                        updateCatalogInfo();
                        console.log('Loaded from localStorage (development mode)');
                    } else {
                        showEmptyState('No products available yet. Admin needs to publish the catalog!');
                    }
                } catch (err) {
                    console.error('Error parsing localStorage:', err);
                    showEmptyState('No products available yet. Admin needs to publish the catalog!');
                }
            } else {
                showEmptyState('No products available yet. Admin needs to publish the catalog!');
            }
        });
}

// Extract unique categories
function extractCategories() {
    categories = new Set(allProducts.map(p => p.category));
}

// Populate category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    Array.from(categories).sort().forEach(category => {
        const option = new Option(category, category);
        categoryFilter.add(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    // Filters
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);

    // Share
    document.getElementById('shareBtn').addEventListener('click', openShareModal);
    document.getElementById('shareModalClose').addEventListener('click', closeShareModal);
    document.getElementById('shareModalOverlay').addEventListener('click', closeShareModal);
    document.getElementById('copyLinkBtn').addEventListener('click', copyShareLink);

    // Share buttons
    document.getElementById('shareWhatsApp').addEventListener('click', () => shareVia('whatsapp'));
    document.getElementById('shareFacebook').addEventListener('click', () => shareVia('facebook'));
    document.getElementById('shareTwitter').addEventListener('click', () => shareVia('twitter'));
    document.getElementById('shareEmail').addEventListener('click', () => shareVia('email'));

    // Print
    document.getElementById('printBtn').addEventListener('click', () => window.print());

    // Product modal
    document.getElementById('modalClose').addEventListener('click', closeProductModal);
    document.getElementById('modalOverlay').addEventListener('click', closeProductModal);

    // How to Order modal
    document.getElementById('howToOrderBtn').addEventListener('click', openHowToOrderModal);
    document.getElementById('howToOrderClose').addEventListener('click', closeHowToOrderModal);
    document.getElementById('howToOrderOverlay').addEventListener('click', closeHowToOrderModal);
}

// Apply filters and search
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    // Filter products with improved search
    filteredProducts = allProducts.filter(product => {
        // Category filter
        const matchesCategory = !categoryFilter || product.category === categoryFilter;

        // If no search term, just apply category filter
        if (!searchTerm) {
            return matchesCategory;
        }

        // Split search term into words for multi-word search
        const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);

        // Create searchable text from all product fields
        const searchableText = [
            product.name || '',
            product.sku || '',
            product.category || '',
            product.subcategoryName || '',
            product.material || '',
            product.color || '',
            product.size || '',
            product.description || '',
            ...(product.tags || [])
        ].join(' ').toLowerCase();

        // Check if all search words are found in the searchable text
        const matchesSearch = searchWords.every(word => searchableText.includes(word));

        return matchesSearch && matchesCategory;
    });

    // Sort products
    sortProducts(sortBy);

    // Display
    displayProducts();
    updateStats();
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'oldest':
            filteredProducts.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
}

// Display products
function displayProducts() {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');

    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    grid.innerHTML = filteredProducts.map(product => {
        const stockBadge = getStockBadge(product.stock);

        // Handle multiple images or fallback to single image
        const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

        let imageHTML;
        if (images.length === 0) {
            imageHTML = `<div class="product-image-placeholder">🧞</div>`;
        } else if (images.length === 1) {
            imageHTML = `<img src="${images[0]}" alt="${product.name}">`;
        } else {
            // Create carousel for multiple images
            imageHTML = `
                <div class="product-carousel" data-sku="${product.sku}">
                    <div class="carousel-images">
                        ${images.map((img, idx) => `
                            <img src="${img}" alt="${product.name} - Image ${idx + 1}" class="${idx === 0 ? 'active' : ''}" data-index="${idx}">
                        `).join('')}
                    </div>
                    <button class="carousel-btn prev" onclick="event.stopPropagation(); carouselPrev('${product.sku}')">‹</button>
                    <button class="carousel-btn next" onclick="event.stopPropagation(); carouselNext('${product.sku}')">›</button>
                    <div class="carousel-dots">
                        ${images.map((_, idx) => `
                            <span class="dot ${idx === 0 ? 'active' : ''}" onclick="event.stopPropagation(); carouselGoTo('${product.sku}', ${idx})"></span>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return `
            <div class="product-card" onclick="showProductDetail('${product.sku}')">
                <div class="product-image-container">
                    ${imageHTML}
                    ${stockBadge}
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.subcategoryName || product.category}</div>
                    <div class="product-sku">${product.sku}</div>
                    <div class="product-description">${product.description || 'No description'}</div>
                    <div class="product-meta">
                        <span class="meta-tag">📦 ${product.material}</span>
                        <span class="meta-tag">🎨 ${product.color}</span>
                        <span class="meta-tag">📏 ${product.size}</span>
                    </div>
                    <div class="product-footer">
                        <div class="product-price">₹${product.price.toFixed(2)}</div>
                        <div class="product-stock">${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get stock badge
function getStockBadge(stock) {
    if (stock === 0) {
        return '<span class="product-badge out-of-stock">Out of Stock</span>';
    } else if (stock < 5) {
        return '<span class="product-badge low-stock">Low Stock</span>';
    } else if (stock >= 10) {
        return '<span class="product-badge">In Stock</span>';
    }
    return '';
}

// Show product detail modal
window.showProductDetail = function(sku) {
    const product = allProducts.find(p => p.sku === sku);
    if (!product) return;

    // Handle multiple images or fallback to single image
    const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

    // Image Gallery Section
    let imageGalleryHTML;
    if (images.length === 0) {
        imageGalleryHTML = `<div class="product-detail-placeholder">🧞<br><span>No Image</span></div>`;
    } else {
        imageGalleryHTML = `
            <div class="product-detail-gallery">
                <div class="main-image-wrapper">
                    <img src="${images[0]}" id="mainDetailImage" class="main-product-image" alt="${product.name}">
                    ${images.length > 1 ? `
                        <button class="gallery-nav-btn prev" onclick="detailGalleryPrev()">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button class="gallery-nav-btn next" onclick="detailGalleryNext()">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                        <div class="image-indicator">${images.length > 1 ? `1 / ${images.length}` : ''}</div>
                    ` : ''}
                </div>
                ${images.length > 1 ? `
                    <div class="thumbnail-gallery">
                        ${images.map((img, idx) => `
                            <div class="thumbnail-wrapper ${idx === 0 ? 'active' : ''}" data-index="${idx}" onclick="selectDetailImage(${idx})">
                                <img src="${img}" alt="${product.name} - ${idx + 1}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Key Highlights - Use custom highlights if available, otherwise auto-generate
    let highlights = [];
    if (product.highlights && product.highlights.length > 0) {
        // Use custom highlights from admin
        highlights = product.highlights;
    } else {
        // Auto-generate highlights from product data
        if (product.material) highlights.push(`Made with ${product.material}`);
        if (product.color) highlights.push(`Available in ${product.color}`);
        if (product.size) highlights.push(`Size: ${product.size}`);
        if (product.stock > 10) highlights.push('In Stock - Ships Fast');
        else if (product.stock > 0 && product.stock <= 10) highlights.push('Limited Stock Available');
    }

    // Create order message for WhatsApp/Instagram
    const orderMessage = encodeURIComponent(`Hi! I'd like to order:\n\nProduct: ${product.name}\nSKU: ${product.sku}\nPrice: ₹${product.price.toFixed(2)}\n\nPlease confirm availability.`);

    const modalBody = document.getElementById('modalBody');

    // Store images in modal for gallery navigation
    modalBody.dataset.images = JSON.stringify(images);
    modalBody.dataset.currentIndex = '0';

    modalBody.innerHTML = `
        <div class="product-detail-container">
            <!-- Left Column: Image Gallery -->
            <div class="product-detail-left">
                ${imageGalleryHTML}

                <!-- Order Buttons (Desktop) -->
                <div class="order-actions desktop-only">
                    <a href="https://wa.me/919999999999?text=${orderMessage}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="order-btn whatsapp-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Order via WhatsApp
                    </a>
                    <a href="https://instagram.com/direct/t/?text=${orderMessage}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="order-btn instagram-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                        Order via Instagram
                    </a>
                </div>
            </div>

            <!-- Right Column: Product Information -->
            <div class="product-detail-right">
                <!-- Product Title & Category -->
                <div class="product-header">
                    <h1 class="product-title">${product.name}</h1>
                    <p class="product-category-tag">${product.subcategoryName || product.category}</p>
                </div>

                <!-- Price Section -->
                <div class="price-section">
                    <div class="price-main">₹${product.price.toFixed(2)}</div>
                    <div class="stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
                    </div>
                </div>

                <!-- Key Highlights -->
                ${highlights.length > 0 ? `
                    <div class="highlights-section">
                        <h3 class="section-title">Key Highlights</h3>
                        <ul class="highlights-list">
                            ${highlights.map(h => `<li><span class="check-icon">✓</span> ${h}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <!-- Specifications Table -->
                <div class="specifications-section">
                    <h3 class="section-title">Product Specifications</h3>
                    <table class="specs-table">
                        <tbody>
                            <tr>
                                <td class="spec-label">SKU</td>
                                <td class="spec-value"><code>${product.sku}</code></td>
                            </tr>
                            <tr>
                                <td class="spec-label">Material</td>
                                <td class="spec-value">${product.material}</td>
                            </tr>
                            <tr>
                                <td class="spec-label">Color</td>
                                <td class="spec-value">${product.color}</td>
                            </tr>
                            <tr>
                                <td class="spec-label">Size</td>
                                <td class="spec-value">${product.size}</td>
                            </tr>
                            <tr>
                                <td class="spec-label">Category</td>
                                <td class="spec-value">${product.category}</td>
                            </tr>
                            ${product.subcategoryName ? `
                                <tr>
                                    <td class="spec-label">Subcategory</td>
                                    <td class="spec-value">${product.subcategoryName}</td>
                                </tr>
                            ` : ''}
                        </tbody>
                    </table>
                </div>

                <!-- Description -->
                ${product.description ? `
                    <div class="description-section">
                        <h3 class="section-title">Product Description</h3>
                        <p class="description-text">${product.description}</p>
                    </div>
                ` : ''}

                <!-- Tags -->
                ${product.tags.length > 0 ? `
                    <div class="tags-section">
                        <h3 class="section-title">Tags</h3>
                        <div class="product-tags">
                            ${product.tags.map(tag => `<span class="product-tag">#${tag}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Order Buttons (Mobile) -->
                <div class="order-actions mobile-only">
                    <a href="https://wa.me/919999999999?text=${orderMessage}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="order-btn whatsapp-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                    </a>
                    <a href="https://instagram.com/direct/t/?text=${orderMessage}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="order-btn instagram-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                        Instagram
                    </a>
                </div>

                <!-- Additional Info -->
                <div class="additional-info">
                    <p class="info-text"><strong>Listed on:</strong> ${new Date(product.dateAdded).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="info-text"><strong>Product ID:</strong> ${product.sku}</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('productModal').classList.add('active');
};

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Update stats
function updateStats() {
    document.getElementById('totalProducts').textContent = allProducts.length;
    document.getElementById('totalCategories').textContent = categories.size;
    document.getElementById('showingCount').textContent = filteredProducts.length;
}

// Update catalog info
function updateCatalogInfo(data) {
    const info = document.getElementById('catalogInfo');
    if (data && data.lastUpdated) {
        const updateDate = new Date(data.lastUpdated).toLocaleDateString();
        info.textContent = `${allProducts.length} Products Available • Updated ${updateDate}`;
    } else {
        info.textContent = `${allProducts.length} Products Available`;
    }
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortBy').value = 'newest';
    applyFilters();
}

// Setup share link
function setupShareLink() {
    const shareUrl = window.location.href;
    const shareLinkInput = document.getElementById('shareLinkInput');
    if (shareLinkInput) {
        shareLinkInput.value = shareUrl;
    }
}

// Open share modal
function openShareModal() {
    setupShareLink();
    generateQRCode();
    document.getElementById('shareModal').classList.add('active');
}

// Close share modal
function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
}

// Copy share link
function copyShareLink() {
    const input = document.getElementById('shareLinkInput');
    input.select();
    document.execCommand('copy');

    const btn = document.getElementById('copyLinkBtn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background = 'var(--success-color)';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

// Share via platform
function shareVia(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out Print Genie\'s 3D printing catalog!');

    let shareUrl;

    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=Print%20Genie%20Catalog&body=${text}%20${url}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

// Generate QR Code (simple implementation)
function generateQRCode() {
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    const url = window.location.href;

    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;

    // Simple QR code alternative - generate using Google Charts API
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(url)}&chs=200x200`;

    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, 200, 200);
    };
    img.src = qrUrl;
}

// Show error
function showError(message) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <h3 style="color: var(--danger-color); font-size: 1.5rem;">⚠️ Error</h3>
            <p style="color: var(--text-secondary); margin-top: 10px;">${message}</p>
        </div>
    `;
}

// Show empty state
function showEmptyState(message) {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');

    grid.innerHTML = '';
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
        <h3>📦 ${message}</h3>
        <p>Products will appear here once they are added to the catalog.</p>
    `;
}

// How to Order modal functions
function openHowToOrderModal() {
    document.getElementById('howToOrderModal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeHowToOrderModal() {
    document.getElementById('howToOrderModal').classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Contact link
document.getElementById('contactLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Contact us at:\n\nEmail: contact@printgenie.com\nPhone: +91 XXXXX XXXXX\n\nWe\'d love to hear from you!');
});

// Prevent directory browsing attempts
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    // Already handled by root index.html redirect
}

// Hide admin link from source
window.__adminUrl = 'public/admin.html'; // Obfuscated admin access

// Carousel control functions
window.carouselNext = function(sku) {
    const carousel = document.querySelector(`.product-carousel[data-sku="${sku}"]`);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-images img');
    const dots = carousel.querySelectorAll('.carousel-dots .dot');
    let currentIndex = 0;

    images.forEach((img, idx) => {
        if (img.classList.contains('active')) {
            currentIndex = idx;
            img.classList.remove('active');
            dots[idx].classList.remove('active');
        }
    });

    const nextIndex = (currentIndex + 1) % images.length;
    images[nextIndex].classList.add('active');
    dots[nextIndex].classList.add('active');
};

window.carouselPrev = function(sku) {
    const carousel = document.querySelector(`.product-carousel[data-sku="${sku}"]`);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-images img');
    const dots = carousel.querySelectorAll('.carousel-dots .dot');
    let currentIndex = 0;

    images.forEach((img, idx) => {
        if (img.classList.contains('active')) {
            currentIndex = idx;
            img.classList.remove('active');
            dots[idx].classList.remove('active');
        }
    });

    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    images[prevIndex].classList.add('active');
    dots[prevIndex].classList.add('active');
};

window.carouselGoTo = function(sku, index) {
    const carousel = document.querySelector(`.product-carousel[data-sku="${sku}"]`);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-images img');
    const dots = carousel.querySelectorAll('.carousel-dots .dot');

    images.forEach((img, idx) => {
        img.classList.remove('active');
        dots[idx].classList.remove('active');
    });

    images[index].classList.add('active');
    dots[index].classList.add('active');
};

// Detail modal gallery controls
window.selectDetailImage = function(index) {
    const modalBody = document.getElementById('modalBody');
    const images = JSON.parse(modalBody.dataset.images || '[]');

    if (images.length === 0) return;

    modalBody.dataset.currentIndex = index.toString();

    const mainImage = document.getElementById('mainDetailImage');
    const thumbnailWrappers = document.querySelectorAll('.thumbnail-gallery .thumbnail-wrapper');
    const counter = document.querySelector('.image-indicator');

    if (mainImage) mainImage.src = images[index];
    if (counter) counter.textContent = `${index + 1} / ${images.length}`;

    // Update active thumbnail
    thumbnailWrappers.forEach((wrapper, idx) => {
        wrapper.classList.toggle('active', idx === index);
    });
};

window.detailGalleryNext = function() {
    const modalBody = document.getElementById('modalBody');
    const images = JSON.parse(modalBody.dataset.images || '[]');
    const currentIndex = parseInt(modalBody.dataset.currentIndex || '0');

    if (images.length === 0) return;

    const nextIndex = (currentIndex + 1) % images.length;
    selectDetailImage(nextIndex);
};

window.detailGalleryPrev = function() {
    const modalBody = document.getElementById('modalBody');
    const images = JSON.parse(modalBody.dataset.images || '[]');
    const currentIndex = parseInt(modalBody.dataset.currentIndex || '0');

    if (images.length === 0) return;

    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    selectDetailImage(prevIndex);
};
