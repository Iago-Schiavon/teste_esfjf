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

/* ===================================================
   SCRIPT DO HEADER (Saudação e Data Dinâmica)
   =================================================== */

// Adiciona um "ouvinte" que espera a página carregar
// para então executar o código.
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Atualizar a Saudação (Bom dia, Boa tarde, Boa noite) ---
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

    // --- 2. Atualizar a Data (Formato mais completo) ---
    const dateElement = document.getElementById("date");
    
    // Verifica se o elemento <h4 id="date"> existe
    if (dateElement) {
        const hoje = new Date();
        
        // Opções para formatar a data em português
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        // 'pt-BR' para português do Brasil
        let dataFormatada = hoje.toLocaleDateString('pt-BR', options);
        
        // Deixa a primeira letra maiúscula (ex: "quarta-feira" -> "Quarta-feira")
        dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        
        // Insere a data formatada no HTML
        dateElement.textContent = dataFormatada;
    }

});

/* ===================================================
   SCRIPT DA FILA DE ESPERA (Polling)
   =================================================== */

// Espera o documento carregar
document.addEventListener("DOMContentLoaded", function() {
    
    // Encontra o local no HTML onde vamos exibir a contagem
    const displayElement = document.getElementById("fila-display");

    // Se o elemento não existir na página, não faz nada.
    if (!displayElement) {
        return;
    }


async function atualizarFila() {
        
        try {
            const url = "/.netlify/functions/get-fila";
            const response = await fetch(url);
            
            if (!response.ok) {
                // Esta é a linha que estava dando o erro antes
                throw new Error("Erro de rede ao buscar a fila."); 
            }

            // Pega a resposta (que agora será { "total": X })
            const data = await response.json();
            const total = data.total;

            // ATUALIZA O HTML (o código original)
            if (total == 0) {
                 displayElement.textContent = "Nenhum pedido na fila!";
            } else if (total == 1) {
                 displayElement.textContent = "1 pedido na fila";
            } else {
                 displayElement.textContent = `${total} pedidos na fila`;
            }
            
            // Opcional: muda a cor de volta (se você deixou amarelo)
            displayElement.style.backgroundColor = "rgb(49, 175, 60)"; 
            displayElement.style.animation = 'none';

        } catch (error) {
            console.error("Erro ao atualizar a fila:", error);
            displayElement.textContent = "Erro ao carregar fila";
            displayElement.style.backgroundColor = "#c0392b"; 
        }
    }

    // --- Execução ---

    // 1. Chama a função IMEDIATAMENTE ao carregar a página
    atualizarFila();

    // 2. E então, define um "timer" (Polling) para chamar
    //    a função novamente a cada 30 segundos (30000 ms)
    setInterval(atualizarFila, 30000);

});