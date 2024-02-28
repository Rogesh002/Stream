import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';

const server = fastify();

server.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/',
});

server.post('/upload', async (request, reply) => {
  const data = await request.file(); // Using fastify-multipart
  const filePath = path.join(__dirname, 'uploads', data.filename);
  await data.toFile(filePath); // Save the file
  return { success: true, message: 'File uploaded successfully' };
});

server.listen(3001, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
