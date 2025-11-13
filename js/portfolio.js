// ===================================================
// ARQUIVO JS LIMPO - VERSÃO GOOGLE SHEETS
// ===================================================

// --- FUNÇÕES GLOBAIS DE UI (Filtros da Galeria, Modal, etc.) ---

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

// --- MODAL / LIGHTBOX ---
function openModal() { document.getElementById("myModal").style.display = "block"; }
function closeModal() { document.getElementById("myModal").style.display = "none"; }

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) { showSlides(slideIndex += n); }
function currentSlide(n) { showSlides(slideIndex = n); }

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  
  if (slides.length === 0 || dots.length === 0 || !captionText) return;

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
  for (i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}

// ===================================================
// LÓGICA DO GOOGLE SHEETS (PROJETOS E FILA)
// ===================================================

// Variável global para guardar os dados
let todosOsProjetosGlobal = [];

// Função de Filtro (Chamada pelos botões do HTML)
function filtrarProjetos(categoria, botaoClicado) {
    
    // Atualiza visual dos botões
    if (botaoClicado) {
        const botoes = document.querySelectorAll('.btn-filtro');
        botoes.forEach(btn => btn.classList.remove('active'));
        botaoClicado.classList.add('active');
    }

    const container = document.getElementById("lista-projetos");
    if (!container) return;

    let htmlProjetos = "";
    let contador = 0;

    todosOsProjetosGlobal.forEach(proj => {
        if(!proj.Nome) return;

        // Normaliza o status (Ex: "Na Fila" -> "na-fila")
        let statusLimpo = proj.Status ? proj.Status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') : '';
        
        // Lógica de Exibição
        if (categoria === 'todos' || statusLimpo.includes(categoria)) {
            contador++;
            let badgeClass = statusLimpo;

            htmlProjetos += `
                <div class="projeto-card">
                    <div class="card-header">
                        <h4>${proj.Nome}</h4>
                        <span class="status-badge ${badgeClass}">${proj.Status}</span>
                    </div>
                    <div class="card-body">
                        <p class="data-inicio"><i class="fa fa-calendar"></i> Data: ${proj.Data}</p>
                        <p class="descricao">${proj.Descricao}</p>
                    </div>
                </div>
            `;
        }
    });

    if (contador === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">Nenhum item encontrado nesta categoria.</p>';
    } else {
        container.innerHTML = htmlProjetos;
    }
}

// ===================================================
// INICIALIZAÇÃO (DOMContentLoaded)
// ===================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Header e Saudação (Mantido)
    const greetingElement = document.getElementById("greeting");
    if (greetingElement) {
        const horaAtual = new Date().getHours();
        // Lógica simples de saudação (pode expandir para tradução depois se quiser)
        if (horaAtual >= 5 && horaAtual < 12) greetingElement.textContent = "Bom dia!";
        else if (horaAtual >= 12 && horaAtual < 18) greetingElement.textContent = "Boa tarde!";
        else greetingElement.textContent = "Boa noite!";
    }

    const dateElement = document.getElementById("date");
    if (dateElement) {
        const hoje = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let dataFormatada = hoje.toLocaleDateString('pt-BR', options);
        dateElement.textContent = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    }

    // 2. Copyright Automático
    const copyrightElement = document.getElementById("copyright-year");
    if (copyrightElement) {
        const anoInicial = 2025;
        const anoAtual = new Date().getFullYear();
        copyrightElement.textContent = (anoAtual > anoInicial) ? `${anoInicial}–${anoAtual}` : anoInicial;
    }

    // 3. CARREGAR DADOS DO GOOGLE SHEETS
    const projetosContainer = document.getElementById("lista-projetos");
    if (projetosContainer) {
        // LINK DA SUA PLANILHA
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnBEn7fjEv0Ynev083IznzXWd5AJj3beiwgInI6MOYU_by8dT0B8DBomvdwmzL84GIBfLTEwyb6RZt/pub?gid=864836697&single=true&output=csv';

        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            complete: function(results) {
                todosOsProjetosGlobal = results.data;
                // Inicia mostrando todos
                filtrarProjetos('todos', null);
            },
            error: function(err) {
                console.error("Erro ao ler planilha:", err);
                projetosContainer.innerHTML = "<p>Erro ao carregar dados.</p>";
            }
        });
    }
});