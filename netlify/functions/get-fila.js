/*
 * Arquivo: netlify/functions/get-fila.js
 * (Versão 2 - com log de erro)
 */

exports.handler = async (event, context) => {
  
  const FORM_ID = process.env.FORM_ID;
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const url = `https://api.netlify.com/api/v1/forms/${FORM_ID}`;

  try {
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      // Se a resposta da API não for 'OK', nós criamos um erro
      throw new Error(`Erro da API do Netlify: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const totalPedidos = data.submission_count;

    // SUCESSO
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
    
    // ===================================================
    // A MUDANÇA IMPORTANTE ESTÁ AQUI
    // Esta linha irá imprimir o erro real no log
    console.error("ERRO INTERNO DA FUNÇÃO:", error.message);
    // ===================================================

    // ERRO
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Erro interno do servidor: ${error.message}`
      }),
    };
  }
};