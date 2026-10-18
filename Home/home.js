const API_URL = "http://localhost:3000/motorcycles";

const botoes = document.querySelectorAll(".nav-btn");
const cards = document.querySelectorAll("main > div");
const bodyRead = document.getElementById("motos-body");
const bodyDelete = document.getElementById("delete-body");
const formCreate = document.getElementById("form-create");
const formUpdate = document.getElementById("form-update");
let motosCache = [];

let idEditando = null;

// ---------- NAVEGAÇÃO ----------
function mostrarCard(pagina) {
  cards.forEach((card) => card.classList.add("hidden"));
  document.getElementById(pagina + "-card").classList.remove("hidden");

  if (pagina === "read" || pagina === "delete") {
    carregarMotos();
  }
}

botoes.forEach((botao) => {
  botao.addEventListener("click", () => mostrarCard(botao.dataset.page));
});

// ---------- READ ----------
async function carregarMotos() {
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) throw new Error("Erro " + resposta.status);
    const motos = await resposta.json();
    motosCache = motos; // guarda a lista
    renderizarTabelas(motos);
  } catch (erro) {
    console.error("Falha ao buscar motos:", erro);
  }
}

function renderizarTabelas(motos) {
  const colunas = (m) => `
    <td>${m.id}</td>
    <td>${m.brand}</td>
    <td>${m.model}</td>
    <td>${m.cc}</td>
    <td>${m.description}</td>`;

  bodyRead.innerHTML = motos
    .map(
      (m) => `
    <tr>${colunas(m)}
      <td><div class="container-submit">
        <button type="button" onclick="editarMoto('${m.id}')">Editar</button>
        <button type="button" onclick="deletarMoto('${m.id}')">Deletar</button>
      </div></td>
    </tr>`
    )
    .join("");

  bodyDelete.innerHTML = motos
    .map(
      (m) => `
    <tr>${colunas(m)}
      <td><div class="container-submit">
        <button type="button" onclick="deletarMoto('${m.id}')">Deletar</button>
      </div></td>
    </tr>`
    )
    .join("");
}

// ---------- CREATE ----------
async function criarMoto(dados) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

formCreate.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nova = {
    brand: document.getElementById("marca").value,
    model: document.getElementById("modelo").value,
    cc: Number(document.getElementById("cc").value),
    description: document.getElementById("descricao").value,
  };

  await criarMoto(nova); // espera salvar...
  formCreate.reset();
  mostrarCard("read"); // ...e só então vai para o Read
});

// ---------- DELETE ----------
async function deletarMoto(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  carregarMotos();
}

// ---------- UPDATE ----------
function editarMoto(id) {
  const moto = motosCache.find((m) => String(m.id) === String(id));
  if (!moto) return;

  idEditando = id;
  document.getElementById("up-marca").value = moto.brand;
  document.getElementById("up-modelo").value = moto.model;
  document.getElementById("up-cc").value = moto.cc ?? "";
  document.getElementById("up-descricao").value = moto.description;

  mostrarCard("update");
}

formUpdate.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (idEditando === null) return;

  const editada = {
    brand: document.getElementById("up-marca").value,
    model: document.getElementById("up-modelo").value,
    cc: Number(document.getElementById("up-cc").value),
    description: document.getElementById("up-descricao").value,
  };

  await fetch(`${API_URL}/${idEditando}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editada),
  });

  idEditando = null;
  formUpdate.reset();
  mostrarCard("read");
});

// ---------- INÍCIO ----------
mostrarCard("create");