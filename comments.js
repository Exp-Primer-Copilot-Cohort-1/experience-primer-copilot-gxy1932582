// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { getComments, addComment } = require('./comments');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (req.method === 'GET') {
    if (pathname === '/comments') {
      getComments((err, comments) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comments));
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } else if (req.method === 'POST') {
    if (pathname === '/comments') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const comment = JSON.parse(body);
        addComment(comment, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
          res.writeHead(201, { 'Content-Type': 'text/plain' });
          res.end('Created');
        });
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

server.listen(3000);

console.log('Server running at http://localhost:3000/');