import express from 'express';
import fs from 'fs';
import got from 'got';
import FormData from 'form-data';

const app = express();
const port = 3000;

app.get('/send', async (req, res) => {
  const form = new FormData();
  form.append('file', fs.createReadStream('./enginejson1.txt')); // Ensure this file exists

  try {
    const response = await got.post('http://localhost:3001/upload', {
      body: form,
      // got v11 and later automatically set the appropriate headers based on the FormData instance
    });
    console.log(response.body);
    res.send('File sent successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Failed to send file');
  }
});

app.listen(port, () => {
  console.log(`Sender running on port ${port}`);
});



// //const http = require('http');

// import http from 'http';

// import { promises as fs } from 'fs';


// const server = http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// });

// const PORT = 3000;
// server.listen(PORT, '127.0.0.1', () => {
//   console.log(`Server running at http://127.0.0.1:${PORT}/`);
// });
