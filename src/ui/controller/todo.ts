import { todoRepository } from "@ui/repository/todo";

interface TodoControllerParams {
  page: number;
}

/**
 * Controlador todo (UI)
 */
export const todoController = {
  get,
  filterTodosByContent,
};

/**
 * Realiza uma requisição assíncrona para obter a lista de todos do servidor.
 * @param {number} params.page - O número da página a ser obtida (começando em 1).
 * @returns {Promise<Array>} Uma Promise que resolve para um array os todos obtidos do servidor.
 */
async function get({ page }: TodoControllerParams) {
  return todoRepository.get({ page, limit: 2 });
}

/**
 * Filtra os todos pelo conteúdo.
 * @param {string} search - O texto a ser buscado.
 * @param {Array<Todo>} todos - O array de todos.
 * @returns {Array<Todo>} Um array de todos filtrados pelo conteúdo.
 */
function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Array<Todo> {
  const filteredTodos = todos.filter((todo) => {
    const textSearchLowerCase = search.toLowerCase();
    const contentLowerCase = todo.content.toLowerCase();

    return contentLowerCase.includes(textSearchLowerCase);
  });
  return filteredTodos;
}
