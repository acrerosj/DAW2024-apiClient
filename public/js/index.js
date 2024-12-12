const tbody = document.querySelector('tbody');
const properties = ['nombre', 'apellidos', 'email'];
const divDetails = document.getElementById('details');

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