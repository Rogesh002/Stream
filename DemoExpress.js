import express from 'express';
import fs from 'fs';
import FormData from 'form-data';
import got from 'got';

const app = express();
const port = 3003;

app.get('/send', async (req, res) => {
  const filePath = './enginejson1.txt';
  if (!fs.existsSync(filePath)) {
    return res.status(400).send('File does not exist');
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await got.post('http://localhost:3001/upload', {
      body: form,
      hooks: {
        beforeRequest: [
          options => {
            console.log('Requesting', options.url.toString());
          }
        ]
      },
      responseType: 'json', // If the server responds with JSON
    });

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
