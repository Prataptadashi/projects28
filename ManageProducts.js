// ManageProducts.js
import React, { useState, useEffect } from 'react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [rating, setRating] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        setProducts(storedProducts);
    }, []);

    const saveProducts = (updatedProducts) => {
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        const newProduct = {
            id: Date.now(), // Use timestamp for better unique IDs
            name,
            price: parseFloat(price),
            category,
            image,
            rating: parseFloat(rating),
        };
        const updatedProducts = [...products, newProduct];
        saveProducts(updatedProducts);
        resetForm();
        setShowModal(false);
    };

    const handleEditProduct = (product) => {
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setImage(product.image);
        setRating(product.rating);
        setEditingProductId(product.id);
        setShowModal(true);
    };

    const handleUpdateProduct = (e) => {
        e.preventDefault();
        const updatedProducts = products.map((product) =>
            product.id === editingProductId
                ? { ...product, name, price: parseFloat(price), category, image, rating: parseFloat(rating) }
                : product
        );
        saveProducts(updatedProducts);
        resetForm();
        setShowModal(false);
    };

    const handleDeleteProduct = (id) => {
        const updatedProducts = products.filter((product) => product.id !== id);
        saveProducts(updatedProducts);
    };

    const handleDeleteSelected = () => {
        if (selectedProducts.length === 0) return;
        const updatedProducts = products.filter(
            (product) => !selectedProducts.includes(product.id)
        );
        saveProducts(updatedProducts);
        setSelectedProducts([]);
    };

    const handleSelectProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id)
                ? prev.filter((productId) => productId !== id)
                : [...prev, id]
        );
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setCategory('');
        setImage('');
        setRating('');
        setEditingProductId(null);
    };

    const handleModalClose = () => {
        resetForm();
        setShowModal(false);
    };

    return (
        <div className="container">
            <h2>Manage Products</h2>
            
            <div className="d-flex justify-content-between mb-3">
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    Add New Product
                </button>
                {selectedProducts.length > 0 && (
                    <button 
                        className="btn btn-danger"
                        onClick={handleDeleteSelected}
                    >
                        Delete Selected ({selectedProducts.length})
                    </button>
                )}
            </div>

            {/* Product Modal */}
            {showModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingProductId ? 'Edit Product' : 'Add New Product'}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleModalClose}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Image URL</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Rating</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            min="1"
                                            max="5"
                                            step="0.1"
                                            required
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={handleModalClose}
                                        >
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {editingProductId ? 'Update Product' : 'Add Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h3 className="mt-4">Product List</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            <input 
                                type="checkbox" 
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedProducts(products.map(p => p.id));
                                    } else {
                                        setSelectedProducts([]);
                                    }
                                }}
                                checked={selectedProducts.length === products.length && products.length > 0}
                            />
                        </th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
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
    );
};

export default ManageProducts;