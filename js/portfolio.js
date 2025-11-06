// ===================================================
// INÍCIO DO ARQUIVO portfolio.js
// ===================================================

filterSelection("all") // Execute the function and show all columns
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("column");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// Show filtered elements
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

// Hide elements that are not selected
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

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// Open the Modal
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
// Adiciona um "ouvinte" que espera a página carregar
// para então executar TODO o código abaixo.
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. SCRIPT DO HEADER ---
    const greetingElement = document.getElementById("greeting");
    
    // Verifica se o elemento <p id="greeting"> existe
    if (greetingElement) {
        const horaAtual = new Date().getHours(); // Pega a hora (0-23)
        
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
    
    // Verifica se o elemento <h4 id="date"> existe
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
    const displayElement = document.getElementById("fila-display");

    // Se o elemento não existir na página, não faz nada.
    if (!displayElement) {
        return;
    }

    // Esta é a função que busca os dados
    async function atualizarFila() {
        
        // Encontra o NOVO contêiner da tabela
        const containerElement = document.getElementById("fila-tabela-container");

        try {
            const url = "/.netlify/functions/get-fila";
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error("Erro de rede ao buscar a fila.");
            }

            // 1. Pega os dados (que agora são uma LISTA, ex: [ {posicao: 1, nome: 'Iago'} ])
            const listaDePedidos = await response.json();

            // 2. Se a lista estiver vazia
            if (listaDePedidos.length === 0) {
                containerElement.innerHTML = 
                  '<p class="fila-tabela-mensagem">Nenhum pedido na fila!</p>';
                return; // Para a execução
            }

            // 3. Se a lista NÃO estiver vazia, vamos construir a tabela
            
            // Cabeçalho da Tabela
            let tabelaHTML = `
                <table class="fila-tabela">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome (Requerente)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // 4. Adiciona uma linha (<tr>) para cada pedido
            listaDePedidos.forEach(pedido => {
                tabelaHTML += `
                    <tr>
                        <td class="posicao">#${pedido.posicao}</td>
                        <td class="nome">${pedido.nome}</td>
                    </tr>
                `;
            });

            // 5. Fecha a tabela
            tabelaHTML += `
                    </tbody>
                </table>
            `;

            // 6. Insere a tabela pronta no HTML
            containerElement.innerHTML = tabelaHTML;

        } catch (error) {
            // Se algo der errado
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