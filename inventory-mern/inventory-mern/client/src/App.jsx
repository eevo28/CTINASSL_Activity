import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/items";
const empty = { name: "", sku: "", category: "General", quantity: 0, price: 0 };

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch(API);
      setItems(await res.json());
    } catch {
      setError("Cannot reach the server. Is the API running on port 5000?");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      return setError(data.message || "Something went wrong");
    }
    setForm(empty);
    setEditingId(null);
    load();
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <main className="container">
      <h1>Inventory System</h1>

      <form onSubmit={onSubmit} className="card form">
        <h2>{editingId ? "Edit item" : "Add item"}</h2>
        <input name="name" placeholder="Item name" value={form.name} onChange={onChange} required />
        <input name="sku" placeholder="SKU" value={form.sku} onChange={onChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={onChange} />
        <input name="quantity" type="number" min="0" placeholder="Quantity" value={form.quantity} onChange={onChange} required />
        <input name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={onChange} required />
        <div className="row">
          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button type="button" className="ghost" onClick={() => { setEditingId(null); setForm(empty); }}>
              Cancel
            </button>
          )}
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="card">
        <h2>Items ({items.length})</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>SKU</th><th>Category</th><th>Qty</th><th>Price</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i._id}>
                  <td>{i.name}</td>
                  <td>{i.sku}</td>
                  <td>{i.category}</td>
                  <td>{i.quantity}</td>
                  <td>₱{i.price.toFixed(2)}</td>
                  <td className="actions">
                    <button className="ghost" onClick={() => onEdit(i)}>Edit</button>
                    <button className="danger" onClick={() => onDelete(i._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="6" className="empty">No items yet. Add one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
