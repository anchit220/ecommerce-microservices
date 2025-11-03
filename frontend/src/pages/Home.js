import React, { useEffect, useState } from "react";
import { productAPI } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        productAPI.get("/").then((res) => {
            setProducts(res.data);
        }).catch(() => {
            console.error("Error fetching products");
        });
    }, []);

    return (
        <div>
            <h2>Products</h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}
