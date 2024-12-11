const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hola mundo!!');
});

app.get('/api', (req, res) => {
  res.send('api de clientes');
});

app.get('/api/client/:id', (req, res) => {
  const id = req.params.id;
  res.send('Dados del cliente con id = ' + id);
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log('El servidor está escuchando en el puerto ' + PORT);
});