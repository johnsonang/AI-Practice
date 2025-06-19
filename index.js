import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Item from './models/Item.js';
import OpenAI from 'openai';

const app = express();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
app.use(express.json()); // Use express.json() for parsing JSON bodies
app.use(express.static('public'));
app.use(express.static('public/chat-app/dist')); // Serve static files from React build



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

app.get('/chatpage', (req, res) => {
  res.render('chat');
});

// API route for chat
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: userMessage }],
      model: 'gpt-3.5-turbo',
    });

    const aiMessageContent = completion.choices[0].message.content;
    res.json({ response: aiMessageContent });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
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
