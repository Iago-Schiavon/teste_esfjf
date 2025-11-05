/*
 * Arquivo: netlify/functions/get-fila.js
 *
 * Este é o nosso "backend". É um mini-programa que será
 * executado nos servidores do Netlify.
 */

// 'exports.handler' é o nome padrão que o Netlify
// procura para executar a função.
exports.handler = async (event, context) => {
  
  // 1. Pegar nossos "segredos" do cofre (Variáveis de Ambiente)
  //    que configuramos no Passo 3.
  const FORM_ID = process.env.FORM_ID;
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;

  // 2. Montar a URL da API do Netlify que queremos acessar.
  //    Vamos pedir os detalhes do nosso formulário específico.
  const url = `https://api.netlify.com/api/v1/forms/${FORM_ID}`;

  // 3. Bloco try...catch para lidar com possíveis erros
  try {
    
    // 4. Fazer a chamada de API (usando 'fetch',
    //    que já vem no Netlify)
    const response = await fetch(url, {
      
      // Nós precisamos nos "autenticar" na chamada,
      // provando que somos os donos do site.
      headers: {
        // Usamos o Token Secreto (Chave 2) aqui.
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    // Se a resposta não for "OK" (ex: 404, 500),
    // nós paramos e avisamos o erro.
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }

    // 5. Converter a resposta em JSON (um formato que o JS entende)
    const data = await response.json();

    // 6. A MÁGICA: A API nos retorna um objeto com várias
    //    informações. A que queremos é a 'submission_count'
    //    (contagem de envios).
    const totalPedidos = data.submission_count;

    // 7. SUCESSO! Vamos retornar os dados para o frontend.
    return {
      statusCode: 200, // 200 = "Tudo Certo"
      
      // Esta é a "porta de permissão" (CORS).
      // Ela permite que o seu site (em ...netlify.app)
      // acesse esta função com segurança.
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      
      // O 'body' DEVE ser uma string.
      // Convertemos nosso objeto de resposta para string.
      body: JSON.stringify({
        total: totalPedidos
      }),
    };

  } catch (error) {
    
    // 8. ERRO! Se algo deu errado (ex: token errado),
    //    avisamos o frontend.
    return {
      statusCode: 500, // 500 = "Erro de Servidor"
      body: JSON.stringify({
        message: `Erro interno do servidor: ${error.message}`
      }),
    };
  }
};
