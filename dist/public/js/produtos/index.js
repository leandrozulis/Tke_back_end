let buscaTimer;

document.addEventListener("DOMContentLoaded", () => {
  verificarPermissoes();
});

let ROLE = null;

function verificarAutenticacao() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("index.html");
  }
}

verificarAutenticacao();

// Executa quando voltar pelo botão do navegador
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    verificarAutenticacao();
  }
});

// Permissões
async function verificarPermissoes() {

  const token = localStorage.getItem("token");

  if (!token) return;

  const res = await fetch(BASE_URL + "/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = await res.json();
  ROLE = user.role;
  
  const btnCadastrar = document.querySelector("#btnCadastrar");
  const colunaAcoes = document.querySelector("#col-acoes");
  const sideMenu = document.getElementById("sideMenu");
  const menuIcon = document.querySelector(".menu-icon");

  if (ROLE === "USER") {
    menuIcon.style.display = "none";
    sideMenu.style.display = "none";
    btnCadastrar.style.display = "none";
    colunaAcoes.style.display = "none";
  }
}

function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

// Cadastro
function abrirCadastro() {
  window.location.href = "cadastro.html";
}

function fecharCadastro() {
  window.location.href = "../../../home.html";
}

async function cadastrar() {

  try {
    const token = localStorage.getItem("token");
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const filial = document.getElementById("filialCadastro").value;

    let filialValue = regexEscape(filial);
  
    const raw = JSON.stringify({
      "filial": filialValue,
      "codigoGis": document.getElementById("gisCadastro").value,
      "numeroMaterial": document.getElementById("matCadastro").value,
      "descricao": document.getElementById("descCadastro").value,
      "deposito": document.getElementById("depCadastro").value,
      "posicaoDeposito": document.getElementById("posCadastro").value,
      "hierarquiaProduto": document.getElementById("hierCadastro").value
    });
  
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: raw
    };
  
    let result = await fetch(BASE_URL + "/product/create", requestOptions)
  
    const parsedResult = await result.json();

    if (parsedResult.message === 'Produto já cadastrado para essa filial') {
      exibeError(parsedResult.message)
      return;
    }

    if (parsedResult.error === 'Campos obrigatórios não informados.') {
      exibeError(parsedResult.error)
      return;
    }
  
    const file = document.getElementById("imgCadastro").files[0];
  
    if (file) {
      const formImg = new FormData();
      formImg.append("buffer", file);
  
      const requestImgOption = {
        method: "POST",
        body: formImg,
        headers: { "Authorization": `Bearer ${token}` }
      }
  
      const idProduto = parsedResult.product.id;
  
      await fetch(BASE_URL + `/create/image/${idProduto}`, requestImgOption);
    }
  
    await exibeSucesso(parsedResult.message);
    fecharCadastro();

  } catch (error) {
    exibeError('Erro ao Cadastrar!')
    fecharCadastro();
  }

}

// Editar
async function abrirEditar(id) {
  localStorage.setItem("produtoEditarId", id);

  window.location.href = "editar.html";
}

function fecharEditar() {
  localStorage.removeItem("produtoEditarId");
  window.location.href = "../../../home.html";
}

async function salvarEdicao() {
  try {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("produtoEditarId");

    const filial = document.getElementById("filialEditar").value;
    const filialValue = regexEscape(filial)
  
    const raw = JSON.stringify({
      "filial": filialValue,
      "codigoGis": document.getElementById("gisEditar").value,
      "numeroMaterial": document.getElementById("matEditar").value,
      "descricao": document.getElementById("descEditar").value,
      "deposito": document.getElementById("depEditar").value,
      "posicaoDeposito": document.getElementById("posEditar").value,
      "hierarquiaProduto": document.getElementById("hierEditar").value
    });
  
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: raw
    };
  
    await fetch(BASE_URL + `/product/update/${id}`, requestOptions)
  
    const file = document.getElementById("imgEditar").files[0];
  
    if (file) {
      const formImg = new FormData();
      formImg.append("buffer", file);
  
      await fetch(BASE_URL + `/update/image/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formImg
      });
    }
    exibeSucesso(`Atualização realizada com sucesso!`);
    fecharEditar();
  } catch (error) {
    exibeError("Erro ao alterar dados.")
  }
}

// Excluir
async function abrirExcluir(id, idImg) {
  localStorage.setItem("excluirProdutoId", id);
  localStorage.setItem("excluirImagemId", idImg);
  document.getElementById("modalExcluir").style.display = "block";
}

function fecharModalExcluir() {
  localStorage.removeItem("excluirProdutoId")
  localStorage.removeItem("excluirImagemId")
  document.getElementById("modalExcluir").style.display = "none";
  produtoIdParaExcluir = null;
  imagemParaExcluir = null;
}

async function excluir() {

  const token = localStorage.getItem("token");
  let idProd = localStorage.getItem("excluirProdutoId")
  let idImgProd = localStorage.getItem("excluirImagemId")

  try {

    let res = await fetch(BASE_URL + `/product/remove/${idProd}`, {
      method: "DELETE",
      body: JSON.stringify({ idImg: idImgProd }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  
    exibeSucesso(res.message);
    fecharModalExcluir();
    limparDados();

    localStorage.removeItem("excluirProdutoId")
    localStorage.removeItem("excluirImagemId")
  } catch (error) {
    exibeError("Erro ao excluir produto.");
  }
}

// Buscar Item
async function buscar() {

  const token = localStorage.getItem("token");

  const filial = document.getElementById("filialBusca").value;
  const referencia = document.getElementById("referenciaBusca").value;

  if (!filial || !referencia) return;

  let filialValue = regexEscape(filial);

  const url = BASE_URL + `/product/find?filial=${filialValue}&referencia=${referencia}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();
  
  if (data.erro) {
    exibeError(data.erro);
    limparDados();
    return;
  }
  
  const cardContainer = document.getElementById("cardProdutos");
  
  cardContainer.innerHTML = "";

  const produto = Array.isArray(data) ? data[0] : data; 

  if (!produto || Object.keys(produto).length === 0) {
    cardContainer.style.display = "none";
    return; 
  }

  const img = produto.ProductImage?.[0]?.id;

  const card = document.createElement("div");
  card.classList.add("card");
  
  const createCardItem = (label, value) => {
    return `
      <div class="card-item">
        <span class="card-label">${label}:</span>
        <span class="card-value">${value}</span>
      </div><hr />
    `;
  };

  const createCardImageButton = (imgId) => {

    if (imgId) {
      return `
        <div class="card-actions-img">
          <button onclick="carregarImagem('${imgId || ''}');">Abrir Imagem</button>
        </div>
      `;
    }

    return "";
  }

  card.innerHTML = `
    ${createCardItem("Filial", produto.filial)}
    ${createCardItem("Cód. GIS", produto.codigoGis)}
    ${createCardItem("Nº Material", produto.numeroMaterial)}
    ${createCardItem("Descrição", produto.descricao)}
    ${createCardItem("Depósito", produto.deposito)}
    ${createCardItem("Posição", produto.posicaoDeposito)}
    ${createCardItem("Hierarquia", produto.hierarquiaProduto)}
    
    ${
      ROLE === "ADMIN"
      ? `
        <div class="card-actions">
          <button onclick="abrirEditar('${produto.id}')">Editar</button>
          <button onclick="abrirExcluir('${produto.id}','${img || ''}')">Excluir</button>          
        </div>
        <div class="card-actions">
          <button onClick="limparDados()">Limpar</button>
        </div>
      `
      : `
        <div class="card-actions">
          <button onClick="limparDados()">Limpar</button>
        </div>
      `
    }
    ${
      createCardImageButton(img)
    }
  `;
  
  cardContainer.appendChild(card);
  cardContainer.style.display = "block";

}

// Sugestões
function buscarSugestoes() {
  clearTimeout(buscaTimer);
  buscaTimer = setTimeout(executarSugestoes, 250);
}

async function executarSugestoes() {
  const token = localStorage.getItem("token");
  const filial = document.getElementById("filialBusca").value;
  const referencia = document.getElementById("referenciaBusca").value;
  const div = document.getElementById("sugestoes");

  if (!referencia || referencia.trim().length < 1) {
    div.innerHTML = "";
    return;
  }

  let filialValue = regexEscape(filial);

  const url = BASE_URL + `/product/autocomplete?filial=${filialValue}&referencia=${referencia}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  div.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) return;

  data.forEach(produto => {
    const item = document.createElement("div");
    item.classList.add("sugestao-item");

    item.innerHTML = `
      <img class="sugestao-icone" 
        src="data:image/svg+xml;utf8,
        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='white'>
          <path d='M11 2a9 9 0 105.641 16.01.966.966 0 00.152.197l3.5 3.5a1 1 0 101.414-1.414l-3.5-3.5a1 1 0 00-.197-.153A8.96 8.96 0 0020 11a9 9 0 00-9-9Zm0 2a7 7 0 110 14 7 7 0 010-14Z'/>
        </svg>"
      />
      <div class="sugestao-texto">
        <span class="sugestao-principal">Código Gis: ${produto.codigoGis || produto.numeroMaterial}</span>
        <span class="sugestao-secundaria">Descrição: ${produto.descricao}</span>
      </div>
    `;

    item.onclick = () => {
      document.getElementById("referenciaBusca").value =
        produto.codigoGis || produto.numeroMaterial;

      div.innerHTML = "";
    };

    div.appendChild(item);
  });
}

function executarSugestoesFilial() {
  const div = document.getElementById("sugestoesFilial");
  const valor = document.getElementById("filialBusca").value;

  const filiais = [
    { codigo: "5005", cidade: "Curitiba" },
    { codigo: "5025", cidade: "Londrina" },
    { codigo: "5026", cidade: "Foz do Iguaçu" },
    { codigo: "5027", cidade: "Maringá" },
    { codigo: "5033", cidade: "Cascavel" },
    { codigo: "5058", cidade: "Pato Branco" }
  ];

  div.innerHTML = "";
  div.classList.remove("ativo"); // Esconde inicialmente

  let resultados = [];

  // LÓGICA ALTERADA:
  // Se estiver vazio, mostramos TODAS as filiais.
  if (!valor || valor.trim().length === 0) {
    resultados = filiais; 
  } else {
    // Se tiver texto, fazemos o filtro normal
    resultados = filiais.filter(f =>
      f.codigo.startsWith(valor) || f.cidade.toLowerCase().startsWith(valor.toLowerCase())
    );
  }

  // Se não houver resultados (ex: digitou algo que não existe), sai da função
  if (resultados.length === 0) return;

  // Renderiza a lista
  resultados.forEach(filial => {
    const item = document.createElement("div");
    item.classList.add("sugestao-item");

    item.innerHTML = `
      <div class="sugestao-texto">
        <span class="sugestao-principal">${filial.codigo} - ${filial.cidade}</span>
      </div>
    `;

    item.onclick = () => {
      document.getElementById("filialBusca").value = `${filial.codigo} - ${filial.cidade}`;
      div.innerHTML = "";
      div.classList.remove("ativo"); // Esconde ao clicar
    };

    div.appendChild(item);
  });

  // Mostra a div pois temos conteúdo
  div.classList.add("ativo");
}

function executarSugestoesFilialCadastro() {
  const div = document.getElementById("sugestoesFilial");
  const cadastro = document.getElementById("filialCadastro").value;

  const filiais = [
    { codigo: "5005", cidade: "Curitiba" },
    { codigo: "5025", cidade: "Londrina" },
    { codigo: "5026", cidade: "Foz do Iguaçu" },
    { codigo: "5027", cidade: "Maringá" },
    { codigo: "5033", cidade: "Cascavel" },
    { codigo: "5058", cidade: "Pato Branco" }
  ];

  div.innerHTML = "";
  div.classList.remove("ativo"); // Esconde inicialmente

  let resultados = [];

  // LÓGICA ALTERADA:
  // Se estiver vazio, mostramos TODAS as filiais.
  if (!cadastro || cadastro.trim().length === 0) {
    resultados = filiais; 
  } else {
    resultados = filiais.filter(f =>
      f.codigo.startsWith(cadastro) || f.cidade.toLowerCase().startsWith(cadastro.toLowerCase())
    );
  }

  // Se não houver resultados (ex: digitou algo que não existe), sai da função
  if (resultados.length === 0) return;

  // Renderiza a lista
  resultados.forEach(filial => {
    const item = document.createElement("div");
    item.classList.add("sugestao-item");

    item.innerHTML = `
      <div class="sugestao-texto">
        <span class="sugestao-principal">${filial.codigo} - ${filial.cidade}</span>
      </div>
    `;

    item.onclick = () => {
      document.getElementById("filialCadastro").value = `${filial.codigo} - ${filial.cidade}`;
      div.innerHTML = "";
      div.classList.remove("ativo"); // Esconde ao clicar
    };

    div.appendChild(item);
  });

  // Mostra a div pois temos conteúdo
  div.classList.add("ativo");
}

function executarSugestoesFilialEdicao() {
  const div = document.getElementById("sugestoesFilial");
  const editar = document.getElementById("filialEditar").value;

  const filiais = [
    { codigo: "5005", cidade: "Curitiba" },
    { codigo: "5025", cidade: "Londrina" },
    { codigo: "5026", cidade: "Foz do Iguaçu" },
    { codigo: "5027", cidade: "Maringá" },
    { codigo: "5033", cidade: "Cascavel" },
    { codigo: "5058", cidade: "Pato Branco" }
  ];

  div.innerHTML = "";
  div.classList.remove("ativo"); // Esconde inicialmente

  let resultados = [];

  // LÓGICA ALTERADA:
  // Se estiver vazio, mostramos TODAS as filiais.
  if (!editar || editar.trim().length === 0) {
    resultados = filiais; 
  } else {
    resultados = filiais.filter(f =>
      f.codigo.startsWith(editar) || f.cidade.toLowerCase().startsWith(editar.toLowerCase())
    );
  }

  // Se não houver resultados (ex: digitou algo que não existe), sai da função
  if (resultados.length === 0) return;

  // Renderiza a lista
  resultados.forEach(filial => {
    const item = document.createElement("div");
    item.classList.add("sugestao-item");

    item.innerHTML = `
      <div class="sugestao-texto">
        <span class="sugestao-principal">${filial.codigo} - ${filial.cidade}</span>
      </div>
    `;

    item.onclick = () => {
      document.getElementById("filialEditar").value = `${filial.codigo} - ${filial.cidade}`;
      div.innerHTML = "";
      div.classList.remove("ativo"); // Esconde ao clicar
    };

    div.appendChild(item);
  });

  // Mostra a div pois temos conteúdo
  div.classList.add("ativo");
}

// Imagens
async function carregarImagem(imgId) {
    const token = localStorage.getItem("token");
    
    const modalContent = document.getElementById("modalImageContent");

    if (!imgId) {
      modalContent.innerHTML = "Nenhuma imagem cadastrada";
      return;
    }
    
    modalContent.innerHTML = "Carregando imagem...";

    const res = await fetch(BASE_URL + `/find/image/${imgId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorMsg = "Erro ao carregar imagem";
      exibeError(errorMsg)
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    
    modalContent.innerHTML = `<img src="${url}" alt="Imagem do Produto Expandida" />`;
    abrirModalImagem();
}

function abrirModalImagem() {
    document.getElementById("imageModalBg").style.display = "flex";
}

function fecharModalImagem() {
    document.getElementById("imageModalBg").style.display = "none";
    // Opcional: Limpar o conteúdo do modal ao fechar
    document.getElementById("modalImageContent").innerHTML = "";
}

// Limpar interface
function limparDados() {
  document.getElementById("filialBusca").value = "";
  document.getElementById("referenciaBusca").value = "";

  const tbody = document.querySelector("#tabelaProdutos tbody");
  const cardContainer = document.getElementById("cardProdutos");
  const tabelaProdutos = document.getElementById("tabelaProdutos");
  
  if (tbody) tbody.innerHTML = "";
  if (cardContainer) cardContainer.innerHTML = "";
  
  if (tabelaProdutos) tabelaProdutos.style.display = "none";
  if (cardContainer) cardContainer.style.display = "none";

  const imagemProduto = document.querySelector("#imagemProduto");
  if (imagemProduto) {
    imagemProduto.innerHTML = "Nenhuma imagem cadastrada"; 
  }

  if (typeof fecharModalImagem === 'function') {
    fecharModalImagem();
  }
}

// Utils
function regexEscape(text) {
  let regex = /^\d+/;
  let filialPart = text.match(regex)
  return filialPart ? filialPart[0] : "";
}

// Importar
function menuImportar() {
  document.getElementById("modalImportar").style.display = "block";
}

function fecharModalImportar() {
  document.getElementById("modalImportar").style.display = "none";
}

function mostrarArquivoSelecionado() {
  const input = document.getElementById("arquivoImportar");
  const area = document.getElementById("uploadArea");
  const texto = document.getElementById("uploadTexto");

  if (input.files.length > 0) {
    texto.innerText = "Arquivo selecionado:\n" + input.files[0].name;
    area.classList.add("selecionado");
    area.innerHTML = "✅<br><strong>" + input.files[0].name + "</strong>";
  }
}

// Exportar
function menuExportar() {
  document.getElementById("modalExportar").style.display = "block";
}

function fecharModalExportar() {
  document.getElementById("modalExportar").style.display = "none";
}

// Menu
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
}


// logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("ROLE");
  window.location.href = "index.html";
}

// Opcional: Fechar a lista se clicar fora
document.addEventListener('click', function(e) {
  const container = document.querySelector('.input-wrapper');
  const div = document.getElementById("sugestoesFilial");
  if (!container.contains(e.target)) {
    div.classList.remove("ativo");
  }
});