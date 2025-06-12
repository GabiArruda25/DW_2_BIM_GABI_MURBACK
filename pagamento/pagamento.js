window.onload = function () {
  const totalOriginal = parseFloat(localStorage.getItem("total")) || 0;
  const cupomDigitado = localStorage.getItem("cupom") || "";

  const cuponsValidos = {
    DESCONTO10: 0.10,
    BK2025: 0.15,
    FURIA15: 0.15,
    SUPER5: 0.05
  };

  let desconto = 0;
  if (cuponsValidos[cupomDigitado]) {
    desconto = cuponsValidos[cupomDigitado];
  }

  const valorComDesconto = totalOriginal * (1 - desconto);
  document.getElementById("valorFinal").textContent = `R$ ${valorComDesconto.toFixed(2)}`;
  document.getElementById("valorTotal").textContent = `Total: R$ ${valorComDesconto.toFixed(2)}`;

  localStorage.setItem("valorFinal", valorComDesconto.toFixed(2));
};

// Função responsável por exibir o método de pagamento escolhido (PIX ou Cartão)
function selecionarPagamento(tipo) {
  // Seleciona a área de exibição do PIX na interface
  const pixArea = document.getElementById("pix-area");

  // Verifica se o tipo de pagamento é "pix"
  if (tipo === "pix") {
    pixArea.style.display = "block";

    // Define os dados do pagamento via PIX (chave PIX, nome do recebedor, cidade e valor)
    const chavePix = "13885897962"; // CPF
    const nome = "Gabriela Murback";
    const cidade = "SAO PAULO";
    const valor = parseFloat(localStorage.getItem("valorFinal")) || 0;

     // Gera o payload (dados formatados) para o pagamento via PIX usando a função 'gerarPayloadPix'
    const payload = gerarPayloadPix({
      chave: chavePix,
      nome,
      cidade,
      valor
    });

     // Cria um QR Code no elemento com id 'qrcode' usando os dados gerados (payload)
    QRCode.toCanvas(document.getElementById("qrcode"), payload, function (error) {

      // Caso ocorra um erro na geração do QR Code, ele será exibido no console
      if (error) console.error(error);
    });
  } else {
     // Se o pagamento selecionado não for "pix", esconde a área de pagamento via PIX
    pixArea.style.display = "none";

    // Exibe uma mensagem indicando que o pagamento com cartão foi selecionado
    alert("Pagamento com cartão selecionado!");
  }
}

document.getElementById("voltar-cupom").addEventListener("click", function () {
  window.location.href = "../cupom/cupom.html";
});


// Função responsável por gerar o payload do pagamento via PIX, com todos os dados necessários no formato correto
function gerarPayloadPix({ chave, nome, cidade, valor }) {
  const valorFormatado = valor.toFixed(2);

  // Gera a string Merchant Account Info (informações da conta do comerciante) conforme o padrão do PIX
  const merchantAccountInfo = `0014BR.GOV.BCB.PIX01${chave.length.toString().padStart(2, "0")}${chave}`;

  // Calcula o comprimento da Merchant Account Info para usar no campo de comprimento da conta
  const merchantInfoLength = merchantAccountInfo.length.toString().padStart(2, "0");


  // A função cria uma lista com todas as informações necessárias para o pagamento, seguindo o formato exigido pelo sistema do PIX
  const payload = [
    "000201", // Payload Format Indicator
    `26${merchantInfoLength}${merchantAccountInfo}`, // Merchant Account Info
    "52040000", // Merchant Category Code
    "5303986", // Transaction Currency (BRL)
    `54${valorFormatado.length.toString().padStart(2, "0")}${valorFormatado}`, // Transaction Amount
    "5802BR", // Country Code
    `59${nome.length.toString().padStart(2, "0")}${nome}`, // Merchant Name
    `60${cidade.length.toString().padStart(2, "0")}${cidade}`, // Merchant City
    "62070503***", // Additional Data Field Template (random txid)
    "6304" // CRC placeholder
  ];

   // A função pega todos os pedaços de informações e junta tudo em uma única sequência de texto, criando o payload completo.
  const payloadCompleto = payload.join("");

   // A função cria um código de verificação (CRC16) para garantir que os dados não foram alterados ou corrompidos.
  const crc = gerarCRC16(payloadCompleto);

  //Retorna o payload completo com o CRC16 adicionado no final, que é a versão final para o QR Code
  return payloadCompleto + crc;
}

function gerarCRC16(str) {
  let polinomio = 0x1021;
  let resultado = 0xFFFF;

  for (let i = 0; i < str.length; i++) {
    resultado ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((resultado & 0x8000) !== 0) {
        resultado = (resultado << 1) ^ polinomio;
      } else {
        resultado <<= 1;
      }
      resultado &= 0xFFFF;
    }
  }

  return resultado.toString(16).toUpperCase().padStart(4, "0");
}



// Redirecionar para o login se não houver usuário logado
window.addEventListener("load", () => {
  const loggedIn = localStorage.getItem("loggedIn"); // Supondo que você defina isso no login
  if (loggedIn !== "true") {
    alert("Você precisa estar logado para acessar a página de pagamento.");
    window.location.href = "../login/login.html";
  }
});

