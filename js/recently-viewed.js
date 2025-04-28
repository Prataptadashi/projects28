console.log('recently-viewed.js loaded successfully');
class RecentlyViewedProducts {
    constructor() {
        this.maxItems = 6;
        this.storageKey = 'recentlyViewedProducts';
        this.products = products; // Using the provided products array
    }

    logProductView(productId) {
        const userId = localStorage.getItem('userId') || 'guest';
        const currentTime = new Date().toISOString();
        
        let recentlyViewed = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        if (!recentlyViewed[userId]) {
            recentlyViewed[userId] = [];
        }

        // Remove if product already exists
        recentlyViewed[userId] = recentlyViewed[userId].filter(item => item.productId !== productId);

        // Add new view
        const product = this.products.find(p => p.id === productId);
        if (product) {
            recentlyViewed[userId].unshift({
                productId,
                viewedAt: currentTime,
                productData: product
            });

            // Keep only latest 6 items
            recentlyViewed[userId] = recentlyViewed[userId].slice(0, this.maxItems);
            localStorage.setItem(this.storageKey, JSON.stringify(recentlyViewed));
        }
    }

    getRecentlyViewed() {
        const userId = localStorage.getItem('userId') || 'guest';
        const recentlyViewed = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        return recentlyViewed[userId] || [];
    }
}