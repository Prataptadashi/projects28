let selectedCustomerId = null;

// Show notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Customer Management</strong>
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
    return status === 'Active' ? 'bg-success' : 'bg-danger';
}

// Update customers table
function updateCustomersTable() {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = 
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.phone.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('customerTable');
    tbody.innerHTML = filteredCustomers.map(customer => `
        <tr>
            <td>#${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(customer.status)} status-badge"
                      onclick="openStatusModal(${customer.id})">
                    ${customer.status}
                </span>
            </td>
            <td>${new Date(customer.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openStatusModal(${customer.id})">
                    Change Status
                </button>
            </td>
        </tr>
    `).join('');
}

// Open status update modal
function openStatusModal(customerId) {
    selectedCustomerId = customerId;
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const customer = customers.find(c => c.id === customerId);
    
    if (customer) {
        document.getElementById('newStatus').value = customer.status;
        new bootstrap.Modal(document.getElementById('statusModal')).show();
    }
}

// Update customer status
function updateCustomerStatus() {
    const newStatus = document.getElementById('newStatus').value;
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const customerIndex = customers.findIndex(c => c.id === selectedCustomerId);
    
    if (customerIndex !== -1) {
        customers[customerIndex].status = newStatus;
        localStorage.setItem('customers', JSON.stringify(customers));
        updateCustomersTable();
        bootstrap.Modal.getInstance(document.getElementById('statusModal')).hide();
        showToast(`Customer status updated to ${newStatus}`);
    }
}

// Initialize sample customers immediately
const sampleCustomers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        status: 'Active',
        created_at: '2024-04-22T10:00:00'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '234-567-8901',
        status: 'Active',
        created_at: '2024-04-21T15:30:00'
    },
    {
        id: 3,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '345-678-9012',
        status: 'Blocked',
        created_at: '2024-04-20T09:15:00'
    },
    {
        id: 4,
        name: 'Alice Brown',
        email: 'alice@example.com',
        phone: '456-789-0123',
        status: 'Active',
        created_at: '2024-04-19T14:45:00'
    },
    {
        id: 5,
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        phone: '567-890-1234',
        status: 'Blocked',
        created_at: '2024-04-18T11:20:00'
    }
];

// Remove this duplicate declaration
// let selectedCustomerId = null; <- REMOVE THIS LINE

// Initialize data
localStorage.setItem('customers', JSON.stringify(sampleCustomers));

// Initialize when DOM is ready
window.addEventListener('load', () => {
    updateCustomersTable();
    
    // Add event listeners for filters
    document.getElementById('searchInput').addEventListener('input', updateCustomersTable);
    document.getElementById('statusFilter').addEventListener('change', updateCustomersTable);
});