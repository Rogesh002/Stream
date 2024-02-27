

import Fastify from 'fastify';

import fastifyMultipart from '@fastify/multipart';

const fastify = Fastify();

fastify.register(fastifyMultipart);

  fastify.post('/upload', async (request, reply) => {
    // Access the file from the request
    const file = await request.file();
    const filename = file.filename;
    
    // You can now save the file to disk, process it, etc.
    // For demonstration, let's just log the filename
    console.log(`Received file: ${filename}`);
  
    // Respond to the client
    return reply.code(200).send('File uploaded successfully');
  });

  const start = async () => {
    try {
      await fastify.listen({ port: 3001 });
      console.log(`Receiver running on port 3001`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  start();
// import express from 'express';
// import multer from 'multer';

// const upload = multer({ dest: 'uploads/' });

// const app = express();
// const port = 3001;

// app.post('/upload', upload.single('file'), (req, res) => {
//   console.log(`Received file: ${req.file.originalname}`);
//   res.status(200).send('File uploaded successfully');
// });

// app.listen(port, () => {
//   console.log(`Receiver running on port ${port}`);
// });




