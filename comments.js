// Creat web server
// 1. Require express
// 2. Create an express application
// 3. Create a route for GET /comments
// 4. Create a route for POST /comments
// 5. Create a route for DELETE /comments/:id
// 6. Listen on port 3000

const express = require('express');
const fs = require('fs');
const app = express();
const comments = require('./comments.json');

app.use(express.json());

app.get('/comments', (req, res) => {
    res.json(comments);
});

app.post('/comments', (req, res) => {
    const comment = req.body;
    comments.push(comment);

    fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
        if (err) {
            res.status(500).send('Could not write to file');
        } else {
            res.status(201).send('Comment added');
        }
    });
});

app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    const index = comments.findIndex(comment => comment.id == id);

    if (index === -1) {
        res.status(404).send('Comment not found');
    } else {
        comments.splice(index, 1);

        fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
            if (err) {
                res.status(500).send('Could not write to file');
            } else {
                res.status(200).send('Comment deleted');
            }
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});