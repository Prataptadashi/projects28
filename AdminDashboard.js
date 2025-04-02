import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Update the sample data at the top of the file
const topProductsData = [
  { id: 1, name: "Smartphone", price: 999, quantity: 50, totalSales: 49950 },
  { id: 2, name: "Laptop", price: 1299, quantity: 35, totalSales: 45465 },
  { id: 3, name: "Headphones", price: 199, quantity: 120, totalSales: 23880 },
  { id: 4, name: "Smart Watch", price: 299, quantity: 45, totalSales: 13455 },
  { id: 5, name: "Tablet", price: 499, quantity: 25, totalSales: 12475 }
];

const lowProductsData = [
  { id: 6, name: "USB Cable", price: 15, quantity: 10, totalSales: 150 },
  { id: 7, name: "Phone Case", price: 25, quantity: 8, totalSales: 200 },
  { id: 8, name: "Screen Protector", price: 10, quantity: 15, totalSales: 150 },
  { id: 9, name: "Mouse Pad", price: 12, quantity: 5, totalSales: 60 },
  { id: 10, name: "Keyboard Cover", price: 20, quantity: 3, totalSales: 60 }
];

const salesChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Monthly Sales ($)',
    data: [15000, 18000, 22000, 26000, 29000, 35000, 32000, 38000, 42000, 45000, 48000, 52000],
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    tension: 0.1,
    fill: true
  }]
};

// Update the initial stats
const initialStats = {
  totalProducts: 150,
  totalOrders: 850,
  totalRevenue: 145845
};

// Add these functions after the ChartJS.register section
// Update the generateSalesData function to ensure it always returns valid data
const generateSalesData = (timeFrame) => {
  const now = new Date();
  const labels = [];
  const data = [];

  switch (timeFrame) {
    case 'daily':
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 5000) + 3000); // Ensure minimum value of 3000
      }
      break;
    case 'weekly':
      // Last 4 weeks
      for (let i = 4; i >= 0; i--) {
        labels.push(`Week ${i + 1}`);
        data.push(Math.floor(Math.random() * 20000) + 10000); // Ensure minimum value of 10000
      }
      break;
    case 'monthly':
      // Last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      labels.push(...months);
      data.push(15000, 22000, 28000, 32000, 38000, 45000); // Fixed values for consistency
      break;
    default:
      // Fallback data
      labels.push(...['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
      data.push(12000, 19000, 15000, 21000, 25000);
  }

  return {
    labels,
    datasets: [{
      label: `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Sales ($)`,
      data,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true
    }]
  };
};

// Update the product performance data with more realistic values
const productPerformanceData = {
  daily: {
    top: [
      { id: 1, name: "iPhone 13", price: 999, quantity: 25, totalSales: 24975 },
      { id: 2, name: "MacBook Pro", price: 1499, quantity: 15, totalSales: 22485 },
      { id: 3, name: "AirPods Pro", price: 249, quantity: 50, totalSales: 12450 },
      { id: 4, name: "iPad Air", price: 599, quantity: 20, totalSales: 11980 },
      { id: 5, name: "Apple Watch", price: 399, quantity: 25, totalSales: 9975 }
    ],
    low: [
      { id: 6, name: "Phone Case", price: 29, quantity: 5, totalSales: 145 },
      { id: 7, name: "Screen Protector", price: 19, quantity: 8, totalSales: 152 },
      { id: 8, name: "USB Cable", price: 15, quantity: 10, totalSales: 150 },
      { id: 9, name: "Power Adapter", price: 25, quantity: 6, totalSales: 150 },
      { id: 10, name: "Keyboard Cover", price: 20, quantity: 7, totalSales: 140 }
    ]
  },
  weekly: {
    top: [
      { id: 1, name: "iPhone 13", price: 999, quantity: 150, totalSales: 149850 },
      { id: 2, name: "MacBook Pro", price: 1499, quantity: 80, totalSales: 119920 },
      { id: 3, name: "AirPods Pro", price: 249, quantity: 300, totalSales: 74700 },
      { id: 4, name: "iPad Air", price: 599, quantity: 100, totalSales: 59900 },
      { id: 5, name: "Apple Watch", price: 399, quantity: 120, totalSales: 47880 }
    ],
    low: [
      { id: 6, name: "Phone Case", price: 29, quantity: 25, totalSales: 725 },
      { id: 7, name: "Screen Protector", price: 19, quantity: 35, totalSales: 665 },
      { id: 8, name: "USB Cable", price: 15, quantity: 40, totalSales: 600 },
      { id: 9, name: "Power Adapter", price: 25, quantity: 22, totalSales: 550 },
      { id: 10, name: "Keyboard Cover", price: 20, quantity: 25, totalSales: 500 }
    ]
  },
  monthly: {
    top: [
      { id: 1, name: "iPhone 13", price: 999, quantity: 500, totalSales: 499500 },
      { id: 2, name: "MacBook Pro", price: 1499, quantity: 250, totalSales: 374750 },
      { id: 3, name: "AirPods Pro", price: 249, quantity: 1000, totalSales: 249000 },
      { id: 4, name: "iPad Air", price: 599, quantity: 350, totalSales: 209650 },
      { id: 5, name: "Apple Watch", price: 399, quantity: 400, totalSales: 159600 }
    ],
    low: [
      { id: 6, name: "Phone Case", price: 29, quantity: 100, totalSales: 2900 },
      { id: 7, name: "Screen Protector", price: 19, quantity: 150, totalSales: 2850 },
      { id: 8, name: "USB Cable", price: 15, quantity: 180, totalSales: 2700 },
      { id: 9, name: "Power Adapter", price: 25, quantity: 100, totalSales: 2500 },
      { id: 10, name: "Keyboard Cover", price: 20, quantity: 120, totalSales: 2400 }
    ]
  }
};

// Add time frame filter state and product performance data
const AdminDashboard = () => {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [performanceTimeFrame, setPerformanceTimeFrame] = useState('monthly');
  const [salesData, setSalesData] = useState(generateSalesData('monthly'));
  
  // Sample data for different time frames
  const productPerformanceData = {
    daily: {
      top: [
        { id: 1, name: "Laptop", price: 1200, quantity: 5, totalSales: 6000 },
        { id: 2, name: "Smartphone", price: 800, quantity: 4, totalSales: 3200 },
        { id: 3, name: "Headphones", price: 200, quantity: 8, totalSales: 1600 }
      ],
      low: [
        { id: 4, name: "Mouse Pad", price: 10, quantity: 1, totalSales: 10 },
        { id: 5, name: "USB Cable", price: 15, quantity: 1, totalSales: 15 },
        { id: 6, name: "Screen Protector", price: 12, quantity: 1, totalSales: 12 }
      ]
    },
    weekly: {
      top: [
        { id: 1, name: "Laptop", price: 1200, quantity: 15, totalSales: 18000 },
        { id: 2, name: "Smartphone", price: 800, quantity: 20, totalSales: 16000 },
        { id: 3, name: "Headphones", price: 200, quantity: 45, totalSales: 9000 }
      ],
      low: [
        { id: 4, name: "Mouse Pad", price: 10, quantity: 3, totalSales: 30 },
        { id: 5, name: "USB Cable", price: 15, quantity: 4, totalSales: 60 },
        { id: 6, name: "Screen Protector", price: 12, quantity: 5, totalSales: 60 }
      ]
    },
    monthly: {
      top: topProductsData,
      low: lowProductsData
    }
  };

  const [topProducts, setTopProducts] = useState(productPerformanceData.monthly.top);
  const [lowProducts, setLowProducts] = useState(productPerformanceData.monthly.low);

  // Update both charts when time frame changes
  useEffect(() => {
    setSalesData(generateSalesData(timeFrame));
  }, [timeFrame]);

  useEffect(() => {
    setTopProducts(productPerformanceData[performanceTimeFrame].top);
    setLowProducts(productPerformanceData[performanceTimeFrame].low);
  }, [performanceTimeFrame]);

  // Add this before the product performance tables
  const [stats] = useState(initialStats);

  return (
    <Router>
      <div className="dashboard-container d-flex" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <div className="sidebar bg-dark text-white p-3" style={{ width: '250px' }}>
          <h3 className="mb-4">Admin Dashboard</h3>
          <div className="d-flex flex-column">
            <Link to="/" className="btn btn-primary w-100 mb-2 text-start">
              <i className="fas fa-home me-2"></i>Dashboard
            </Link>
            <Link to="/manage-products" className="btn btn-primary w-100 mb-2 text-start">
              <i className="fas fa-box me-2"></i>Products
            </Link>
            <Link to="/manage-orders" className="btn btn-primary w-100 mb-2 text-start">
              <i className="fas fa-shopping-cart me-2"></i>Orders
            </Link>
            <Link to="/" className="btn btn-secondary w-100 mt-auto text-start">
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </Link>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="content p-4 flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
          {/* Dashboard Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card bg-primary text-white h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="card-text display-4">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-success text-white h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Orders</h5>
                  <p className="card-text display-4">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-info text-white h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <p className="card-text display-4">${stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">Sales Trend</h4>
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${timeFrame === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeFrame('daily')}>
                    Daily
                  </button>
                  <button 
                    className={`btn btn-sm ${timeFrame === 'weekly' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeFrame('weekly')}>
                    Weekly
                  </button>
                  <button 
                    className={`btn btn-sm ${timeFrame === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeFrame('monthly')}>
                    Monthly
                  </button>
                </div>
              </div>
              <div style={{ height: '300px' }}>
                <Line
                  data={salesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `$${context.raw.toFixed(2)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return `$${value}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Performance Section */}
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="btn-group">
                      <button 
                        className={`btn btn-sm ${performanceTimeFrame === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setPerformanceTimeFrame('daily')}>
                        Daily
                      </button>
                      <button 
                        className={`btn btn-sm ${performanceTimeFrame === 'weekly' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setPerformanceTimeFrame('weekly')}>
                        Weekly
                      </button>
                      <button 
                        className={`btn btn-sm ${performanceTimeFrame === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setPerformanceTimeFrame('monthly')}>
                        Monthly
                      </button>
                    </div>
                  </div>
                  {/* Existing product performance tables remain the same */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="card-title">Top Selling Products</h4>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Units Sold</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product, index) => (
                          <tr key={`top-${index}`}>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.quantity}</td>
                            <td>${product.totalSales.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="card-title">Least Performing Products</h4>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Units Sold</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowProducts.map((product, index) => (
                          <tr key={`low-${index}`}>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.quantity}</td>
                            <td>${product.totalSales.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Routes>
            <Route path="/manage-products" element={<ManageProducts />} />
            <Route path="/manage-orders" element={<ManageOrders />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AdminDashboard;