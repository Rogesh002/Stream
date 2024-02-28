// import express from 'express';

// const app = express();
// const port = 3002;

// app.use(express.json());

// app.post('/receive', (req, res) => {
   
//     console.time("start");
//     req.on('data', chunk => {
//         console.time("3002");
//         console.log(`Received chunk: ${chunk.length}`);
//         console.timeEnd("3002");
//         // Here, you can process the chunk, save it, or do anything else required.
//     });
//     console.timeEnd("start");
//     req.on('end', () => {
//         console.log('Finished receiving chunks.');
//         res.send('Chunks received successfully');
//     });

    

   
// });


import express from 'express';
import fs from 'fs';
import { promisify } from 'util';

const app = express();
const port = 3002;
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const targetFilePath = './enginejson2.txt'; // Define the path for the output file

app.post('/receive', express.raw({ type: 'application/octet-stream', limit: '50mb' }), async (req, res) => {
    //console.time("Processing Chunk");
    try {
        // Check if the file exists. If not, create it, otherwise append to it
        if (!fs.existsSync(targetFilePath)) {
            await writeFile(targetFilePath, req.body);
            console.log('File created and chunk written');
        } else {
            await appendFile(targetFilePath, req.body);
            console.log('Chunk appended to file');
        }
        res.send('Chunk received');
    } catch (error) {
        console.error('Error processing chunk:', error);
        res.status(500).send('Error processing chunk');
    }
    //onsole.timeEnd("Processing Chunk");
});





app.listen(port, () => console.log(`Express (Receiver) server listening on port ${port}`));