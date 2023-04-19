const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/microblog', { useNewUrlParser: true });

// Create schema for blog post
const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    date: { type: Date, default: Date.now },
});

// Create model for blog post
const Post = mongoose.model('Post', postSchema);

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public_html')));

// Create route for creating a new blog post
app.post('/posts', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        body: req.body.body,
    });
    try {
        const savedPost = await post.save();
        res.status(201).send(savedPost);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create route for getting all blog posts
app.get('/posts', (req, res) => {
    Post.find().then((posts) => {
        res.send(posts);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
