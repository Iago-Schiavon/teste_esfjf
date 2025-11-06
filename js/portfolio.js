// ===================================================
// INÍCIO DO ARQUIVO portfolio.js (CORRIGIDO)
// ===================================================

filterSelection("all") // Execute the function and show all columns
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
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
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
// INÍCIO DO ÚNICO 'DOMContentLoaded'
// ===================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. SCRIPT DO HEADER ---
    const greetingElement = document.getElementById("greeting");
    if (greetingElement) {
        const horaAtual = new Date().getHours();
        if (horaAtual >= 5 && horaAtual < 12) {
            greetingElement.textContent = "Bom dia!";
        } else if (horaAtual >= 12 && horaAtual < 18) {
            greetingElement.textContent = "Boa tarde!";
        } else {
            greetingElement.textContent = "Boa noite!";
        }
    }

    // --- 2. SCRIPT DA DATA (DO HEADER) ---
    const dateElement = document.getElementById("date");
    if (dateElement) {
        const hoje = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        let dataFormatada = hoje.toLocaleDateString('pt-BR', options);
        dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        dateElement.textContent = dataFormatada;
    }

    // --- 3. SCRIPT DA FILA DE ESPERA ---
    
    // ==================================================
    // BUG CORRIGIDO AQUI:
    // O ID agora é "fila-tabela-container"
    const containerElement = document.getElementById("fila-tabela-container");
    // ==================================================

    // Se o elemento NÃO for encontrado, ele para o script da fila
    // (mas o script do Header acima ainda funciona)
    if (!containerElement) {
        console.error("Elemento #fila-tabela-container não foi encontrado!");
        return; 
    }

    // Esta é a função que busca os dados
    async function atualizarFila() {
        
        const containerElement = document.getElementById("fila-tabela-container");

        try {
            const url = "/.netlify/functions/get-fila";
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error("Erro de rede ao buscar a fila.");
            }

            // 1. Pega os dados (ex: [ {posicao: 1, nome: 'Iago', data: '06/11/2025'} ])
            const listaDePedidos = await response.json();

            if (listaDePedidos.length === 0) {
                containerElement.innerHTML = 
                  '<p class="fila-tabela-mensagem">Nenhum pedido na fila!</p>';
                return;
            }

            // 2. Constrói a tabela (CABEÇALHO ATUALIZADO)
            let tabelaHTML = `
                <table class="fila-tabela">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome (Requerente)</th>
                            <th class="col-data">Data do Pedido</th> 
                        </tr>
                    </thead>
                    <tbody>
            `;

            // 3. Adiciona uma linha (LINHA ATUALIZADA)
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

            // 4. Insere a tabela
            containerElement.innerHTML = tabelaHTML;

        } catch (error) {
            console.error("Erro ao atualizar a fila:", error);
            containerElement.innerHTML = 
              '<p class="fila-tabela-mensagem" style="color: #c0392b;">Erro ao carregar fila.</p>';
        }
    }

    // --- Execução da Fila ---
    atualizarFila();
    setInterval(atualizarFila, 30000); // Atualiza a cada 30 segundos

});
// ===================================================
// FIM DO ÚNICO 'DOMContentLoaded'
// ===================================================