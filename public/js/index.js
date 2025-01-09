const tbody = document.querySelector('tbody');
const properties = ['nombre', 'apellidos', 'email'];
const divDetails = document.getElementById('details');
const inputNombre = document.getElementById('nombre');
const inputApellidos = document.getElementById('apellidos');
const inputEmail = document.getElementById('email');
const buttonCrear = document.getElementById('crear');
const editPanel = document.getElementById('edit-panel');
const buttonCancelar = document.getElementById('cancelar');
const inputEditNombre = document.getElementById('edit-nombre');
const inputEditApellidos = document.getElementById('edit-apellidos');
const inputEditEmail = document.getElementById('edit-email');
const inputEditId = document.getElementById('edit-id');
const buttonGuardar = document.getElementById('guardar');
let clientEditing;

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
  clientEditing = client;
  divDetails.innerHTML = `
      <h1>${client.nombre} ${client.apellidos}</h1>
    <h2>${client.cuenta.email}</h2>
    <p>${client.direccion.localidad}</p>
    <button onclick="deleteClient(${client.id})">Eliminar</button>
    <button onclick="editClient()">Modificar</button>
  `;
  inputEditNombre.value = client.nombre;
  inputEditApellidos.value = client.apellidos;
  inputEditEmail.value = client.cuenta.email;
  editPanel.hidden = true;
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

function deleteClient(id) {
  console.log('Eliminando el cliente con id: ' + id);
  fetch('/api/client/' + id, {method: 'DELETE'})
  .then(res => {
    if (res.status == 200) {
      console.log('El cliente ha sido eliminado.');
      divDetails.innerHTML = '';
      const trClient = document.querySelector('[data-id = "' + id + '"]')
      console.log(trClient);
      trClient.remove();
      editPanel.hidden = true;
      clientEditing = null;
    } else {
      console.log('El cliente no se ha encontrado.');
    }
  })
}

function editClient() {
  editPanel.hidden = false;
}

buttonCancelar.addEventListener('click', () => {
  editPanel.hidden = true;
  inputEditNombre.value = clientEditing.nombre;
  inputEditApellidos.value = clientEditing.apellidos;
  inputEditEmail.value = clientEditing.cuenta.email;
});

buttonGuardar.addEventListener('click', () => {
  console.log('guardando...');
  let client = clientEditing;
  client.nombre = inputEditNombre.value;
  client.apellidos = inputEditApellidos.value;
  client.cuenta.email = inputEditEmail.value;
  let options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(client)
  }
  fetch('/api/client/' + client.id, options)
  .then(res => {
    if (res.status == 200) {
      console.log('Se ha modificado con éxito.');
      const trEdit = document.querySelector('[data-id="' + client.id+ '"]');
      console.log(trEdit);
      trEdit.children[0].textContent = client.nombre;
      trEdit.children[1].textContent = client.apellidos;
      trEdit.children[2].textContent = client.cuenta.email;
      showClient(client);
    } else {
      console.log('Error al modificar los datos');
    }
  })
});