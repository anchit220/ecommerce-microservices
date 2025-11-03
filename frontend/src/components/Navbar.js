import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ background: "#333", padding: "10px" }}>
            <Link to="/" style={{ color: "#fff", marginRight: 20 }}>Home</Link>
            <Link to="/cart" style={{ color: "#fff", marginRight: 20 }}>Cart</Link>
            <Link to="/orders" style={{ color: "#fff", marginRight: 20 }}>Orders</Link>
            <Link to="/login" style={{ color: "#fff" }}>Login</Link>
        </nav>
    );
}
