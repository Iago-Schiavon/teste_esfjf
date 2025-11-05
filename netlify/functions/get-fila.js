/*
 * Arquivo: netlify/functions/get-fila.js
 * (Versão de TESTE para verificar as Variáveis de Ambiente)
 */

exports.handler = async (event, context) => {
  
  // Vamos tentar ler as variáveis do "cofre"
  const FORM_ID_TEST = process.env.FORM_ID;
  const API_TOKEN_TEST = process.env.NETLIFY_API_TOKEN;

  // Vamos verificar se elas vieram nulas/vazias ou se
  // elas foram encontradas.
  // O '!!' transforma o valor em 'true' (se existir) 
  // ou 'false' (se for nulo/vazio).
  const formIdEncontrado = !!FORM_ID_TEST;
  const tokenIdEncontrado = !!API_TOKEN_TEST;

  // Em vez de chamar a API, vamos apenas retornar 
  // um relatório de sucesso
  return {
    statusCode: 200, // Retorna SUCESSO
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // O 'body' é o nosso relatório de diagnóstico
    body: JSON.stringify({
      message: "Esta é uma resposta de teste.",
      formIdFoiEncontrado: formIdEncontrado,
      tokenFoiEncontrado: tokenIdEncontrado
    }),
  };
};
