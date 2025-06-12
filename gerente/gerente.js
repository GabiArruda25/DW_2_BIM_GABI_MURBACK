let produtos = [];

function carregarProdutos() {
  fetch('http://localhost:3000/produtos')
    .then(res => res.json())
    .then(dados => {
      produtos = dados;
      renderizarTabela();
    })
    .catch(error => {
      console.error('Erro ao carregar produtos:', error);
    });
}

function renderizarTabela() {
  const tbody = document.querySelector("#tabela-produtos tbody");
  tbody.innerHTML = "";

  produtos.forEach((produto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria || ''}</td>
      <td>R$ ${produto.preco.toFixed(2)}</td>
      <td>${produto.foto ? `<img src="${produto.foto}" alt="${produto.nome}" style="max-width: 80px;">` : 'Sem foto'}</td>
      <td>
        <button onclick="editarProduto(${index})">Editar</button>
        <button onclick="removerProduto('${produto.id}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function removerProduto(id) {
  if (confirm("Deseja realmente excluir este produto?")) {
    fetch(`http://localhost:3000/produtos/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      carregarProdutos();
    })
    .catch(error => {
      console.error('Erro ao excluir produto:', error);
    });
  }
}

function editarProduto(index) {
  const produto = produtos[index];
  const nome = prompt("Novo nome:", produto.nome);
  const preco = parseFloat(prompt("Novo preço:", produto.preco));
  const categoria = prompt("Nova categoria:", produto.categoria || '');
  
  if (!nome || isNaN(preco)) return alert("Dados inválidos.");

  fetch(`http://localhost:3000/produtos/${produto.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, preco, categoria, foto: produto.foto })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    carregarProdutos();
  })
  .catch(error => {
    console.error('Erro ao editar produto:', error);
  });
}

document.getElementById("adicionar-btn").addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const preco = parseFloat(document.getElementById("preco").value);
  const categoria = document.getElementById("categoria").value.trim();
  const fotoInput = document.getElementById("foto");

  if (!nome || isNaN(preco)) return alert("Preencha corretamente nome e preço.");

  const id = Date.now().toString();

  if (fotoInput.files.length > 0) {
    const file = fotoInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const fotoBase64 = e.target.result;
      fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nome, preco, categoria, foto: fotoBase64 })
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        carregarProdutos();
        limparFormulario();
      })
      .catch(error => {
        console.error('Erro ao adicionar produto:', error);
      });
    };
    reader.readAsDataURL(file);
  } else {
    fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nome, preco, categoria, foto: "" })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      carregarProdutos();
      limparFormulario();
    })
    .catch(error => {
      console.error('Erro ao adicionar produto:', error);
    });
  }
});

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("foto").value = "";
}

// CUPONS
function carregarCupons() {
  fetch('http://localhost:3000/cupons')
    .then(res => res.json())
    .then(cupons => {
      const tbody = document.querySelector("#tabela-cupons tbody");
      tbody.innerHTML = "";
      cupons.slice(1).forEach(([codigo, percentual]) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${codigo}</td>
          <td>${percentual}%</td>
          <td><button onclick="excluirCupom('${codigo}')">Excluir</button></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar cupons:', error);
    });
}

document.getElementById("adicionar-cupom-btn").addEventListener("click", () => {
  const codigo = document.getElementById("codigo-cupom").value.trim();
  const percentual = parseFloat(document.getElementById("percentual-cupom").value);
  
  if (!codigo || isNaN(percentual) || percentual <= 0 || percentual > 100) {
    alert("Cupom inválido.");
    return;
  }
  
  fetch('http://localhost:3000/cupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo, percentual })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    carregarCupons();
    document.getElementById("codigo-cupom").value = "";
    document.getElementById("percentual-cupom").value = "";
  })
  .catch(error => {
    console.error('Erro ao adicionar cupom:', error);
  });
});

function excluirCupom(codigo) {
  if (confirm("Deseja realmente excluir este cupom?")) {
    fetch(`http://localhost:3000/cupons/${encodeURIComponent(codigo)}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      carregarCupons();
    })
    .catch(error => {
      console.error('Erro ao excluir cupom:', error);
    });
  }
}

// USUÁRIOS
document.getElementById("promover-btn").addEventListener("click", () => {
  const email = document.getElementById("email-usuario").value.trim();
  if (!email) return alert("Informe o email.");
  
  fetch('http://localhost:3000/usuarios/promover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    document.getElementById("email-usuario").value = "";
  })
  .catch(error => {
    console.error('Erro ao promover usuário:', error);
  });
});

document.getElementById("excluir-usuario-btn").addEventListener("click", () => {
  const email = document.getElementById("email-usuario").value.trim();
  if (!email) return alert("Informe o email.");
  
  if (confirm("Deseja realmente excluir este usuário?")) {
    fetch(`http://localhost:3000/usuarios/${encodeURIComponent(email)}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById("email-usuario").value = "";
    })
    .catch(error => {
      console.error('Erro ao excluir usuário:', error);
    });
  }
});

// Carregar dados ao inicializar a página
carregarProdutos();
carregarCupons();

