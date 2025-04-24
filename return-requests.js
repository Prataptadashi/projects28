// First, declare the sample data
const sampleReturns = [
    {
        id: 1,
        orderId: 1001,
        userId: 1,
        userName: "John Doe",
        productId: 1,
        productName: "Laptop XPS 15",
        reason: "Product arrived damaged - visible dents on the corner and screen not working properly",
        status: "Requested",
        requested_at: "2024-04-23T10:00:00",
        reviewed_at: null,
        refund_amount: 1499.99
    },
    {
        id: 2,
        orderId: 1002,
        userId: 2,
        userName: "Jane Smith",
        productId: 2,
        productName: "iPhone 15 Pro",
        reason: "Wrong color received. Ordered Gold but received Black",
        status: "Approved",
        requested_at: "2024-04-22T15:30:00",
        reviewed_at: "2024-04-22T16:00:00",
        refund_amount: 999.99
    },
    {
        id: 3,
        orderId: 1003,
        userId: 3,
        userName: "Bob Wilson",
        productId: 3,
        productName: "Sony WH-1000XM4",
        reason: "Not satisfied with noise cancellation quality",
        status: "Refunded",
        requested_at: "2024-04-21T09:15:00",
        reviewed_at: "2024-04-21T10:00:00",
        refund_amount: 349.99
    }
];

// Add these functions for handling return actions
function approveReturn(returnId) {
    const returns = JSON.parse(localStorage.getItem('returnRequests')) || [];
    const returnIndex = returns.findIndex(r => r.id === returnId);
    
    if (returnIndex !== -1) {
        returns[returnIndex].status = 'Approved';
        returns[returnIndex].reviewed_at = new Date().toISOString();
        localStorage.setItem('returnRequests', JSON.stringify(returns));
        updateReturnRequestsTable();
        showToast('Return request approved successfully');
    }
}

function rejectReturn(returnId) {
    const returns = JSON.parse(localStorage.getItem('returnRequests')) || [];
    const returnIndex = returns.findIndex(r => r.id === returnId);
    
    if (returnIndex !== -1) {
        returns[returnIndex].status = 'Rejected';
        returns[returnIndex].reviewed_at = new Date().toISOString();
        localStorage.setItem('returnRequests', JSON.stringify(returns));
        updateReturnRequestsTable();
        showToast('Return request rejected', 'danger');
    }
}

function markAsRefunded(returnId) {
    const returns = JSON.parse(localStorage.getItem('returnRequests')) || [];
    const returnIndex = returns.findIndex(r => r.id === returnId);
    
    if (returnIndex !== -1) {
        returns[returnIndex].status = 'Refunded';
        returns[returnIndex].refunded_at = new Date().toISOString();
        localStorage.setItem('returnRequests', JSON.stringify(returns));
        updateReturnRequestsTable();
        showToast('Return marked as refunded');
    }
}

let selectedReturnId = null;

// Show notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Return Request</strong>
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
    switch(status) {
        case 'Requested': return 'bg-warning';
        case 'Approved': return 'bg-success';
        case 'Rejected': return 'bg-danger';
        case 'Refunded': return 'bg-info';
        default: return 'bg-secondary';
    }
}

// Update return requests table
// Force clear and reinitialize data
localStorage.clear();
localStorage.setItem('returnRequests', JSON.stringify(sampleReturns));

// Update the initialization code
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Log current data
    const currentData = JSON.parse(localStorage.getItem('returnRequests'));
    console.log('Current data:', currentData);
    
    // Force update table
    updateReturnRequestsTable();
    
    // Add event listeners for filters
    document.getElementById('searchInput').addEventListener('input', updateReturnRequestsTable);
    document.getElementById('statusFilter').addEventListener('change', updateReturnRequestsTable);
});

// Add error handling to updateReturnRequestsTable
function updateReturnRequestsTable() {
    try {
        const returns = JSON.parse(localStorage.getItem('returnRequests')) || [];
        console.log('Updating table with data:', returns);
        
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        
        const filteredReturns = returns.filter(request => {
            const matchesSearch = 
                request.userName.toLowerCase().includes(searchTerm) ||
                request.productName.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
        
        const tbody = document.getElementById('returnRequestsTable');
        if (!tbody) {
            console.error('Table body element not found');
            return;
        }
        
        tbody.innerHTML = filteredReturns.map(request => `
            <tr>
                <td>#${request.orderId}</td>
                <td>${request.userName}</td>
                <td>${request.productName}</td>
                <td>${request.reason.substring(0, 50)}...</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(request.status)} status-badge">
                        ${request.status}
                    </span>
                </td>
                <td>
                    ${getActionButtons(request)}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error updating table:', error);
    }
}

// Get action buttons based on status
// Add this function to show return details
function showReturnDetails(returnId) {
    const returns = JSON.parse(localStorage.getItem('returnRequests')) || [];
    const returnRequest = returns.find(r => r.id === returnId);
    
    if (returnRequest) {
        document.getElementById('detailOrderId').textContent = returnRequest.orderId;
        document.getElementById('detailCustomer').textContent = returnRequest.userName;
        document.getElementById('detailProduct').textContent = returnRequest.productName;
        document.getElementById('detailStatus').textContent = returnRequest.status;
        document.getElementById('detailRequestedDate').textContent = new Date(returnRequest.requested_at).toLocaleString();
        document.getElementById('detailReviewedDate').textContent = returnRequest.reviewed_at ? new Date(returnRequest.reviewed_at).toLocaleString() : 'Not reviewed yet';
        document.getElementById('detailRefundAmount').textContent = returnRequest.refund_amount.toFixed(2);
        document.getElementById('detailReason').textContent = returnRequest.reason;
        
        new bootstrap.Modal(document.getElementById('detailsModal')).show();
    }
}

// Update the getActionButtons function to include View Details button
function getActionButtons(request) {
    let buttons = `
        <button class="btn btn-sm btn-info me-1" onclick="showReturnDetails(${request.id})">
            <i class="fas fa-eye"></i> View
        </button>
    `;
    
    if (request.status === 'Requested') {
        buttons += `
            <button class="btn btn-sm btn-success me-1" onclick="approveReturn(${request.id})">
                <i class="fas fa-check"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="rejectReturn(${request.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
    } else if (request.status === 'Approved') {
        buttons += `
            <button class="btn btn-sm btn-primary" onclick="markAsRefunded(${request.id})">
                <i class="fas fa-dollar-sign"></i>
            </button>
        `;
    }
    return buttons;
}