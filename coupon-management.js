// Initialize sample coupons if not exists
if (!localStorage.getItem('coupons')) {
    const sampleCoupons = [
        {
            id: 1,
            code: 'SUMMER2024',
            type: 'percentage',
            value: 20,
            minOrder: 100,
            expiryDate: '2024-08-31',
            status: 'active'
        },
        {
            id: 2,
            code: 'FLAT50',
            type: 'flat',
            value: 50,
            minOrder: 200,
            expiryDate: '2024-12-31',
            status: 'active'
        }
    ];
    localStorage.setItem('coupons', JSON.stringify(sampleCoupons));
}

// Function to show notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Coupon Management</strong>
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

// Function to update coupons table
function updateCouponsTable() {
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('couponTable');
    tbody.innerHTML = filteredCoupons.map(coupon => `
        <tr>
            <td>${coupon.code}</td>
            <td>${coupon.type}</td>
            <td>${coupon.type === 'percentage' ? coupon.value + '%' : '$' + coupon.value}</td>
            <td>$${coupon.minOrder}</td>
            <td>${coupon.expiryDate}</td>
            <td>
                <span class="badge bg-${coupon.status === 'active' ? 'success' : 'danger'}">
                    ${coupon.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="editCoupon(${coupon.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-${coupon.status === 'active' ? 'danger' : 'success'}"
                        onclick="toggleCouponStatus(${coupon.id})">
                    <i class="fas fa-${coupon.status === 'active' ? 'ban' : 'check'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Function to open add coupon modal
function openAddCouponModal() {
    document.getElementById('modalTitle').textContent = 'Add New Coupon';
    document.getElementById('couponForm').reset();
    document.getElementById('couponId').value = '';
    new bootstrap.Modal(document.getElementById('couponModal')).show();
}

// Function to edit coupon
function editCoupon(id) {
    const coupons = JSON.parse(localStorage.getItem('coupons'));
    const coupon = coupons.find(c => c.id === id);
    
    if (coupon) {
        document.getElementById('modalTitle').textContent = 'Edit Coupon';
        document.getElementById('couponId').value = coupon.id;
        document.getElementById('couponCode').value = coupon.code;
        document.getElementById('discountType').value = coupon.type;
        document.getElementById('discountValue').value = coupon.value;
        document.getElementById('minOrder').value = coupon.minOrder;
        document.getElementById('expiryDate').value = coupon.expiryDate;
        
        new bootstrap.Modal(document.getElementById('couponModal')).show();
    }
}

// Function to save coupon
function saveCoupon() {
    const couponId = document.getElementById('couponId').value;
    const couponData = {
        code: document.getElementById('couponCode').value,
        type: document.getElementById('discountType').value,
        value: Number(document.getElementById('discountValue').value),
        minOrder: Number(document.getElementById('minOrder').value),
        expiryDate: document.getElementById('expiryDate').value,
        status: 'active'
    };
    
    let coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    
    if (couponId) {
        // Update existing coupon
        const index = coupons.findIndex(c => c.id === Number(couponId));
        if (index !== -1) {
            coupons[index] = { ...coupons[index], ...couponData };
            showToast('Coupon updated successfully');
        }
    } else {
        // Add new coupon
        couponData.id = Date.now();
        coupons.push(couponData);
        showToast('New coupon added successfully');
    }
    
    localStorage.setItem('coupons', JSON.stringify(coupons));
    updateCouponsTable();
    bootstrap.Modal.getInstance(document.getElementById('couponModal')).hide();
}

// Function to toggle coupon status
function toggleCouponStatus(id) {
    const coupons = JSON.parse(localStorage.getItem('coupons'));
    const index = coupons.findIndex(c => c.id === id);
    
    if (index !== -1) {
        coupons[index].status = coupons[index].status === 'active' ? 'inactive' : 'active';
        localStorage.setItem('coupons', JSON.stringify(coupons));
        updateCouponsTable();
        showToast(`Coupon ${coupons[index].status === 'active' ? 'activated' : 'deactivated'} successfully`);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCouponsTable();
    
    // Add event listeners for search and filter
    document.getElementById('searchInput').addEventListener('input', updateCouponsTable);
    document.getElementById('statusFilter').addEventListener('change', updateCouponsTable);
});