// ManageOrders.js
import React, { useState, useEffect } from 'react';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        setOrders(storedOrders);
    }, []);

    return (
        <div className="container">
            <h2>Manage Orders</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td>Order #{index + 1}</td>
                            <td>{order.date}</td>
                            <td>{order.status}</td>
                            <td>₹{order.total.toFixed(2)}</td>
                            <td>{order.address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOrders;