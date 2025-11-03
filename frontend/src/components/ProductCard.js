import React from "react";

export default function ProductCard({ product }) {
    return (
        <div style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            margin: "10px",
            width: "200px"
        }}>
            <h4>{product.name}</h4>
            <p>₹{product.price}</p>
            <button>Add to Cart</button>
        </div>
    );
}
