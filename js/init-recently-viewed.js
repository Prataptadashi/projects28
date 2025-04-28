console.log('init-recently-viewed.js loaded successfully');
// Initialize products array first
const products = [
    { id: 1, name: "Smartphone", price: 1000, rating: 4.5, image: "/images/p1.png", category: "Electronics" },
    { id: 2, name: "T-Shirt", price: 20, rating: 4.2, image: "/images/c2.png", category: "Clothing" },
    // ... rest of the products array
];

// Initialize RecentlyViewedProducts after products array is defined
const recentlyViewed = new RecentlyViewedProducts();

function displayRecentlyViewed() {
    try {
        console.log('Displaying recently viewed products...');
        const products = recentlyViewed.getRecentlyViewed();
        console.log('Retrieved products:', products);
        
        const container = document.getElementById('recentlyViewedProducts');
        console.log('Container element:', container);
        
        if (container) {
            container.innerHTML = products.map(item => `
                <div class="product-card">
                    <img src="${item.productData.image}" alt="${item.productData.name}" class="product-image">
                    <h5 class="mt-2">${item.productData.name}</h5>
                    <p class="text-primary mb-2">$${item.productData.price.toFixed(2)}</p>
                    <a href="product-detail.html?id=${item.productId}" class="btn btn-primary btn-sm w-100">View Details</a>
                </div>
            `).join('');
            
            // Add some test data if no products are viewed yet
            if (!products.length) {
                recentlyViewed.logProductView(1); // Log first product as viewed
                recentlyViewed.logProductView(2); // Log second product as viewed
                displayRecentlyViewed(); // Refresh display
            }
        } else {
            console.error('Recently viewed products container not found');
        }
    } catch (error) {
        console.error('Error displaying recently viewed products:', error);
    }
}

function scrollProducts(direction) {
    const container = document.querySelector('.products-scroll');
    const scrollAmount = 220; // card width + gap
    
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing recently viewed products...');
    displayRecentlyViewed();
});