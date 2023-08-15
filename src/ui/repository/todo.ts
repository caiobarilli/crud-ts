interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}

interface Todo {
  id: string;
  date: Date;
  content: string;
  done: boolean;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

/**
 * Repository todo (UI)
 */
export const todoRepository = {
  get,
};

/**
 * Obtém uma lista paginada de tarefas.
 * @param {number} params.page - O número da página a ser obtida (começando em 1).
 * @param {number} params.limit - O número máximo de tarefas por página.
 * @returns {Promise<TodoRepositoryGetOutput>} Um objeto contendo as tarefas paginadas e informações sobre a paginação.
 * @throws {Error} Se ocorrer um erro durante a recuperação das tarefas.
 */
function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  try {
    const todos = fetch("/api/todos").then(async (curTodos) => {
      const stringTODOS = await curTodos.text(),
        ALL_TODOS = JSON.parse(stringTODOS).todos;

      const startIndex = (page - 1) * limit,
        endIndex = page * limit,
        paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);

      const totalPages = Math.ceil(ALL_TODOS.length / limit);

      return {
        todos: paginatedTodos,
        total: ALL_TODOS.length,
        pages: totalPages,
      };
    });

    return todos;
  } catch (error) {
    throw new Error("Erro ao obter a lista de tarefas no repository.");
  }
}
