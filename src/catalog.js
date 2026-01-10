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

    let imageHTML;
    if (images.length === 0) {
        imageHTML = `<div class="product-detail-placeholder">🧞</div>`;
    } else if (images.length === 1) {
        imageHTML = `<img src="${images[0]}" class="product-detail-image" alt="${product.name}">`;
    } else {
        // Create gallery for multiple images
        imageHTML = `
            <div class="detail-image-gallery">
                <div class="main-image-container">
                    <img src="${images[0]}" id="mainDetailImage" class="product-detail-image" alt="${product.name}">
                    <button class="gallery-btn prev" onclick="detailGalleryPrev()">‹</button>
                    <button class="gallery-btn next" onclick="detailGalleryNext()">›</button>
                    <div class="image-counter">1 / ${images.length}</div>
                </div>
                <div class="thumbnail-strip">
                    ${images.map((img, idx) => `
                        <img src="${img}"
                             class="thumbnail ${idx === 0 ? 'active' : ''}"
                             alt="${product.name} - ${idx + 1}"
                             data-index="${idx}"
                             onclick="selectDetailImage(${idx})">
                    `).join('')}
                </div>
            </div>
        `;
    }

    const tagsHTML = product.tags.length > 0
        ? `<div class="product-tags">${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
        : '';

    const modalBody = document.getElementById('modalBody');

    // Store images in modal for gallery navigation
    modalBody.dataset.images = JSON.stringify(images);
    modalBody.dataset.currentIndex = '0';

    modalBody.innerHTML = `
        <div class="product-detail">
            ${imageHTML}

            <div class="detail-section">
                <h2>${product.name}</h2>
                <p style="color: var(--text-secondary); font-size: 1.1rem;">${product.subcategoryName || product.category}</p>
            </div>

            <div class="detail-section">
                <h3>Product Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>SKU</label>
                        <strong>${product.sku}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Price</label>
                        <strong style="color: var(--primary-color); font-size: 1.5rem;">₹${product.price.toFixed(2)}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Material</label>
                        <strong>${product.material}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Color</label>
                        <strong>${product.color}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Size</label>
                        <strong>${product.size}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Stock</label>
                        <strong style="color: ${product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                            ${product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                        </strong>
                    </div>
                </div>
            </div>

            ${product.description ? `
                <div class="detail-section">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                </div>
            ` : ''}

            ${tagsHTML ? `
                <div class="detail-section">
                    <h3>Tags</h3>
                    ${tagsHTML}
                </div>
            ` : ''}

            <div class="detail-section">
                <h3>Additional Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Category</label>
                        <strong>${product.category}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Date Added</label>
                        <strong>${new Date(product.dateAdded).toLocaleDateString()}</strong>
                    </div>
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
    const thumbnails = document.querySelectorAll('.thumbnail-strip .thumbnail');
    const counter = document.querySelector('.image-counter');

    if (mainImage) mainImage.src = images[index];
    if (counter) counter.textContent = `${index + 1} / ${images.length}`;

    thumbnails.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
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
