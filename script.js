
let dishes = JSON.parse(localStorage.getItem('dishes') || '[]');
let orders = JSON.parse(localStorage.getItem('orders') || '[]');
let currentUser = null;

function loadUsers() {
  const saved = localStorage.getItem('users');
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function saveDishes() {
  localStorage.setItem('dishes', JSON.stringify(dishes));
}

function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

let users = loadUsers();

function registerUser() {
  const name = document.getElementById('new-name').value;
  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const role = document.getElementById('new-role').value;
  if (!name || !username || !password) return alert('Preencha todos os campos');
  if (users.some(u => u.username === username)) return alert('Usuário já existe');
  users.push({ id: Date.now(), name, username, password, role });
  saveUsers(users);
  alert('Usuário cadastrado com sucesso!');
  document.getElementById('new-name').value = '';
  document.getElementById('new-username').value = '';
  document.getElementById('new-password').value = '';
}

function login() {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  const user = users.find(uobj => uobj.username === u && uobj.password === p);
  if (user) {
    currentUser = user;
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadDashboard();
  } else {
    document.getElementById('login-error').innerText = 'Usuário ou senha inválidos';
  }
}

function logout() {
  currentUser = null;
  document.getElementById('auth-container').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

function loadDashboard() {
  document.getElementById('user-count').innerText = users.length;
  document.getElementById('dish-count').innerText = dishes.length;
  document.getElementById('order-count').innerText = orders.length;
  renderUsers();
  renderTable('dish', dishes);
  renderTable('order', orders);
}

function renderUsers() {
  let html = `<tr><th>Nome</th><th>Perfil</th><th>Ações</th></tr>`;
  for (const u of users) {
    html += `<tr><td>${u.name}</td><td>${u.role}</td><td><button onclick="deleteUser('${u.username}')">Excluir</button></td></tr>`;
  }
  document.getElementById('user-table').innerHTML = html;
}

function deleteUser(username) {
  users = users.filter(u => u.username !== username);
  saveUsers(users);
  loadDashboard();
}

function renderTable(type, list) {
  let html = '<tr>';
  if (type === 'dish') html += '<th>Nome</th><th>Ações</th>';
  if (type === 'order') html += '<th>ID</th><th>Status</th><th>Ações</th>';
  html += '</tr>';
  for (const item of list) {
    if (type === 'dish') html += `<tr><td>${item.name}</td><td><button onclick="deleteItem('${type}', ${item.id})">Excluir</button></td></tr>`;
    if (type === 'order') html += `<tr><td>${item.id}</td><td>${item.status}</td><td><button onclick="deleteItem('${type}', ${item.id})">Excluir</button></td></tr>`;
  }
  document.getElementById(`${type}-table`).innerHTML = html;
}

function deleteItem(type, id) {
  let list = type === 'dish' ? dishes : orders;
  const idx = list.findIndex(e => e.id === id);
  if (idx > -1) list.splice(idx, 1);
  if (type === 'dish') saveDishes();
  if (type === 'order') saveOrders();
  loadDashboard();
}

function openForm(type) {
  const form = document.getElementById('entity-form');
  form.innerHTML = '';
  if (type === 'dish') {
    form.innerHTML = `<input type='text' id='dish-name' placeholder='Nome do Prato'><button type='button' onclick='saveDish()'>Salvar</button>`;
  }
  if (type === 'order') {
    form.innerHTML = `<input type='text' id='order-status' placeholder='Status do Pedido'><button type='button' onclick='saveOrder()'>Salvar</button>`;
  }
  document.getElementById('form-modal').classList.remove('hidden');
}

function closeForm() {
  document.getElementById('form-modal').classList.add('hidden');
}

function saveDish() {
  const name = document.getElementById('dish-name').value;
  if (!name) return;
  dishes.push({ id: Date.now(), name });
  saveDishes();
  closeForm();
  loadDashboard();
}

function saveOrder() {
  const status = document.getElementById('order-status').value;
  if (!status) return;
  orders.push({ id: Date.now(), status });
  saveOrders();
  closeForm();
  loadDashboard();
}
