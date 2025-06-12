const produtosPorCategoria = {
  lanches: [
    { nome: 'Whopper', preco: 42.50, img: '../img/Whopper.jpg' },
    { nome: 'Big King', preco: 40.00, img: '../img/BigKing.jpg' },
    { nome: 'Chicken Duplo', preco: 37.50, img: '../img/ChickenDuplo.jpg' },
    { nome: 'Stacker Duplo Bacon', preco: 40.00, img: '../img/StackerDuploBacon.jpg' },
    { nome: 'Mega Stacker 2.0', preco: 55.00, img: '../img/MegaStacker2.0.jpg' },
    { nome: 'Mega Stacker 3.0', preco: 65.00, img: '../img/MegaStacker3.0.jpg' },
    { nome: 'Whopper Rodeio', preco: 52.50, img: '../img/WhopperRodeio.jpg' },
    { nome: 'Whopper Duplo', preco: 55.00, img: '../img/WhopperDuplo.jpg' },
    { nome: 'Whopper Barbecue Bacon', preco: 52.50, img: '../img/WhopperBarbecueBacon.jpg' },
    { nome: 'Whopper Furioso', preco: 52.50, img: '../img/WhopperFurioso.jpg' },
    { nome: 'Whopper Vegetariano', preco: 42.50, img: '../img/WhopperVegetariano.jpg' }
  ],
  snacks: [
    { nome: 'Batata Média', preco: 18.75, img: '../img/BatataMedia.jpg' },
    { nome: 'Bk Chicken', preco: 19.00, img: '../img/BkChicken.jpg' },
    { nome: 'Balde de Batata Frita', preco: 33.75, img: '../img/BaldedeBatata.jpg' }
  ],
  bebidas: [
    { nome: 'Coca-Cola Lata', preco: 5.00, img: '../img/cocaNormal.jpeg' },
    { nome: 'Coca-Cola Zero Lata', preco: 5.00, img: '../img/cocaZero.jpeg' },
    { nome: 'Suco de Laranja', preco: 7.00, img: '../img/pratsLaranja.jpeg' },
    { nome: 'Suco de Uva', preco: 7.00, img: '../img/pratsUva.jpeg' },
    { nome: 'Guarana Lata', preco: 5.00, img: '../img/guaranaNormal.jpeg' },
    { nome: 'Guarana Zero Lata', preco: 5.00, img: '../img/guaranaZero.jpg' },
    { nome: 'Agua', preco: 3.00, img: '../img/agua.webp' },
   
  ],
  sorvetes: [
    { nome: 'Balde Ovomantine', preco: 15.00, img: '../img/Balde_ovomaltine.png' },
    { nome: 'Balde Brownie', preco: 15.00, img: '../img/Balde-Brownie.png' },
    { nome: 'Balde de Doce de Leite', preco: 15.00, img: '../img/baldeDeDoceDeLEITE.png' },
    { nome: 'Balde de Diamante Negro', preco: 15.00, img: '../img/baldeSorveteDiamanteNegro.jpg' },
    { nome: 'Casquinha Mista', preco: 15.00, img: '../img/Casquinha_mista.png' },
    { nome: 'Casquinha De Baunilha', preco: 15.00, img: '../img/Casquinha_baunilha.png' },
  ]


};

let carrinho = [];
// Função responsável por exibir os produtos de uma categoria específica na interface
function mostrarCategoria(categoria) {
  // Seleciona a área onde os produtos serão exibidos
  const areaProdutos = document.getElementById('produtos');
  // Limpa o conteúdo atual da área de produtos
  areaProdutos.innerHTML = '';
// Percorre todos os produtos da categoria selecionada
  produtosPorCategoria[categoria].forEach((produto, index) => {
    // Verifica se o produto já está no carrinho
    const existente = carrinho.find(item => item.nome === produto.nome);
     // Define a quantidade com base no carrinho (ou 0 se ainda não foi adicionado)
    const quantidade = existente ? existente.quantidade : 0;
   //Cria a div que irá representar visualmente o produto
    const div = document.createElement('div');
    div.classList.add('produto');
    // Define o conteúdo HTML do produto (imagem, nome, preço e controle de quantidade)
    div.innerHTML = `
      <img src="${produto.img}" alt="${produto.nome}">
      <h4>${produto.nome}</h4>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <div class="quantidade">
        <button onclick="alterarQuantidade('${categoria}', ${index}, -1)">-</button>
        <span id="qtd-${categoria}-${index}">${quantidade}</span>
        <button onclick="alterarQuantidade('${categoria}', ${index}, 1)">+</button>
      </div>
    `;
     // Adiciona a div do produto à área de exibição
    areaProdutos.appendChild(div);
  });
}


// Função responsável por alterar a quantidade de um produto no carrinho
function alterarQuantidade(categoria, index, delta) {
  //Cria um identificador único para o produto com base na categoria e índice
  const id = `${categoria}-${index}`;

  // Seleciona o elemento HTML que exibe a quantidade do produto
  const span = document.getElementById(`qtd-${id}`);

  // Calcula a nova quantidade, somando o delta (pode ser +1 ou -1
  let qtd = parseInt(span.textContent) + delta;

  // Se a quantidade for menor que 0, define como 0 (não pode haver quantidade negativa)
  if (qtd < 0) qtd = 0;

   // Atualiza o texto do elemento span com a nova quantidade
  span.textContent = qtd;

  // Obtém o produto correspondente à categoria e índice
  const produto = produtosPorCategoria[categoria][index];

  // Verifica se o produto já existe no carrinho
  const existente = carrinho.find(item => item.nome === produto.nome);

  // Se o produto já está no carrinho
  if (existente) {
     // Se a quantidade for 0, remove o produto do carrinho
    if (qtd === 0) {
      carrinho = carrinho.filter(item => item.nome !== produto.nome);
    } else {
      // Se a quantidade for maior que 0, atualiza a quantidade no carrinho
      existente.quantidade = qtd;
    }
     // Se o produto não está no carrinho e a quantidade é maior que 0
  } else if (qtd > 0) {
    // Adiciona o produto ao carrinho com a nova quantidade
    carrinho.push({ ...produto, quantidade: qtd });
  }
// Atualiza a exibição do carrinho (total, produtos, etc.)
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const itensCarrinho = document.getElementById("itensCarrinho");
  const listaCarrinho = document.getElementById("lista-carrinho");
  itensCarrinho.innerHTML = "";
  listaCarrinho.innerHTML = "";

  carrinho.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item-carrinho");
    div.innerHTML = `
      <span>${item.nome}</span>
      <span>Qtd: ${item.quantidade}</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
    `;
    listaCarrinho.appendChild(div);
  });

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  document.getElementById("total").textContent = total.toFixed(2);

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  localStorage.setItem("total", total.toFixed(2));
}

function irParaCupom() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  localStorage.setItem("total", document.getElementById("total").textContent);
  window.location.href = "../cupom/cupom.html";
}

window.onload = function () {
  const carrinhoArmazenado = localStorage.getItem("carrinho");
  if (carrinhoArmazenado) {
    carrinho = JSON.parse(carrinhoArmazenado);
  }

  atualizarCarrinho();
  
  const totalCarrinho = localStorage.getItem('total');
  if (totalCarrinho) {
    document.getElementById('total').textContent = parseFloat(totalCarrinho).toFixed(2);
  }

  mostrarCategoria("lanches"); // ou a categoria padrão que quiser mostrar ao abrir
};


