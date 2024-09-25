const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json('Cart not found');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add item to cart
router.post('/', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json('Product not found');

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ userId: req.user.id, items: [] });
        }

        // Add the product to the cart or update quantity
        const existingItem = cart.items.find((item) => item.productId == productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

// Remove item from cart
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json('Cart not found');

        cart.items = cart.items.filter((item) => item.productId != req.params.id);
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

module.exports = router;
