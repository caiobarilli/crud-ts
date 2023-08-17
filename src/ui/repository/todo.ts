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
    const todos = fetch("/api/todos").then(async (curTodos) => {
      const stringTODOS = await curTodos.text();

      const ALL_TODOS = parseTodosFromServer(JSON.parse(stringTODOS));

      const startIndex = (page - 1) * limit,
        endIndex = page * limit,
        paginatedTodos = ALL_TODOS.todos.slice(startIndex, endIndex);

      const totalPages = Math.ceil(ALL_TODOS.todos.length / limit);

      return {
        todos: paginatedTodos,
        total: ALL_TODOS.todos.length,
        pages: totalPages,
      };
    });

    return todos;
  } catch (error) {
    throw new Error("Erro ao obter a lista de todos no repository.");
  }
}

/**
 * Obtém uma lista desconhecida e retorna um array de objetos do tipo Todos.
 * @param {unknown} reponseBody - O objeto que contem as todos.
 * @returns {Array<Todo>} Um array do tipo Todo.
 * @throws {Error} Se ocorrer um erro com o tipo do objeto no array de todos.
 */
function parseTodosFromServer(reponseBody: unknown): { todos: Array<Todo> } {
  if (
    reponseBody !== null &&
    typeof reponseBody === "object" &&
    "todos" in reponseBody &&
    Array.isArray(reponseBody.todos)
  ) {
    console.log("object", reponseBody.todos);

    return {
      todos: reponseBody.todos.map((todo: unknown) => {
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
    todos: [],
  };
}
