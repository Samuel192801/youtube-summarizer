const express = require('express');
const http = require('http');
const { app, server } = require('./server');

server.listen(3000, () => {
  console.log('🧠 Sumarizador de vídeos iniciado em http://localhost:3000');
});
