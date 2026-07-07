const palavras = [
  {
    texto: "ENXAME",
    dica: "Abelhas"
  },
  {
    texto: "ALCATEIA",
    dica: "Lobos"
  },
  {
    texto: "CARDUME",
    dica: "Peixes"
  },
  {
    texto: "BANDO",
    dica: "Aves"
  },
  {
    texto: "MANADA",
    dica: "Bois ou elefantes"
  },
  {
    texto: "MATILHA",
    dica: "Cães"
  },
  {
    texto: "REBANHO",
    dica: "Ovelhas"
  },
  {
    texto: "VARA",
    dica: "Porcos"
  },
  {
    texto: "CAVALARIA",
    dica: "Cavalos"
  },
  {
    texto: "COLMEIA",
    dica: "Abelhas em moradia"
  },
  {
    texto: "NINHADA",
    dica: "Filhotes"
  },
  {
    texto: "NUVEM",
    dica: "Gafanhotos"
  },
  {
    texto: "CAFILA",
    dica: "Camelos"
  },
  {
    texto: "FATO",
    dica: "Cabras"
  }
];

const tamanhoGrade = 16;
const letrasAleatorias = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const telaInicial = document.getElementById("telaInicial");
const telaJogo = document.getElementById("telaJogo");
const botaoIniciar = document.getElementById("iniciar");
const botaoVoltar = document.getElementById("voltar");
const botaoReiniciar = document.getElementById("reiniciar");

const gradeElemento = document.getElementById("grade");
const listaPalavras = document.getElementById("listaPalavras");
const encontradasTexto = document.getElementById("encontradas");
const totalPalavrasTexto = document.getElementById("totalPalavras");
const mensagem = document.getElementById("mensagem");

let grade = [];
let palavrasPosicionadas = [];
let palavrasEncontradas = [];
let primeiraCelula = null;

const direcoes = [
  { linha: 0, coluna: 1 },
  { linha: 1, coluna: 0 },
  { linha: 1, coluna: 1 },
  { linha: -1, coluna: 1 }
];

function mostrarTelaInicial() {
  telaJogo.classList.remove("ativa");
  telaInicial.classList.add("ativa");
}

function mostrarTelaJogo() {
  telaInicial.classList.remove("ativa");
  telaJogo.classList.add("ativa");
  iniciarJogo();
}

function iniciarJogo() {
  grade = criarGradeVazia();
  palavrasPosicionadas = [];
  palavrasEncontradas = [];
  primeiraCelula = null;

  posicionarTodasPalavras();
  preencherEspacosVazios();
  montarGradeNaTela();
  montarListaPalavras();

  encontradasTexto.textContent = "0";
  totalPalavrasTexto.textContent = palavras.length;
  mensagem.textContent = "Clique na primeira e na última letra da palavra.";
}

function criarGradeVazia() {
  const novaGrade = [];

  for (let linha = 0; linha < tamanhoGrade; linha++) {
    novaGrade[linha] = [];

    for (let coluna = 0; coluna < tamanhoGrade; coluna++) {
      novaGrade[linha][coluna] = "";
    }
  }

  return novaGrade;
}

function posicionarTodasPalavras() {
  palavras.forEach(palavra => {
    posicionarPalavra(palavra.texto);
  });
}

function posicionarPalavra(palavra) {
  let posicionada = false;
  let tentativas = 0;

  while (!posicionada && tentativas < 300) {
    tentativas++;

    const direcao = direcoes[Math.floor(Math.random() * direcoes.length)];
    const linhaInicial = Math.floor(Math.random() * tamanhoGrade);
    const colunaInicial = Math.floor(Math.random() * tamanhoGrade);

    if (podePosicionar(palavra, linhaInicial, colunaInicial, direcao)) {
      const posicoes = [];

      for (let i = 0; i < palavra.length; i++) {
        const linha = linhaInicial + direcao.linha * i;
        const coluna = colunaInicial + direcao.coluna * i;

        grade[linha][coluna] = palavra[i];
        posicoes.push({ linha, coluna });
      }

      palavrasPosicionadas.push({
        texto: palavra,
        posicoes
      });

      posicionada = true;
    }
  }
}

function podePosicionar(palavra, linhaInicial, colunaInicial, direcao) {
  for (let i = 0; i < palavra.length; i++) {
    const linha = linhaInicial + direcao.linha * i;
    const coluna = colunaInicial + direcao.coluna * i;

    if (
      linha < 0 ||
      linha >= tamanhoGrade ||
      coluna < 0 ||
      coluna >= tamanhoGrade
    ) {
      return false;
    }

    if (grade[linha][coluna] !== "" && grade[linha][coluna] !== palavra[i]) {
      return false;
    }
  }

  return true;
}

function preencherEspacosVazios() {
  for (let linha = 0; linha < tamanhoGrade; linha++) {
    for (let coluna = 0; coluna < tamanhoGrade; coluna++) {
      if (grade[linha][coluna] === "") {
        const indice = Math.floor(Math.random() * letrasAleatorias.length);
        grade[linha][coluna] = letrasAleatorias[indice];
      }
    }
  }
}

function montarGradeNaTela() {
  gradeElemento.innerHTML = "";

  for (let linha = 0; linha < tamanhoGrade; linha++) {
    for (let coluna = 0; coluna < tamanhoGrade; coluna++) {
      const celula = document.createElement("div");

      celula.classList.add("celula");
      celula.textContent = grade[linha][coluna];
      celula.dataset.linha = linha;
      celula.dataset.coluna = coluna;

      celula.addEventListener("click", selecionarCelula);

      gradeElemento.appendChild(celula);
    }
  }
}

function montarListaPalavras() {
  listaPalavras.innerHTML = "";

  palavras.forEach(palavra => {
    const item = document.createElement("li");

    item.textContent = `${palavra.dica}: ${palavra.texto}`;
    item.dataset.palavra = palavra.texto;

    listaPalavras.appendChild(item);
  });
}

function selecionarCelula() {
  if (!primeiraCelula) {
    primeiraCelula = this;
    this.classList.add("selecionada");
    mensagem.textContent = "Agora clique na última letra da palavra.";
    return;
  }

  if (this === primeiraCelula) {
    primeiraCelula.classList.remove("selecionada");
    primeiraCelula = null;
    mensagem.textContent = "Seleção cancelada. Clique na primeira letra da palavra.";
    return;
  }

  const segundaCelula = this;
  const caminho = obterCaminhoEntreCelulas(primeiraCelula, segundaCelula);

  if (!caminho) {
    mostrarErro([primeiraCelula, segundaCelula]);
    primeiraCelula.classList.remove("selecionada");
    primeiraCelula = null;
    mensagem.textContent = "A palavra precisa estar em linha reta.";
    return;
  }

  const palavraSelecionada = caminho.map(celula => celula.textContent).join("");
  const palavraInvertida = palavraSelecionada.split("").reverse().join("");

  const palavraEncontrada = palavrasPosicionadas.find(item => {
    return item.texto === palavraSelecionada || item.texto === palavraInvertida;
  });

  if (
    palavraEncontrada &&
    !palavrasEncontradas.includes(palavraEncontrada.texto)
  ) {
    marcarPalavraEncontrada(palavraEncontrada, caminho);
  } else {
    mostrarErro(caminho);
    mensagem.textContent = "Essa seleção não corresponde a uma palavra da lista.";
  }

  primeiraCelula.classList.remove("selecionada");
  primeiraCelula = null;
}

function obterCaminhoEntreCelulas(celulaInicial, celulaFinal) {
  const linhaInicial = Number(celulaInicial.dataset.linha);
  const colunaInicial = Number(celulaInicial.dataset.coluna);
  const linhaFinal = Number(celulaFinal.dataset.linha);
  const colunaFinal = Number(celulaFinal.dataset.coluna);

  const diferencaLinha = linhaFinal - linhaInicial;
  const diferencaColuna = colunaFinal - colunaInicial;

  const passoLinha = Math.sign(diferencaLinha);
  const passoColuna = Math.sign(diferencaColuna);

  const mesmaLinha = diferencaLinha === 0;
  const mesmaColuna = diferencaColuna === 0;
  const diagonal = Math.abs(diferencaLinha) === Math.abs(diferencaColuna);

  if (!mesmaLinha && !mesmaColuna && !diagonal) {
    return null;
  }

  const quantidadePassos = Math.max(
    Math.abs(diferencaLinha),
    Math.abs(diferencaColuna)
  );

  const caminho = [];

  for (let i = 0; i <= quantidadePassos; i++) {
    const linha = linhaInicial + passoLinha * i;
    const coluna = colunaInicial + passoColuna * i;

    const celula = document.querySelector(
      `.celula[data-linha="${linha}"][data-coluna="${coluna}"]`
    );

    caminho.push(celula);
  }

  return caminho;
}

function marcarPalavraEncontrada(palavraEncontrada, caminhoSelecionado) {
  caminhoSelecionado.forEach(celula => {
    celula.classList.add("encontrada");
  });

  palavrasEncontradas.push(palavraEncontrada.texto);

  const itemLista = document.querySelector(
    `li[data-palavra="${palavraEncontrada.texto}"]`
  );

  if (itemLista) {
    itemLista.classList.add("encontrada");
  }

  encontradasTexto.textContent = palavrasEncontradas.length;

  if (palavrasEncontradas.length === palavras.length) {
    mensagem.textContent = "Parabéns! Você encontrou todos os coletivos!";
  } else {
    mensagem.textContent = `Muito bem! Você encontrou: ${palavraEncontrada.texto}`;
  }
}

function mostrarErro(celulas) {
  celulas.forEach(celula => {
    celula.classList.add("erro");
  });

  setTimeout(() => {
    celulas.forEach(celula => {
      celula.classList.remove("erro");
    });
  }, 500);
}

botaoIniciar.addEventListener("click", mostrarTelaJogo);
botaoVoltar.addEventListener("click", mostrarTelaInicial);
botaoReiniciar.addEventListener("click", iniciarJogo);
