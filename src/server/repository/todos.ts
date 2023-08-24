import { read, create } from "@db-crud-todo";

interface Todo {
  id: string;
  date: string;
  content: string;
  done: boolean;
}

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

/**
 * Repository todo (server)
 */
export const todoRepository = {
  get,
  createByContent,
};

/**
 * Obtém uma lista de todos paginada.
 * @param {TodoRepositoryGetParams} params - Parâmetros de busca opcionais.
 * @returns {TodoRepositoryGetOutput} - Saída contendo a lista de tarefas paginada, total de tarefas e número de páginas.
 */
function get({
  page,
  limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
  const CurrentPage = page || 1;
  const CurrentLimit = limit || 10;

  const ALL_TODOS = read();

  const startIndex = (CurrentPage - 1) * CurrentLimit,
    endIndex = CurrentPage * CurrentLimit,
    paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);

  const totalPages = Math.ceil(ALL_TODOS.length / CurrentLimit);

  return {
    total: ALL_TODOS.length,
    pages: totalPages,
    todos: paginatedTodos,
  };
}

/**
 * Cria uma nova todo.
 * @param {string} content - Conteúdo da todo.
 * @returns {Todo} - A todo criada.
 **/
async function createByContent(content: string): Promise<Todo> {
  const newTodo = create(content);

  return newTodo;
}
