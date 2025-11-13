// ===================================================
// INÍCIO DO ARQUIVO portfolio.js (Versão Multilíngue)
// ===================================================

// --- FUNÇÕES GLOBAIS (Filtro, Modal, etc.) ---
// (Estas funções não precisam de tradução)

filterSelection("all") 
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("column");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

var btnContainer = document.getElementById("myBtnContainer");
if (btnContainer) {
    var btns = btnContainer.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function(){
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
    }
}

function openModal() {
  document.getElementById("myModal").style.display = "block";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  
  // Verifica se os elementos existem antes de usá-los
  if (slides.length === 0 || dots.length === 0 || !captionText) {
      return; 
  }

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}

// ===================================================
// INÍCIO DO SCRIPT DE TRADUÇÃO E CONTEÚDO DINÂMICO
// ===================================================

// 1. Detecta o idioma da tag <html lang="...">
//    Se não encontrar, assume 'pt' (Português) como padrão.
const lang = (document.documentElement.lang || 'pt').split('-')[0];

// 2. Define o "dicionário" de traduções
const textStrings = {
    // Português (pt)
    pt: {
        greeting: ["Bom dia!", "Boa tarde!", "Boa noite!"],
        dateLocale: 'pt-BR',
        queueError: "Erro de rede ao buscar a fila.",
        queueEmpty: "Nenhum pedido na fila!",
        queueColPos: "Posição",
        queueColName: "Nome (Requerente)",
        queueColDate: "Data do Pedido",
        queueLoadingError: "Erro ao carregar fila."
    },
    // Inglês (en)
    en: {
        greeting: ["Good morning!", "Good afternoon!", "Good evening!"],
        dateLocale: 'en-US',
        queueError: "Network error fetching queue.",
        queueEmpty: "No requests in the queue!",
        queueColPos: "Position",
        queueColName: "Name (Requester)",
        queueColDate: "Request Date",
        queueLoadingError: "Error loading queue."
    },
    // Espanhol (es)
    es: {
        greeting: ["¡Buenos días!", "¡Buenas tardes!", "¡Buenas noches!"],
        dateLocale: 'es-ES', // Espanhol da Espanha
        queueError: "Error de red al cargar la cola.",
        queueEmpty: "¡No hay solicitudes en la cola!",
        queueColPos: "Posición",
        queueColName: "Nombre (Solicitante)",
        queueColDate: "Fecha de Solicitud",
        queueLoadingError: "Error al cargar la cola."
    }
};

// 3. Pega o conjunto de textos do idioma correto
//    Se o 'lang' não for 'pt', 'en', ou 'es', ele usará 'pt'
const T = textStrings[lang] || textStrings['pt']; 

// ===================================================
// INÍCIO DO ÚNICO 'DOMContentLoaded'
// ===================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. SCRIPT DO HEADER (Tradução Aplicada) ---
    const greetingElement = document.getElementById("greeting");
    if (greetingElement) {
        const horaAtual = new Date().getHours();
        if (horaAtual >= 5 && horaAtual < 12) {
            greetingElement.textContent = T.greeting[0]; // "Bom dia!"
        } else if (horaAtual >= 12 && horaAtual < 18) {
            greetingElement.textContent = T.greeting[1]; // "Boa tarde!"
        } else {
            greetingElement.textContent = T.greeting[2]; // "Boa noite!"
        }
    }

    // --- 2. SCRIPT DA DATA (DO HEADER) (Tradução Aplicada) ---
    const dateElement = document.getElementById("date");
    if (dateElement) {
        const hoje = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        // Usa o 'dateLocale' (pt-BR, en-US, es-ES) do nosso dicionário
        let dataFormatada = hoje.toLocaleDateString(T.dateLocale, options);
        dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        dateElement.textContent = dataFormatada;
    }

    // ===================================================
    // --- 3. SCRIPT DO COPYRIGHT AUTOMÁTICO ---
    const copyrightElement = document.getElementById("copyright-year");
    if (copyrightElement) {
        const anoInicial = 2025; // O ano que o site começou
        const anoAtual = new Date().getFullYear(); // Pega o ano atual (ex: 2025)
        
        if (anoAtual > anoInicial) {
            // Se for 2026 ou mais, mostra o intervalo (ex: "2025–2026")
            copyrightElement.textContent = anoInicial + "–" + anoAtual;
        } else {
            // Se ainda for 2025, mostra só "2025"
            copyrightElement.textContent = anoInicial;
        }
    }
    // ===================================================

    // --- 4. SCRIPT DA FILA DE ESPERA (Tradução Aplicada) ---
    const containerElement = document.getElementById("fila-tabela-container");
    if (!containerElement) {
        // Se não achar o contêiner, para aqui
        return; 
    }

    // Função que busca os dados
    async function atualizarFila() {
        
        try {
            const url = "/.netlify/functions/get-fila";
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(T.queueError); // Usa texto traduzido
            }

            const listaDePedidos = await response.json();

            if (listaDePedidos.length === 0) {
                containerElement.innerHTML = 
                  `<p class="fila-tabela-mensagem">${T.queueEmpty}</p>`; // Usa texto traduzido
                return;
            }

            // Constrói a tabela (com cabeçalhos traduzidos)
            let tabelaHTML = `
                <table class="fila-tabela">
                    <thead>
                        <tr>
                            <th>${T.queueColPos}</th>
                            <th>${T.queueColName}</th>
                            <th class="col-data">${T.queueColDate}</th> 
                        </tr>
                    </thead>
                    <tbody>
            `;

            listaDePedidos.forEach(pedido => {
                tabelaHTML += `
                    <tr>
                        <td class="posicao">#${pedido.posicao}</td>
                        <td class="nome">${pedido.nome}</td>
                        <td class="data">${pedido.data}</td> 
                    </tr>
                `;
            });

            tabelaHTML += `
                    </tbody>
                </table>
            `;

            containerElement.innerHTML = tabelaHTML;

        } catch (error) {
            console.error("Erro ao atualizar a fila:", error);
            containerElement.innerHTML = 
              `<p class="fila-tabela-mensagem" style="color: #c0392b;">${T.queueLoadingError}</p>`; // Usa texto traduzido
        }
    }

    // --- Execução da Fila ---
    atualizarFila();
    setInterval(atualizarFila, 30000);

});

// ===================================================
// --- 5. SCRIPT DE PROJETOS COM FILTRO (Google Sheets) ---
// ===================================================

// Variável global para guardar os projetos na memória
let todosOsProjetosGlobal = [];

// Função chamada pelos botões do HTML
function filtrarProjetos(categoria, botaoClicado) {
    
    // 1. Atualiza o visual dos botões (muda a classe .active)
    if (botaoClicado) {
        const botoes = document.querySelectorAll('.btn-filtro');
        botoes.forEach(btn => btn.classList.remove('active'));
        botaoClicado.classList.add('active');
    }

    // 2. Filtra e desenha
    const container = document.getElementById("lista-projetos");
    if (!container) return;

    let htmlProjetos = "";
    let contador = 0;

    todosOsProjetosGlobal.forEach(proj => {
        // Ignora linhas vazias
        if(!proj.Nome) return;

        // Normaliza o status (ex: "Em Andamento" vira "em-andamento")
        // Remove acentos e espaços para comparação segura
        let statusLimpo = proj.Status ? proj.Status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') : '';
        
        // LÓGICA DO FILTRO:
        // Se a categoria for 'todos' OU se o status bater com a categoria...
        // (Ex: status 'em-andamento' bate com filtro 'em-andamento')
        if (categoria === 'todos' || statusLimpo.includes(categoria)) {
            
            contador++;
            
            // Define a cor do badge
            let badgeClass = statusLimpo; // 'em-andamento', 'concluido', etc.

            htmlProjetos += `
                <div class="projeto-card">
                    <div class="card-header">
                        <h4>${proj.Nome}</h4>
                        <span class="status-badge ${badgeClass}">${proj.Status}</span>
                    </div>
                    <div class="card-body">
                        <p class="data-inicio"><i class="fa fa-calendar"></i> Início: ${proj.Data}</p>
                        <p class="descricao">${proj.Descricao}</p>
                    </div>
                </div>
            `;
        }
    });

    // Se não houver projetos no filtro selecionado
    if (contador === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">Nenhum projeto encontrado nesta categoria.</p>';
    } else {
        container.innerHTML = htmlProjetos;
    }
}

// --- Inicialização (Carrega a planilha) ---
document.addEventListener("DOMContentLoaded", function() {
    const projetosContainer = document.getElementById("lista-projetos");
    
    if (projetosContainer) {
        // ⚠️ GARANTA QUE SEU LINK CSV ESTÁ AQUI:
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnBEn7fjEv0Ynev083IznzXWd5AJj3beiwgInI6MOYU_by8dT0B8DBomvdwmzL84GIBfLTEwyb6RZt/pub?gid=864836697&single=true&output=csv'; // <--- RECOLE SEU LINK AQUI

        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            complete: function(results) {
                // Salva os dados na variável global
                todosOsProjetosGlobal = results.data;
                
                // Desenha todos os projetos inicialmente
                filtrarProjetos('todos', null);
            },
            error: function(err) {
                console.error("Erro ao ler planilha:", err);
                projetosContainer.innerHTML = "<p>Erro ao carregar projetos.</p>";
            }
        });
    }
});

// ===================================================
// FIM DO ARQUIVO portfolio.js
// ===================================================
