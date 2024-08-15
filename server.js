const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define the Pizza schema and model
const pizzaSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.redirect('/items');
});

// List all items
app.get('/items', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.render('index', { pizzas });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a new item
app.get('/items/new', (req, res) => {
  res.render('new');
});

app.post('/items', async (req, res) => {
  const { name, price } = req.body;
  try {
    const pizza = new Pizza({ name, price });
    await pizza.save();
    res.redirect('/items');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Edit an existing item
app.get('/items/:id/edit', async (req, res) => {
  const { id } = req.params;
  try {
    const pizza = await Pizza.findById(id);
    res.render('edit', { pizza });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    await Pizza.findByIdAndUpdate(id, { name, price });
    res.redirect('/items');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Pizza.findByIdAndDelete(id);
    res.redirect('/items');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});