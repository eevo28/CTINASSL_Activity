const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    sku: { type: String, required: [true, "SKU is required"], unique: true, trim: true },
    category: { type: String, default: "General", trim: true },
    quantity: { type: Number, required: true, min: [0, "Quantity cannot be negative"], default: 0 },
    price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
