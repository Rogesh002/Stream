import express from 'express';
import fs from 'fs';
import got from 'got';
import FormData from 'form-data';

const app = express();
const port = 3000;

app.get('/send', async (req, res) => {
  // Ensure the file exists before attempting to send it
  const filePath = './enginejson1.txt';
  if (!fs.existsSync(filePath)) {
    return res.status(400).send('File does not exist');
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    // Make sure to pass the form as the body, not as JSON
    const response = await got.post('http://localhost:3001/upload', {
      body: form,
      // got will automatically set the correct Content-Type header for FormData
      hooks: {
        beforeRequest: [
          options => {
            console.log('Requesting', options.url.toString());
          }
        ]
      }
    });

    // Response handling
    console.log(response.body);
    res.send('File sent successfully');
  } catch (error) {
    console.error('Error:', error.response ? error.response.body : error.message);
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
