const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	address: { type: String, required: true },
	phone: { type: String, required: true },
	description: { type: String, required: false }
});

module.exports = new mongoose.model('Entry', EntrySchema);