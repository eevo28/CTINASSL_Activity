const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");

const router = express.Router();

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid item id" });
  }
  next();
};

const handleError = (err, res) => {
  if (err.code === 11000) return res.status(409).json({ message: "SKU already exists" });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  console.error(err);
  return res.status(500).json({ message: "Server error" });
};

// CREATE
router.post("/", async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    handleError(err, res);
  }
});

// READ all
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    handleError(err, res);
  }
});

// READ one
router.get("/:id", validId, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    handleError(err, res);
  }
});

// UPDATE
router.put("/:id", validId, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE
router.delete("/:id", validId, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted", id: item._id });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
