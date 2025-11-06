/*
 * Arquivo: netlify/functions/get-fila.js
 * (Versão 5 - Busca e Filtra Nomes)
 *
 * Busca todas as submissões do site, filtra pelo nome do formulário,
 * inverte a ordem (para a fila) e retorna uma lista segura.
 */

exports.handler = async (event, context) => {
  
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const SITE_ID = process.env.SITE_ID; // ID automático do site
  const FORM_NAME = "pedidos-esf-v2"; // O nome do formulário
  
  // URL da API que busca TODAS as submissões do site
  const url = `https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions`;

  try {
    
    // 1. Chama a API
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });

    if (!response.ok) {
      throw new Error(`Erro da API do Netlify: ${response.status} - ${response.statusText}`);
    }

    // 2. Pega a lista de TODAS as submissões
    const allSubmissions = await response.json();

    // 3. Filtra a lista para pegar apenas as do formulário "pedidos-esf-v2"
    const nossosPedidos = allSubmissions.filter(s => s.form_name === FORM_NAME);

    // 4. Inverte a ordem (API envia mais novo -> mais antigo)
    //    Queremos a fila (mais antigo -> mais novo)
    const pedidosEmOrdem = nossosPedidos.reverse();

    // 5. O FILTRO DE SEGURANÇA:
    //    Cria uma nova lista "limpa" SÓ com o nome e a posição.
    const listaSegura = pedidosEmOrdem.map((item, index) => {
      return {
        posicao: index + 1,        // Posição na fila (1, 2, 3...)
        nome: item.data.nome     // Pega SÓ o campo "nome"
      };
    });

    // 6. SUCESSO! Retorna a lista segura
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      // O 'body' agora é a nossa lista de nomes
      body: JSON.stringify(listaSegura), 
    };

  } catch (error) {
    console.error("ERRO INTERNO DA FUNÇÃO (v5):", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Erro: ${error.message}` }),
    };
  }
};