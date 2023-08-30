import { read, create, update } from "@db-crud-todo";

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
  toggleDone,
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

  const ALL_TODOS = read().reverse();

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
 * @throws {Error} Se a todo não for encontrada.
 **/
async function createByContent(content: string): Promise<Todo> {
  const newTodo = create(content);
  return newTodo;
}

/**
 * Alterna o estado de done de uma todo.
 * @param {string} id - ID da todo.
 * @returns {Todo} - A todo atualizada.
 * @throws {Error} Se a todo não for encontrada.
 **/
async function toggleDone(id: string): Promise<Todo> {
  const ALL_TODOS = read();
  const todo = ALL_TODOS.find((todo) => todo.id === id);

  if (!todo) throw new Error("Todo not found");

  const updatedTodo = update(todo.id, {
    done: !todo.done,
  });

  return updatedTodo;
}
