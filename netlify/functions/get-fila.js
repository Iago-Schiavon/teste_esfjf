/*
 * Arquivo: netlify/functions/get-fila.js
 * (Versão REAL / v2 - com log de erro)
 */

exports.handler = async (event, context) => {
  
  // Lê as chaves (agora sabemos que isso funciona!)
  const FORM_ID = process.env.FORM_ID;
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const url = `https://api.netlify.com/api/v1/forms/${FORM_ID}`;

  try {
    
    // Tenta chamar a API do Netlify
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    // Se a API não retornar "OK" (ex: 401, 404)
    if (!response.ok) {
      throw new Error(`Erro da API do Netlify: ${response.status} - ${response.statusText}`);
    }

    // Pega os dados
    const data = await response.json();
    const totalPedidos = data.submission_count;

    // SUCESSO! Retorna o total
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
    
    // Imprime o erro real no log do Netlify
    console.error("ERRO INTERNO DA FUNÇÃO:", error.message);

    // Retorna um erro para o frontend
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Erro interno do servidor: ${error.message}`
      }),
    };
  }
};