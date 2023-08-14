/**
 * Controlador todo (UI)
 */
export const todoController = {
  get,
};

/**
 * Realiza uma requisição assíncrona para obter a lista de tarefas do servidor.
 * @returns {Promise<Array>} Uma Promise que resolve para um array os todos obtidos do servidor.
 */
async function get() {
  return fetch("/api/todos").then(async (curTodos) => {
    const todosString = await curTodos.text();
    const serverString = JSON.parse(todosString).todos;
    return serverString;
  });
}
