/*
 * Arquivo: netlify/functions/get-fila.js
 * (Versão "À Prova de Falhas" - v4)
 *
 * Este código ignora o FORM_ID. Ele busca TODOS os formulários
 * do site e encontra o formulário correto pelo NOME.
 */

exports.handler = async (event, context) => {
  
  // 1. Lê as chaves que precisamos.
  // Note que agora usamos process.env.SITE_ID,
  // que o Netlify nos dá automaticamente!
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const SITE_ID = process.env.SITE_ID; // <--- A MUDANÇA!
  
  // 2. O nome do formulário que queremos encontrar
  const FORM_NAME = "pedidos-esf";

  // 3. Monta a NOVA URL da API
  //    (Esta URL pede TODOS os formulários do site)
  const url = `https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`;

  try {
    
    // 4. Tenta chamar a API do Netlify
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erro da API do Netlify (Buscando todos os forms): ${response.status} - ${response.statusText}`);
    }

    // 5. Se deu certo, pega a LISTA de todos os formulários
    const allForms = await response.json();

    // 6. Encontra o nosso formulário específico no meio da lista
    const nossoForm = allForms.find(form => form.name === FORM_NAME);

    // 7. Se não encontrar o formulário pelo NOME
    if (!nossoForm) {
      throw new Error(`Formulário com o nome "${FORM_NAME}" não foi encontrado na lista de formulários.`);
    }

    // 8. SUCESSO! Pegamos a contagem do formulário que encontramos
    const totalPedidos = nossoForm.submission_count;

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
    
    // 9. Imprime o erro real no log
    console.error("ERRO INTERNO DA FUNÇÃO (v4):", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Erro interno do servidor: ${error.message}`
      }),
    };
  }
};
