// ManageProducts.js
import React, { useState, useEffect } from 'react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        stockStatus: '',
        dateAdded: ''
    });

    // Add filter controls above the table
    const FilterControls = () => (
        <div className="mb-4 p-3 bg-white rounded shadow-sm">
            <div className="row g-3">
                <div className="col-md-3">
                    <select 
                        className="form-select"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Footwear">Footwear</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select 
                        className="form-select"
                        value={filters.priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}>
                        <option value="">All Prices</option>
                        <option value="0-100">₹0 - ₹100</option>
                        <option value="101-500">₹101 - ₹500</option>
                        <option value="501-1000">₹501 - ₹1000</option>
                        <option value="1001+">₹1000+</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select 
                        className="form-select"
                        value={filters.stockStatus}
                        onChange={(e) => handleFilterChange('stockStatus', e.target.value)}>
                        <option value="">All Stock Status</option>
                        <option value="inStock">In Stock</option>
                        <option value="lowStock">Low Stock</option>
                        <option value="outOfStock">Out of Stock</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select 
                        className="form-select"
                        value={filters.dateAdded}
                        onChange={(e) => handleFilterChange('dateAdded', e.target.value)}>
                        <option value="">All Dates</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </div>
        </div>
    );

    // Add sorting and filtering functions
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
    };

    // Update useEffect to handle filtering and sorting
    useEffect(() => {
        let result = [...products];

        // Apply filters
        if (filters.category) {
            result = result.filter(product => product.category === filters.category);
        }
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            result = result.filter(product => {
                if (max) {
                    return product.price >= min && product.price <= max;
                }
                return product.price >= min;
            });
        }
        if (filters.stockStatus) {
            switch (filters.stockStatus) {
                case 'inStock':
                    result = result.filter(product => product.quantity > 10);
                    break;
                case 'lowStock':
                    result = result.filter(product => product.quantity <= 10 && product.quantity > 0);
                    break;
                case 'outOfStock':
                    result = result.filter(product => product.quantity === 0);
                    break;
            }
        }
        if (filters.dateAdded) {
            const today = new Date();
            const productDate = new Date(product.dateAdded);
            switch (filters.dateAdded) {
                case 'today':
                    result = result.filter(product => 
                        productDate.toDateString() === today.toDateString());
                    break;
                case 'week':
                    const weekAgo = new Date(today.setDate(today.getDate() - 7));
                    result = result.filter(product => productDate >= weekAgo);
                    break;
                case 'month':
                    const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                    result = result.filter(product => productDate >= monthAgo);
                    break;
            }
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredProducts(result);
    }, [products, filters, sortConfig]);

    // Update the table header to include sort indicators
    return (
        <div className="container mt-4">
            <FilterControls />
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')}>
                                Name {sortConfig.key === 'name' && (
                                    <i className={`fas fa-sort-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
                                )}
                            </th>
                            <th onClick={() => handleSort('price')}>
                                Price {sortConfig.key === 'price' && (
                                    <i className={`fas fa-sort-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
                                )}
                            </th>
                            <th onClick={() => handleSort('quantity')}>
                                Stock {sortConfig.key === 'quantity' && (
                                    <i className={`fas fa-sort-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
                                )}
                            </th>
                            <th onClick={() => handleSort('category')}>
                                Category {sortConfig.key === 'category' && (
                                    <i className={`fas fa-sort-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
                                )}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => handleSelectProduct(product.id)}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>₹{product.price}</td>
                                <td>{product.category}</td>
                                <td>
                                    <img src={product.image} alt={product.name} width="50" />
                                </td>
                                <td>{product.rating} ⭐</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;