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
 * Obtém uma lista paginada de todos.
 * @param {number} params.page - O número da página a ser obtida (começando em 1).
 * @param {number} params.limit - O número máximo de todos por página.
 * @returns {Promise<TodoRepositoryGetOutput>} Um objeto contendo as todos paginadas e informações sobre a paginação.
 * @throws {Error} Se ocorrer um erro durante a recuperação das todos.
 */
function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  try {
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
      async (curTodos) => {
        const stringTODOS = await curTodos.text();

        const ALL_TODOS = parseTodosFromServer(JSON.parse(stringTODOS));

        return {
          todos: ALL_TODOS.todos,
          total: ALL_TODOS.total,
          pages: ALL_TODOS.pages,
        };
      }
    );
  } catch (error) {
    throw new Error("Erro ao obter a lista de todos no repository.");
  }
}

/**
 * Obtém uma lista desconhecida e retorna um array de objetos do tipo Todos.
 * @param {unknown} responseBody - O objeto que contem as todos.
 * @returns {Array<Todo>} Um array do tipo Todo.
 * @throws {Error} Se ocorrer um erro com o tipo do objeto no array de todos.
 */
function parseTodosFromServer(responseBody: unknown): {
  total: number;
  pages: number;
  todos: Array<Todo>;
} {
  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "todos" in responseBody &&
    "total" in responseBody &&
    "pages" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
      todos: responseBody.todos.map((todo: unknown) => {
        if (todo === null && typeof todo !== "object")
          throw new Error("Erro ao obter a objeto todo no repository.");

        const { id, date, content, done } = todo as {
          id: string;
          content: string;
          done: string;
          date: string;
        };

        return {
          id,
          content,
          date: new Date(date),
          done: String(done).toLowerCase() === "true",
        };
      }),
    };
  }

  return {
    pages: 1,
    total: 0,
    todos: [],
  };
}
