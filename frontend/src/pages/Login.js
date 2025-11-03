import React, { useState } from "react";
import { authAPI } from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await authAPI.post("/login", { email, password });
            alert("Login success: " + res.data.message);
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Login</h2>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /><br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
