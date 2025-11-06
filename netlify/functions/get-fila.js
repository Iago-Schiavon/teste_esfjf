/*
 * Arquivo: netlify/functions/get-fila.js
 * (Versão 6 - Adiciona a Data de Envio)
 */

exports.handler = async (event, context) => {
  
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const SITE_ID = process.env.SITE_ID; 
  const FORM_NAME = "pedidos-esf-v2"; 
  const url = `https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions`;

  try {
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });

    if (!response.ok) {
      throw new Error(`Erro da API do Netlify: ${response.status} - ${response.statusText}`);
    }

    const allSubmissions = await response.json();
    const nossosPedidos = allSubmissions.filter(s => s.form_name === FORM_NAME);
    const pedidosEmOrdem = nossosPedidos.reverse();

    // ===================================================
    // MUDANÇA AQUI: O FILTRO DE SEGURANÇA
    // ===================================================
    // Agora ele também pega o 'created_at' e formata
    //
    const listaSegura = pedidosEmOrdem.map((item, index) => {
      
      // 1. Pega a data (ex: "2025-11-06T18:30:00.000Z")
      const dataISO = new Date(item.created_at);
      
      // 2. Formata para o padrão pt-BR (ex: "06/11/2025")
      const dataFormatada = dataISO.toLocaleDateString('pt-BR', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      });

      // 3. Retorna o objeto "limpo"
      return {
        posicao: index + 1,
        nome: item.data.nome,
        data: dataFormatada // <--- ADICIONADO
      };
    });
    // ===================================================

    // Retorna a lista segura
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(listaSegura), 
    };

  } catch (error) {
    console.error("ERRO INTERNO DA FUNÇÃO (v6):", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Erro: ${error.message}` }),
    };
  }
};