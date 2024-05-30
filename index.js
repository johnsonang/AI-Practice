import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Item from './models/Item.js';

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://angjs84:Ud3KSRzZe8e3Q6Bd@cluster0.hkauyf3.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
console.log('Mongoose connected to DB Cluster');
});

mongoose.connection.on('error', (error) => {
console.error(`Mongoose connection error: ${error}`);
});

mongoose.connection.on('disconnected', () => {
console.log('Mongoose disconnected');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.render('items', { items });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/items', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    quantity: req.body.quantity
  });

  try {
    await newItem.save();
    res.redirect('/items');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
