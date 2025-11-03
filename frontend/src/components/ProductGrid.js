import ProductCard from "./ProductCard";

export default function ProductGrid() {
    const products = [
        { name: "CCD Coffee Beans", category: "Coffee", price: 299, image: "https://source.unsplash.com/featured/?coffee" },
        { name: "Espresso Mug", category: "Accessories", price: 199, image: "https://source.unsplash.com/featured/?mug" },
        { name: "Coffee Maker", category: "Appliance", price: 1299, image: "https://source.unsplash.com/featured/?coffee-machine" },
        { name: "CCD T-Shirt", category: "Merch", price: 499, image: "https://source.unsplash.com/featured/?tshirt" },
    ];

    return (
        <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {products.map((p, i) => (
                <ProductCard key={i} product={p} />
            ))}
        </div>
    );
}
