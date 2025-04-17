// Initialize sample sellers if not exists
if (!localStorage.getItem('sellers')) {
    const sampleSellers = [
        {
            id: 1,
            name: "John Smith",
            company_name: "Tech Solutions Inc",
            email: "john@techsolutions.com",
            phone: "123-456-7890",
            status: "Pending",
            created_at: "2024-03-15"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            company_name: "Fashion Hub",
            email: "sarah@fashionhub.com",
            phone: "234-567-8901",
            status: "Approved",
            created_at: "2024-03-14"
        },
        {
            id: 3,
            name: "Mike Davis",
            company_name: "Electronics World",
            email: "mike@electronics.com",
            phone: "345-678-9012",
            status: "Blocked",
            created_at: "2024-03-13"
        }
    ];
    localStorage.setItem('sellers', JSON.stringify(sampleSellers));
}

// Function to get status badge class
function getStatusBadgeClass(status) {
    switch (status) {
        case 'Approved':
            return 'bg-success';
        case 'Blocked':
            return 'bg-danger';
        default:
            return 'bg-warning';
    }
}

// Function to show notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Seller Management</strong>
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

// Function to update sellers table
function updateSellersTable() {
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredSellers = sellers.filter(seller => {
        const matchesSearch = 
            seller.name.toLowerCase().includes(searchTerm) ||
            seller.company_name.toLowerCase().includes(searchTerm) ||
            seller.email.toLowerCase().includes(searchTerm) ||
            seller.phone.includes(searchTerm);
            
        const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('sellersTable');
    tbody.innerHTML = filteredSellers.map(seller => `
        <tr>
            <td>${seller.name}</td>
            <td>${seller.company_name}</td>
            <td>${seller.email}</td>
            <td>${seller.phone}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(seller.status)} status-badge">
                    ${seller.status}
                </span>
            </td>
            <td>
                ${seller.status === 'Pending' ? `
                    <button class="btn btn-sm btn-success" onclick="handleStatusChange(${seller.id}, 'Approve')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                ` : seller.status === 'Approved' ? `
                    <button class="btn btn-sm btn-danger" onclick="handleStatusChange(${seller.id}, 'Block')">
                        <i class="fas fa-ban"></i> Block
                    </button>
                ` : `
                    <button class="btn btn-sm btn-warning" onclick="handleStatusChange(${seller.id}, 'Unblock')">
                        <i class="fas fa-unlock"></i> Unblock
                    </button>
                `}
            </td>
        </tr>
    `).join('');
}

// Function to handle status change
function handleStatusChange(sellerId, action) {
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const actionType = document.getElementById('actionType');
    const confirmBtn = document.getElementById('confirmAction');
    
    actionType.textContent = action.toLowerCase();
    
    confirmBtn.onclick = () => {
        const sellers = JSON.parse(localStorage.getItem('sellers'));
        const seller = sellers.find(s => s.id === sellerId);
        
        if (seller) {
            switch (action) {
                case 'Approve':
                    seller.status = 'Approved';
                    break;
                case 'Block':
                    seller.status = 'Blocked';
                    break;
                case 'Unblock':
                    seller.status = 'Approved';
                    break;
            }
            
            localStorage.setItem('sellers', JSON.stringify(sellers));
            updateSellersTable();
            showToast(`Seller ${action.toLowerCase()}d successfully`);
        }
        
        modal.hide();
    };
    
    modal.show();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateSellersTable();
    
    // Add event listeners for search and filter
    document.getElementById('searchInput').addEventListener('input', updateSellersTable);
    document.getElementById('statusFilter').addEventListener('change', updateSellersTable);
});