function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const itemCountElement = document.getElementById('items-in-cart');
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        
        cartContainer.innerHTML += `
            <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover;">
                <div class="flex-grow-1 mx-3">
                    <h5>${item.name}</h5>
                    <p>₹${item.price}</p>
                </div>
                <div class="quantity-controls d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${(item.quantity || 1) - 1})">-</button>
                    <span class="mx-2">${item.quantity || 1}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${(item.quantity || 1) + 1})">+</button>
                </div>
                <div class="ms-3">
                    <p>₹${itemTotal}</p>
                </div>
                <button class="btn btn-danger ms-3" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });

    totalElement.textContent = `₹${total}`;
    itemCountElement.textContent = cart.length;
}

function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = (cartItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', displayCart);