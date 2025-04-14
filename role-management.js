// Define available permissions for each module
const modulePermissions = {
    products: ['view', 'create', 'edit', 'delete'],
    orders: ['view', 'process', 'cancel', 'refund'],
    users: ['view', 'create', 'edit', 'delete'],
    analytics: ['view'],
    reviews: ['view', 'moderate', 'delete'],
    admins: ['view', 'create', 'edit', 'delete'],
    roles: ['view', 'create', 'edit', 'delete']
};

// Initialize roles with Super Admin if not exists
let roles = JSON.parse(localStorage.getItem('roles')) || [{
    id: '1',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: Object.fromEntries(
        Object.entries(modulePermissions).map(([module, perms]) => 
            [module, perms.reduce((obj, perm) => ({ ...obj, [perm]: true }), {})]
        )
    )
}];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateRolesTable();
    setupPermissionsForm();
});

// Keep only one openRoleModal function and remove all duplicates
function openRoleModal(roleId = null) {
    // Get a fresh instance of the modal
    const modalEl = document.getElementById('roleModal');
    if (bootstrap.Modal.getInstance(modalEl)) {
        bootstrap.Modal.getInstance(modalEl).dispose();
    }
    
    const modal = new bootstrap.Modal(modalEl);
    const title = document.getElementById('roleModalTitle');
    const form = document.getElementById('roleForm');
    const saveButton = document.querySelector('.modal-footer .btn-primary');
    
    // Reset form and show save button
    form.reset();
    saveButton.style.display = 'block';
    document.getElementById('roleId').value = roleId || '';
    title.textContent = roleId ? 'Edit Role' : 'Add New Role';
    
    // Clear and setup permissions
    setupPermissionsForm();
    
    if (roleId) {
        const role = roles.find(r => r.id === roleId);
        if (role) {
            document.getElementById('roleName').value = role.name;
            document.getElementById('roleDescription').value = role.description;
            
            // Set permissions
            Object.entries(role.permissions).forEach(([module, perms]) => {
                Object.entries(perms).forEach(([perm, value]) => {
                    const checkbox = document.getElementById(`${module}_${perm}`);
                    if (checkbox) checkbox.checked = value;
                });
            });
        }
    }
    
    modal.show();
}

function viewPermissions(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    // Get a fresh instance of the modal
    const modalEl = document.getElementById('roleModal');
    if (bootstrap.Modal.getInstance(modalEl)) {
        bootstrap.Modal.getInstance(modalEl).dispose();
    }

    const modal = new bootstrap.Modal(modalEl);
    const modalBody = modalEl.querySelector('.modal-body');
    const saveButton = modalEl.querySelector('.modal-footer .btn-primary');
    const originalContent = modalBody.innerHTML;

    // Hide save button
    saveButton.style.display = 'none';

    let permissionsHtml = `<div class="permissions-view">`;
    Object.entries(role.permissions).forEach(([module, permissions]) => {
        permissionsHtml += `
            <div class="permission-group mb-3">
                <h6 class="text-capitalize fw-bold">${module}</h6>
                <div class="row g-2">
                    ${Object.entries(permissions)
                        .map(([perm, enabled]) => `
                            <div class="col-md-3">
                                <span class="badge ${enabled ? 'bg-success' : 'bg-secondary'} w-100 p-2">
                                    ${perm.charAt(0).toUpperCase() + perm.slice(1)}
                                </span>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
    });
    permissionsHtml += '</div>';

    modalBody.innerHTML = permissionsHtml;
    document.getElementById('roleModalTitle').textContent = `Permissions - ${role.name}`;

    // Add one-time event listener for modal close
    modalEl.addEventListener('hidden.bs.modal', function() {
        modalBody.innerHTML = originalContent;
        saveButton.style.display = 'block';
        setupPermissionsForm();
    }, { once: true });

    modal.show();
}

function deleteRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (role.name === 'Super Admin') {
        alert('Cannot delete Super Admin role');
        return;
    }

    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
        roles = roles.filter(r => r.id !== roleId);
        localStorage.setItem('roles', JSON.stringify(roles));
        updateRolesTable();
        alert('Role deleted successfully');
    }
}


function updateRolesTable() {
    const tbody = document.getElementById('rolesTable');
    if (!tbody) return; // Safety check
    
    // Ensure roles array exists
    if (!Array.isArray(roles)) {
        roles = JSON.parse(localStorage.getItem('roles')) || [{
            id: '1',
            name: 'Super Admin',
            description: 'Full system access',
            permissions: Object.fromEntries(
                Object.entries(modulePermissions).map(([module, perms]) => 
                    [module, perms.reduce((obj, perm) => ({ ...obj, [perm]: true }), {})]
                )
            )
        }];
        localStorage.setItem('roles', JSON.stringify(roles));
    }

    tbody.innerHTML = roles.map(role => `
        <tr>
            <td>${role.name || ''}</td>
            <td>${role.description || ''}</td>
            <td>
                ${Object.keys(role.permissions || {}).length} modules
                <button class="btn btn-sm btn-info ms-2" onclick="viewPermissions('${role.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-primary me-2" onclick="openRoleModal('${role.id}')" 
                    ${role.name === 'Super Admin' ? 'disabled' : ''}>
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteRole('${role.id}')"
                    ${role.name === 'Super Admin' ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Add this function to ensure roles are properly loaded
function initializeRoles() {
    try {
        roles = JSON.parse(localStorage.getItem('roles')) || [];
        if (roles.length === 0) {
            // Add Super Admin if no roles exist
            roles = [{
                id: '1',
                name: 'Super Admin',
                description: 'Full system access',
                permissions: Object.fromEntries(
                    Object.entries(modulePermissions).map(([module, perms]) => 
                        [module, perms.reduce((obj, perm) => ({ ...obj, [perm]: true }), {})]
                    )
                )
            }];
            localStorage.setItem('roles', JSON.stringify(roles));
        }
    } catch (error) {
        console.error('Error initializing roles:', error);
        roles = [];
    }
    updateRolesTable();
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initializeRoles();
    setupPermissionsForm();
});