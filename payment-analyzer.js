document.addEventListener('DOMContentLoaded', function() {
    // Initialize date filter handler
    document.getElementById('dateFilter').addEventListener('change', function() {
        const customDateRange = document.getElementById('customDateRange');
        customDateRange.style.display = this.value === 'custom' ? 'block' : 'none';
    });

    updatePaymentAnalytics();
});

function applyFilters() {
    updatePaymentAnalytics();
}

function filterOrders(orders) {
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    return orders.filter(order => {
        const orderDate = new Date(order.date);
        const today = new Date();
        let passDateFilter = true;
        let passStatusFilter = true;

        // Date filtering
        switch(dateFilter) {
            case 'today':
                passDateFilter = orderDate.toDateString() === today.toDateString();
                break;
            case 'week':
                const weekAgo = new Date(today.setDate(today.getDate() - 7));
                passDateFilter = orderDate >= weekAgo;
                break;
            case 'month':
                passDateFilter = orderDate.getMonth() === today.getMonth() &&
                               orderDate.getFullYear() === today.getFullYear();
                break;
            case 'custom':
                if (startDate && endDate) {
                    passDateFilter = orderDate >= new Date(startDate) &&
                                   orderDate <= new Date(endDate);
                }
                break;
        }

        // Status filtering
        if (statusFilter !== 'all') {
            passStatusFilter = order.status === statusFilter;
        }

        return passDateFilter && passStatusFilter;
    });
}

function updatePaymentAnalytics() {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Apply filters
    orders = filterOrders(orders);
    
    // Add payment method if not exists
    orders.forEach(order => {
        if (!order.paymentMethod) {
            order.paymentMethod = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'][Math.floor(Math.random() * 5)];
        }
    });
    
    // Calculate payment method statistics
    const paymentStats = orders.reduce((acc, order) => {
        if (!acc[order.paymentMethod]) {
            acc[order.paymentMethod] = {
                method: order.paymentMethod,
                orders: 0,
                revenue: 0
            };
        }
        acc[order.paymentMethod].orders++;
        acc[order.paymentMethod].revenue += order.total;
        return acc;
    }, {});

    // Calculate totals and find top method
    const totalRevenue = Object.values(paymentStats).reduce((sum, stat) => sum + stat.revenue, 0);
    const totalTransactions = Object.values(paymentStats).reduce((sum, stat) => sum + stat.orders, 0);
    const topMethod = Object.values(paymentStats)
        .sort((a, b) => b.orders - a.orders)[0];

    // Update summary cards
    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('topMethod').textContent = topMethod ? topMethod.method : '-';
    
    // Update table with highlighted row for top method
    const tableBody = document.getElementById('paymentMethodsTable');
    tableBody.innerHTML = Object.values(paymentStats)
        .sort((a, b) => b.revenue - a.revenue)
        .map(stat => `
            <tr class="${stat.method === topMethod.method ? 'table-primary' : ''}">
                <td>${stat.method}</td>
                <td>${stat.orders}</td>
                <td>$${stat.revenue.toFixed(2)}</td>
                <td>${((stat.revenue / totalRevenue) * 100).toFixed(1)}%</td>
            </tr>
        `).join('');

    // Create chart
    const existingChart = Chart.getChart('paymentMethodsChart');
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(document.getElementById('paymentMethodsChart'), {
        type: 'pie',
        data: {
            labels: Object.values(paymentStats).map(stat => stat.method),
            datasets: [{
                data: Object.values(paymentStats).map(stat => stat.revenue),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}