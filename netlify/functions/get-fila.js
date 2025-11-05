/*
 * Arquivo: netlify/functions/get-fila.js
 * (Versão Final de Produção - v2)
 *
 * Este código lê o FORM_ID e o API_TOKEN do "cofre" (Variáveis de Ambiente)
 * e busca a contagem total de envios (submission_count) na API do Netlify.
 */

exports.handler = async (event, context) => {
  
  // 1. Lê as chaves (que agora devem estar corretas)
  const FORM_ID = process.env.FORM_ID;
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;
  
  // 2. Monta a URL da API
  const url = `https://api.netlify.com/api/v1/forms/${FORM_ID}`;

  try {
    
    // 3. Tenta chamar a API do Netlify
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    // 4. Se a API não retornar "OK" (ex: 401, 404)
    if (!response.ok) {
      // Cria um erro que será capturado pelo 'catch'
      throw new Error(`Erro da API do Netlify: ${response.status} - ${response.statusText}`);
    }

    // 5. Se deu certo, pega os dados
    const data = await response.json();
    const totalPedidos = data.submission_count;

    // 6. SUCESSO! Retorna o total para o frontend
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        total: totalPedidos 
      }),
    };

  } catch (error) {
    
    // 7. FALHA! Imprime o erro real no log do Netlify
    console.error("ERRO INTERNO DA FUNÇÃO:", error.message);

    // 8. Retorna um erro para o frontend
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Erro interno do servidor: ${error.message}`
      }),
    };
  }
};