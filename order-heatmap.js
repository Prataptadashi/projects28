// Constants for days and hours
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({length: 24}, (_, i) => `${i}:00`);

function generateHeatmapData(days) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - days));
    
    // Initialize data array
    let data = [];
    
    // Generate data points for each day and hour
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            // Count orders for this day and hour
            const count = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= startDate &&
                       orderDate.getDay() === day &&
                       orderDate.getHours() === hour;
            }).length;
            
            data.push({
                x: hour,
                y: day,
                v: count
            });
        }
    }
    
    return data;
}

function updateHeatmap(days) {
    const ctx = document.getElementById('heatmapChart').getContext('2d');
    const data = generateHeatmapData(days);
    
    // Destroy existing chart
    if (window.heatmapChart instanceof Chart) {
        window.heatmapChart.destroy();
    }
    
    // Create new chart
    window.heatmapChart = new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                data: data,
                backgroundColor(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = Math.min(value / 5, 1); // Adjust based on your max order volume
                    return `rgba(0, 103, 255, ${alpha})`;
                },
                borderColor: '#ffffff',
                borderWidth: 1,
                width: ({ chart }) => (chart.chartArea || {}).width / 24 - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / 7 - 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    offset: true,
                    min: -0.5,
                    max: 23.5,
                    ticks: {
                        stepSize: 1,
                        callback: value => HOURS[value]
                    },
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Hour of Day',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    offset: true,
                    min: -0.5,
                    max: 6.5,
                    ticks: {
                        stepSize: 1,
                        callback: value => DAYS[value]
                    },
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Day of Week',
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            const data = context[0].dataset.data[context[0].dataIndex];
                            return `${DAYS[data.y]} at ${HOURS[data.x]}`;
                        },
                        label: (context) => {
                            const value = context.dataset.data[context.dataIndex].v;
                            return `Orders: ${value}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateHeatmap(7);
    
    document.getElementById('timeRange').addEventListener('change', (e) => {
        updateHeatmap(parseInt(e.target.value));
    });
});