let selectedFeedbackId = null;

// Show notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Feedback Management</strong>
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
        case 'Open': return 'bg-danger';
        case 'In Progress': return 'bg-warning';
        case 'Resolved': return 'bg-success';
        default: return 'bg-secondary';
    }
}

// Update feedback table
function updateFeedbackTable() {
    const feedback = JSON.parse(localStorage.getItem('feedback')) || [];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredFeedback = feedback.filter(item => {
        const matchesSearch = 
            item.subject.toLowerCase().includes(searchTerm) ||
            item.userName.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('feedbackTable');
    tbody.innerHTML = filteredFeedback.map(item => `
        <tr>
            <td>#${item.id}</td>
            <td>${item.userName}</td>
            <td>${item.subject}</td>
            <td>${item.message.substring(0, 50)}...</td>
            <td>
                <span class="badge ${getStatusBadgeClass(item.status)}">
                    ${item.status}
                </span>
            </td>
            <td>${new Date(item.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openFeedbackModal(${item.id})">
                    View Details
                </button>
            </td>
        </tr>
    `).join('');
}

// Open feedback modal
function openFeedbackModal(feedbackId) {
    selectedFeedbackId = feedbackId;
    const feedback = JSON.parse(localStorage.getItem('feedback')) || [];
    const item = feedback.find(f => f.id === feedbackId);
    
    if (item) {
        document.getElementById('feedbackStatus').value = item.status;
        document.getElementById('modalUser').textContent = item.userName;
        document.getElementById('modalSubject').textContent = item.subject;
        document.getElementById('modalMessage').textContent = item.message;
        document.getElementById('modalCreatedAt').textContent = new Date(item.created_at).toLocaleString();
        
        new bootstrap.Modal(document.getElementById('feedbackModal')).show();
    }
}

// Update feedback status
function updateFeedbackStatus() {
    const newStatus = document.getElementById('feedbackStatus').value;
    const feedback = JSON.parse(localStorage.getItem('feedback')) || [];
    const feedbackIndex = feedback.findIndex(f => f.id === selectedFeedbackId);
    
    if (feedbackIndex !== -1) {
        feedback[feedbackIndex].status = newStatus;
        feedback[feedbackIndex].updated_at = new Date().toISOString();
        localStorage.setItem('feedback', JSON.stringify(feedback));
        updateFeedbackTable();
        bootstrap.Modal.getInstance(document.getElementById('feedbackModal')).hide();
        showToast(`Feedback status updated to ${newStatus}`);
    }
}

// Initialize sample feedback if none exists
if (!localStorage.getItem('feedback')) {
    const sampleFeedback = [
        {
            id: 1,
            userId: 1,
            userName: "John Doe",
            subject: "Website Navigation Issue",
            message: "I'm having trouble finding the product categories on the homepage.",
            status: "Open",
            created_at: "2024-04-22T10:00:00",
            updated_at: "2024-04-22T10:00:00"
        },
        {
            id: 2,
            userId: 2,
            userName: "Jane Smith",
            subject: "Payment Problem",
            message: "My payment was processed but I didn't receive an order confirmation.",
            status: "In Progress",
            created_at: "2024-04-21T15:30:00",
            updated_at: "2024-04-21T16:00:00"
        },
        {
            id: 3,
            userId: 3,
            userName: "Bob Wilson",
            subject: "Product Quality Feedback",
            message: "The product I received exceeded my expectations. Great quality!",
            status: "Resolved",
            created_at: "2024-04-20T09:15:00",
            updated_at: "2024-04-20T14:30:00"
        }
    ];
    localStorage.setItem('feedback', JSON.stringify(sampleFeedback));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateFeedbackTable();
    
    // Add event listeners for filters
    document.getElementById('searchInput').addEventListener('input', updateFeedbackTable);
    document.getElementById('statusFilter').addEventListener('change', updateFeedbackTable);
});