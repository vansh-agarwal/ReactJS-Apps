import { useState } from "react";
import "./App.css";

const initialProducts = [
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: 599, stock: 12 },
  { id: 2, name: "USB Hub", category: "Electronics", price: 349, stock: 3 },
  { id: 3, name: "Desk Lamp", category: "Furniture", price: 799, stock: 7 },
  { id: 4, name: "Notebook A5", category: "Stationery", price: 89, stock: 2 },
  { id: 5, name: "Whiteboard Marker", category: "Stationery", price: 45, stock: 50 },
];

const emptyForm = { id: "", name: "", category: "", price: "", stock: "" };

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const validate = () => {
    const e = {};
    if (!form.id || isNaN(form.id) || Number(form.id) <= 0) e.id = "Valid positive ID required";
    if (!editingId && products.find((p) => p.id === Number(form.id))) e.id = "Product ID already exists";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price required";
    if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "Valid stock quantity required";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const product = {
      id: Number(form.id),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingId !== null) {
      setProducts(products.map((p) => (p.id === editingId ? product : p)));
      setEditingId(null);
    } else {
      setProducts([...products, product]);
    }
    setForm(emptyForm);
    setErrors({});
  };

  const handleEdit = (p) => {
    setForm({ id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock });
    setEditingId(p.id);
    setErrors({});
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    if (editingId === id) { setEditingId(null); setForm(emptyForm); }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <span className="header-icon">📦</span>
          <h1>Smart Inventory</h1>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-value">{products.length}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat warning">
            <span className="stat-value">{lowStockCount}</span>
            <span className="stat-label">Low Stock</span>
          </div>
        </div>
      </header>

      {lowStockCount > 0 && (
        <div className="alert-banner">
          ⚠️ {lowStockCount} product{lowStockCount > 1 ? "s" : ""} running low on stock (less than 5 units)!
        </div>
      )}

      <div className="content">
        {/* FORM */}
        <div className="card form-card">
          <h2>{editingId !== null ? "✏️ Edit Product" : "➕ Add Product"}</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label>Product ID</label>
                <input
                  type="number"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="e.g. 101"
                  disabled={editingId !== null}
                />
                {errors.id && <span className="error">{errors.id}</span>}
              </div>
              <div className="field">
                <label>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Product name" />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="field">
                <label>Category</label>
                <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Electronics" />
                {errors.category && <span className="error">{errors.category}</span>}
              </div>
              <div className="field">
                <label>Price (₹)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
              <div className="field">
                <label>Stock</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Quantity" />
                {errors.stock && <span className="error">{errors.stock}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId !== null ? "Update Product" : "Add Product"}
              </button>
              {editingId !== null && (
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="card table-card">
          <div className="table-header">
            <h2>🗂️ Product List</h2>
            <input
              className="search-input"
              type="text"
              placeholder="🔍 Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-row">No products found.</td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className={p.stock < 5 ? "low-stock-row" : ""}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td><span className="badge">{p.category}</span></td>
                      <td>₹{p.price.toLocaleString()}</td>
                      <td>
                        <span className={`stock-badge ${p.stock < 5 ? "stock-low" : "stock-ok"}`}>
                          {p.stock < 5 && "⚠️ "}{p.stock}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-sm btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
