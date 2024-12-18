const tbody = document.querySelector('tbody');
const properties = ['nombre', 'apellidos', 'email'];
const divDetails = document.getElementById('details');
const inputNombre = document.getElementById('nombre');
const inputApellidos = document.getElementById('apellidos');
const inputEmail = document.getElementById('email');
const buttonCrear = document.getElementById('crear');

fetch('/api/client')
.then(res => res.json())
.then(clients => {
  console.log(clients);
  clients.forEach(client => addClient(client));
});

function addClient(client) {
  const tr = document.createElement('tr');
  properties.forEach(p => {
    const td = document.createElement('td');
    td.textContent = client[p];
    tr.append(td);
  })
  tr.dataset.id = client.id;
  tbody.append(tr);
}

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  const id = tr.dataset.id;
  console.log(id);
  fetch('api/client/' + id)
  .then(res => res.json())
  .then(client => showClient(client));
});

function showClient(client) {
  console.log(client);
  divDetails.innerHTML = `
      <h1>${client.nombre} ${client.apellidos}</h1>
    <h2>${client.cuenta.email}</h2>
  `
}

buttonCrear.addEventListener('click', () => {
  console.log("creando cliente...");
  const client = {
    nombre: inputNombre.value,
    apellidos: inputApellidos.value,
    "cuenta": {
        "email": inputEmail.value,
        "username": "hharkin18",
        "password": "BGjuN0MnsDEK",
        "idioma": "Catalan"
    },
    "direccion": {
        "localidad": "Arona",
        "calle": "School"
    },
    "fecha_nacimiento": "1962/12/29",
    "estado": {
        "vip": false,
        "visitas_mes": 57,
        "preferencias": [
            "música",
            "fotografía",
            "electrónica"
        ]
    }
  }
  console.log(client);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(client)
  }
  fetch('/api/client', options)
  .then(res => {
    if (res.status == 201) {
      // insertarlo en la tabla
      res.json()
      .then(client => addClient({
        id: client.id,
        nombre: client.nombre, 
        apellidos: client.apellidos, 
        email: client.cuenta.email
      }));
    } else {
      res.text()
      .then(error => console.log('error:', error));
    }
  });
})