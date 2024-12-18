const express = require('express');
const app = express();
const PORT = 3000;
const CLIENT = require('./data/clients.json');
let idMax = Math.max(...CLIENT.map(c => c.id));

app.use(express.json());

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

app.post('/api/client', (req, res) => {
  const newClient = req.body;
  let error = [];
  if (!newClient.nombre) error.push('nombre');
  if (!newClient.apellidos) error.push('apellidos');
  if (!newClient.cuenta.email) error.push('email');
  if (error.length == 0) {
    newClient.id = ++idMax;
    CLIENT.push(newClient);
    res.status(201).json(newClient);
  } else {
    res.status(422).send('Faltan los campos: ' + error.join(', '));
  }
})

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log('El servidor está escuchando en el puerto ' + PORT);
});