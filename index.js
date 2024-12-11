const express = require('express');
const app = express();
const PORT = 3000;
const CLIENT = require('./data/clients.json');

app.get('/', (req, res) => {
  res.send('Hola mundo!!');
});

app.get('/api', (req, res) => {
  res.send('api de clientes');
});

app.get('/api/client', (req, res) => {
  res.json(CLIENT.map(c => {
    return {
      id: c.id,
      nombre: c.nombre,
      apellidos: c.apellidos,
      email: c.cuenta.email
    }
  }));
});

app.get('/api/client/:id', (req, res) => {
  const id = req.params.id;
  let filterClient = CLIENT.filter(c => c.id == id);
  if (filterClient.length) {
    res.json(filterClient[0]);
  } else {
    res.send('El cliente con id = ' + id + ' no encontrado');
  }
}); 

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log('El servidor está escuchando en el puerto ' + PORT);
});