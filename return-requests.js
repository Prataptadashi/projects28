// Clear existing return requests data (add this line)
localStorage.removeItem('returnRequests');

// Initialize sample return requests if not exists
if (!localStorage.getItem('returnRequests')) {
    const sampleReturnRequests = [
        {
            id: 1,
            orderId: "ORD001",
            customerId: 1,
            customerName: "John Doe",
            productName: "Laptop",
            reason: "Defective screen - Display flickering",
            status: "Pending",
            date: "2024-03-15"
        },
        {
            id: 2,
            orderId: "ORD002",
            customerId: 2,
            customerName: "Jane Smith",
            productName: "Smartphone",
            reason: "Wrong color received - Ordered black, got white",
            status: "Approved",
            date: "2024-03-14"
        },
        {
            id: 3,
            orderId: "ORD003",
            customerId: 3,
            customerName: "Mike Johnson",
            productName: "T-shirt",
            reason: "Size mismatch - Too small",
            status: "Rejected",
            date: "2024-03-13"
        },
        {
            id: 4,
            orderId: "ORD004",
            customerId: 4,
            customerName: "Sarah Williams",
            productName: "Book",
            reason: "Damaged during shipping - Pages torn",
            status: "Pending",
            date: "2024-03-16"
        },
        {
            id: 5,
            orderId: "ORD005",
            customerId: 5,
            customerName: "David Brown",
            productName: "Jeans",
            reason: "Quality issue - Stitching coming apart",
            status: "Pending",
            date: "2024-03-17"
        }
    ];
    localStorage.setItem('returnRequests', JSON.stringify(sampleReturnRequests));
}

// Add console log to debug (add this after localStorage.setItem)
console.log('Return Requests:', JSON.parse(localStorage.getItem('returnRequests')));

// Function to get status badge class
function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'approved':
            return 'bg-success';
        case 'rejected':
            return 'bg-danger';
        default:
            return 'bg-warning';
    }
}

// Function to update return requests table
function updateReturnRequestsTable() {
    const requests = JSON.parse(localStorage.getItem('returnRequests')) || [];
    const tbody = document.getElementById('returnRequestsTable');
    
    // Add console log to debug
    console.log('Updating table with requests:', requests);
    
    tbody.innerHTML = requests.map(request => `
        <tr>
            <td>${request.orderId}</td>
            <td>${request.customerName}</td>
            <td>${request.productName}</td>
            <td>${request.reason}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(request.status)} status-badge">
                    ${request.status}
                </span>
            </td>
            <td>
                ${request.status === 'Pending' ? `
                    <button class="btn btn-sm btn-success me-2" onclick="handleStatusChange(${request.id}, 'Approve')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="handleStatusChange(${request.id}, 'Reject')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Function to show notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Return Request Update</strong>
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

// Function to handle status change
function handleStatusChange(requestId, action) {
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const actionType = document.getElementById('actionType');
    const confirmBtn = document.getElementById('confirmAction');
    
    actionType.textContent = action.toLowerCase();
    
    confirmBtn.onclick = () => {
        const requests = JSON.parse(localStorage.getItem('returnRequests'));
        const request = requests.find(r => r.id === requestId);
        
        if (request) {
            request.status = action === 'Approve' ? 'Approved' : 'Rejected';
            localStorage.setItem('returnRequests', JSON.stringify(requests));
            updateReturnRequestsTable();
            showToast(`Return request ${action.toLowerCase()}d successfully`);
        }
        
        modal.hide();
    };
    
    modal.show();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateReturnRequestsTable();
});