// Initialize sample inventory if not exists
if (!localStorage.getItem('inventory')) {
    const sampleInventory = [
        {
            id: 1,
            name: "Laptop Pro X",
            seller_id: 1,
            seller_name: "Tech Solutions Inc",
            stock_quantity: 15,
            price: 999.99,
            status: "Active",
            updated_at: new Date().toISOString()
        },
        {
            id: 2,
            name: "Smartphone Y",
            seller_id: 1,
            seller_name: "Tech Solutions Inc",
            stock_quantity: 3,
            price: 599.99,
            status: "Active",
            updated_at: new Date().toISOString()
        },
        {
            id: 3,
            name: "Designer T-shirt",
            seller_id: 2,
            seller_name: "Fashion Hub",
            stock_quantity: 0,
            price: 29.99,
            status: "Out of Stock",
            updated_at: new Date().toISOString()
        }
    ];
    localStorage.setItem('inventory', JSON.stringify(sampleInventory));
}

// Function to get status badge class
function getStatusBadgeClass(status) {
    switch (status) {
        case 'Active':
            return 'bg-success';
        case 'Inactive':
            return 'bg-warning';
        case 'Out of Stock':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Function to show notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Inventory Update</strong>
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

// Function to update inventory table
function updateInventoryTable() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredInventory = inventory.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('inventoryTable');
    tbody.innerHTML = filteredInventory.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.seller_name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td class="${product.stock_quantity < 5 ? 'low-stock' : ''}">
                ${product.stock_quantity}
                ${product.stock_quantity < 5 ? '<span class="badge bg-danger">Low Stock</span>' : ''}
            </td>
            <td>
                <span class="badge ${getStatusBadgeClass(product.status)} status-badge">
                    ${product.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="openStockModal(${product.id})">
                    <i class="fas fa-edit"></i> Update Stock
                </button>
                <select class="form-select form-select-sm d-inline-block w-auto" 
                        onchange="updateStatus(${product.id}, this.value)">
                    <option value="Active" ${product.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Inactive" ${product.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    <option value="Out of Stock" ${product.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                </select>
            </td>
        </tr>
    `).join('');
}

// Function to open stock update modal
function openStockModal(productId) {
    const modal = new bootstrap.Modal(document.getElementById('stockModal'));
    const confirmBtn = document.getElementById('confirmStockUpdate');
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    const product = inventory.find(p => p.id === productId);
    
    document.getElementById('stockQuantity').value = product.stock_quantity;
    
    confirmBtn.onclick = () => {
        const newQuantity = parseInt(document.getElementById('stockQuantity').value);
        if (newQuantity >= 0) {
            product.stock_quantity = newQuantity;
            product.updated_at = new Date().toISOString();
            product.status = newQuantity === 0 ? 'Out of Stock' : product.status;
            
            localStorage.setItem('inventory', JSON.stringify(inventory));
            updateInventoryTable();
            showToast(`Stock quantity updated for ${product.name}`);
            modal.hide();
        } else {
            showToast('Please enter a valid quantity', 'danger');
        }
    };
    
    modal.show();
}

// Function to update product status
function updateStatus(productId, newStatus) {
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    const product = inventory.find(p => p.id === productId);
    
    if (product) {
        product.status = newStatus;
        product.updated_at = new Date().toISOString();
        localStorage.setItem('inventory', JSON.stringify(inventory));
        updateInventoryTable();
        showToast(`Status updated for ${product.name}`);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateInventoryTable();
    
    // Add event listeners for search and filter
    document.getElementById('searchInput').addEventListener('input', updateInventoryTable);
    document.getElementById('statusFilter').addEventListener('change', updateInventoryTable);
});