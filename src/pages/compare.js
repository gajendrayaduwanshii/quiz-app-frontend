import React, { useState } from "react";
import "./scss/Compare.scss";

const Compare = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Google Pixel 10 (Obsidian, 256 GB)",
      price: "₹79,999",
      image: "/images/pixel10.png", 
      specs: [
        "12 GB RAM | 256 GB ROM",
        "16.0 cm (6.3 inch) Quad HD+ Display",
        "48MP + 13MP + 10.8MP | 10.5MP Front Camera",
        "4970 mAh Battery",
      ],
    },
  ]);

  const mockBrands = ["Apple", "Samsung", "OnePlus"];
  const mockProducts = {
    Apple: ["iPhone 16", "iPhone 15 Pro"],
    Samsung: ["Galaxy S24", "Galaxy Z Flip 6"],
    OnePlus: ["OnePlus 12", "OnePlus Nord 4"],
  };

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleAddProduct = () => {
    if (selectedBrand && selectedProduct) {
      const newProduct = {
        id: Date.now(),
        name: `${selectedProduct} (${selectedBrand})`,
        price: "₹69,999",
        image: "/images/placeholder-phone.png",
        specs: [
          "8 GB RAM | 256 GB ROM",
          "6.7 inch AMOLED Display",
          "50MP Triple Camera",
          "5000 mAh Battery",
        ],
      };
      setProducts([...products, newProduct]);
      setSelectedBrand("");
      setSelectedProduct("");
    }
  };

  return (
    <div className="compare-container">
      <h2>Compare Product</h2>

      <div className="compare-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <p className="storage">256 GB</p>
            <h4>{product.name}</h4>
            <p className="price">{product.price}</p>
            <button className="remove-btn">Remove</button>
          </div>
        ))}

        {[...Array(2 - products.length)].map((_, index) => (
          <div className="add-card" key={index}>
            <p>Add a product</p>
            <div className="dropdowns">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">Choose Brand</option>
                {mockBrands.map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>

              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                disabled={!selectedBrand}
              >
                <option value="">Choose Product</option>
                {selectedBrand &&
                  mockProducts[selectedBrand].map((prod) => (
                    <option key={prod}>{prod}</option>
                  ))}
              </select>

              <button onClick={handleAddProduct}>Add</button>
            </div>
          </div>
        ))}
      </div>

      <div className="highlight-toggle">
        <label>
          <input type="checkbox" />
          Highlight differences
        </label>
      </div>

      <div className="highlights">
        <h3>Highlights</h3>
        {products.map((product) => (
          <div className="accordion-item" key={product.id}>
            <button className="accordion-title">
              {product.name}
            </button>
            <div className="accordion-content">
              <ul>
                {product.specs.map((spec, idx) => (
                  <li key={idx}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
