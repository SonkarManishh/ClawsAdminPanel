// routes/listings.js
const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// Get all listings
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find({});
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single listing by ID
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new listing
router.post('/', async (req, res) => {
    const listing = new Listing(req.body);
    try {
        const newListing = await listing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a listing by ID
router.patch('/:id', async (req, res) => {
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a listing by ID
router.delete('/:id', async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
