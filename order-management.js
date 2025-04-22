// Show notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Order Management</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Get status badge class
function getStatusBadgeClass(status) {
    const classes = {
        'pending': 'bg-warning',
        'processing': 'bg-info',
        'shipped': 'bg-primary',
        'delivered': 'bg-success',
        'cancelled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
}

// Update orders table
function updateOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    console.log('Current orders:', orders); // Add this debug line
    
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesDate = !dateFilter || order.date === dateFilter;
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    const tbody = document.getElementById('orderTable');
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.customerName || 'Guest'}</td>
            <td>₹${order.total}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(order.status)} status-badge"
                      onclick="openStatusModal(${order.id})">
                    ${order.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info me-2" onclick="toggleOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
        <tr id="details-${order.id}" class="order-details">
            <td colspan="6">
                <div class="p-3">
                    <h6>Order Items:</h6>
                    <ul class="list-group">
                        ${order.items.map(item => `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                ${item.name}
                                <span>
                                    ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}
                                </span>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="mt-3">
                        <strong>Shipping Address:</strong>
                        <p class="mb-0">${order.address}</p>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// Toggle order details
function toggleOrderDetails(orderId) {
    const detailsRow = document.getElementById(`details-${orderId}`);
    detailsRow.classList.toggle('show');
}

// Open status update modal
function openStatusModal(orderId) {
    selectedOrderId = orderId;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        document.getElementById('newStatus').value = order.status;
        new bootstrap.Modal(document.getElementById('statusModal')).show();
    }
}

// Update order status
function updateOrderStatus() {
    const newStatus = document.getElementById('newStatus').value;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === selectedOrderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        updateOrdersTable();
        bootstrap.Modal.getInstance(document.getElementById('statusModal')).hide();
        showToast('Order status updated successfully');
    }
}

// Delete order
function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const updatedOrders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        updateOrdersTable();
        showToast('Order deleted successfully');
    }
}

// Export orders
function exportOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const csv = [
        ['Order ID', 'Date', 'Customer', 'Total', 'Status', 'Items', 'Address'],
        ...orders.map(order => [
            order.id,
            order.date,
            order.customerName || 'Guest',
            order.total,
            order.status,
            order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
            order.address
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Initialize sample orders immediately
const sampleOrders = [
    {
        id: 1,
        date: '2024-03-20',
        customerName: 'John Doe',
        items: [
            { id: 1, name: "iPhone 15", price: 999, quantity: 1, image: "images/p1.png" },
            { id: 2, name: "AirPods Pro", price: 249, quantity: 1, image: "images/p2.png" }
        ],
        total: 1248,
        status: 'delivered',
        address: '123 Apple Street, Tech City, TC 12345'
    },
    {
        id: 2,
        date: '2024-03-19',
        customerName: 'Sarah Smith',
        items: [
            { id: 3, name: "Nike Air Max", price: 129, quantity: 2, image: "images/p3.png" }
        ],
        total: 258,
        status: 'processing',
        address: '456 Nike Road, Sports Town, ST 67890'
    },
    {
        id: 3,
        date: '2024-03-18',
        customerName: 'Mike Johnson',
        items: [
            { id: 4, name: "Gaming Laptop", price: 1499, quantity: 1, image: "images/p4.png" },
            { id: 5, name: "Gaming Mouse", price: 79, quantity: 1, image: "images/p5.png" },
            { id: 6, name: "Gaming Keyboard", price: 129, quantity: 1, image: "images/p6.png" }
        ],
        total: 1707,
        status: 'shipped',
        address: '789 Gamer Lane, Play City, PC 13579'
    },
    {
        id: 4,
        date: '2024-03-17',
        customerName: 'Emma Davis',
        items: [
            { id: 7, name: "Yoga Mat", price: 29, quantity: 1, image: "images/p7.png" },
            { id: 8, name: "Resistance Bands", price: 19, quantity: 2, image: "images/p8.png" }
        ],
        total: 67,
        status: 'pending',
        address: '321 Fitness Blvd, Health City, HC 24680'
    },
    {
        id: 5,
        date: '2024-03-16',
        customerName: 'Tom Wilson',
        items: [
            { id: 9, name: "Smart TV", price: 799, quantity: 1, image: "images/p9.png" },
            { id: 10, name: "Soundbar", price: 299, quantity: 1, image: "images/p10.png" }
        ],
        total: 1098,
        status: 'cancelled',
        address: '654 Entertainment Ave, Media City, MC 97531'
    }
];

// Clear existing orders and set sample data (for testing)
localStorage.setItem('orders', JSON.stringify(sampleOrders));

let selectedOrderId = null;

// Modify the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        updateOrdersTable();
        
        // Add event listeners for filters
        document.getElementById('orderSearch').addEventListener('input', updateOrdersTable);
        document.getElementById('statusFilter').addEventListener('change', updateOrdersTable);
        document.getElementById('dateFilter').addEventListener('change', updateOrdersTable);
    }, 100);
});