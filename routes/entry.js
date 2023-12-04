const router = require("express").Router();
const Entry = require("../models/Entry");
const isAuthenticated = require("./users").isAuthenticated;

// Get all directory entries
router.get("/all", async (req, res) => {
	const entries = await Entry.find();
	res.render('entry/viewall', { entries: entries, isAuthenticated: req.isAuthenticated() });
});

// Handle the search function
router.post("/search", async (req, res) => {
	const search = req.body.text;
	const entries = await Entry.find();
	const searchResults = entries.filter(entry => entry.name.includes(search) || entry.description.includes(search) || entry.address.includes(search));
	res.render('entry/viewall', { entries: searchResults, isAuthenticated: req.isAuthenticated() });
})

// Create entry form
router.get("/create", isAuthenticated, (req, res) => {
	res.render('entry/create', { isAuthenticated: req.isAuthenticated() });
})

// Create entry
router.post("/create", isAuthenticated, async (req, res) => {
	const name = req.body.name;
	const address = req.body.address;
	const phone = req.body.phone;
	const description = req.body.description || "";

	const entry = new Entry({ name, address, phone, description });
	await entry.save();
	res.redirect(`/entry/${entry._id}`);
});

// Get one entry
router.get("/:id", async (req, res) => {
	const entryId = req.params.id;
	const entry = await Entry.findById(entryId);
	res.render('entry/view', { entry: entry, title: "Online Directory " + entry.name, isAuthenticated: req.isAuthenticated() });
})

// Render Update entry template
router.get("/update/:id", isAuthenticated, async (req, res) => {
	const entryId = req.params.id;
	const entry = await Entry.findById(entryId);
	res.render("entry/update", { entry: entry, isAuthenticated: req.isAuthenticated() });
})

// Handle update form submission
router.post("/update/:id", isAuthenticated, async (req, res) => {
	const entryId = req.params.id;
	const data = req.body;
	const entry = await Entry.findByIdAndUpdate(entryId, data);

	res.redirect(`/entry/${entry._id}`);
})

// Handle delete page
router.get("/delete/:id", isAuthenticated, async (req, res) => {
	const entryId = req.params.id;

	await Entry.findOneAndDelete({_id: entryId});
	res.redirect('/entry/all');
});

module.exports = router;