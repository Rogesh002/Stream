import fs from 'fs';
import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { pipeline } from 'stream';
import { promisify } from 'util';
import got from 'got';

const pipelineAsync = promisify(pipeline);
const fastify = Fastify();

fastify.register(multipart);

fastify.post('/upload', async (request, response) => {
  const data = await request.file();
  const filename = data.filename;
  console.log(`Receiving file: ${filename}`);

  // Define the path where the file will be saved
  const filePath = `./uploads/${filename}`;

  try {
    // Ensure the uploads directory exists
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }

    // Use pipelineAsync to save the file
    await pipelineAsync(data.file, fs.createWriteStream(filePath));

    response.send({ message: 'File uploaded successfully', path: filePath });
  } catch (error) {
    console.error('Failed to upload file:', error);
    response.code(500).send('Failed to process file');
  }
});


fastify.get('/upload', async (request, reply) => {
    const filePath = './enginejson1.txt'; // Ensure this file path is correct
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', (error) => {
        console.error('Stream error:', error);
        reply.send('Error reading file');
    });

    // Convert stream to async iterator to handle backpressure properly
    console.time("ans");
    for await (const chunk of stream) {
        try {
            await got.post('http://localhost:3002/receive', {
                body: chunk,
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });
            console.log('Chunk sent');
        } catch (error) {
            console.error('Error sending chunk:', error);
            reply.code(500).send('Error sending file');
            return; // Stop processing further and exit
        }
    }
    console.timeEnd("ans");
    //console.log(process.hrtime(ans));
    console.log('Finished sending file.');
    reply.send('File sent successfully');
});





fastify.listen({ port: 3001 }, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Fastify server listening on port 3001');
});






// // Fastify Server (Sender) - server3001.js
// import Fastify from 'fastify';
// import multipart from '@fastify/multipart';
// import got from 'got';

// const fastify = Fastify();

// fastify.register(multipart);

// fastify.post('/upload', async (request, reply) => {
//     console.log("file received");
//     const data = await request.file();
//     const filename = data.filename;
//     console.log(`Receiving file: ${filename}`);

//     // Convert stream into an async iterable
//     // This allows us to use a for-await loop to process chunks sequentially
//     const stream = data.file;
//     const iterator = stream[Symbol.asyncIterator]();

//     try {
//         let result = await iterator.next();
//         while (!result.done) {
//             const chunk = result.value;
//             // Send chunk and wait for the request to complete before proceeding
//             await got.post('http://localhost:3002/receive', {
//                 body: chunk,
//                 headers: {
//                     'Content-Type': 'application/octet-stream',
//                 },
//             });
//             console.log(`Sent chunk: ${chunk.length}`);
//             // Proceed to the next chunk
//             result = await iterator.next();
//         }
//         console.log('Finished streaming file.');
//         reply.code(200).send('File is being processed');
//     } catch (error) {
//         console.error('Error during file transfer:', error);
//         reply.code(500).send('Failed to process file');
//     }
// });

// fastify.listen({ port: 3001 }, err => {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     }
//     console.log('Fastify (Sender) server listening on port 3001');
// });



