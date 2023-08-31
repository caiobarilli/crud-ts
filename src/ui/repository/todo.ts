import { Todo, TodoSchema } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoRepositoryGetParams {
  page: number;
  limit: number;
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
  createByContent,
  toggleDone,
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
 * Cria uma todo com o conteúdo especificado.
 * @param {string} content - O conteúdo da todo.
 * @returns {Promise<Todo>} Uma Promise que resolve para a todo criada.
 * @throws {Error} Se ocorrer um erro durante a criação da todo.
 **/
async function createByContent(content: string): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (response.ok) {
    const serverResponse = await response.json();
    const serverResponseSchema = schema.object({
      todo: TodoSchema,
    });
    const serverResponseParsed = serverResponseSchema.safeParse(serverResponse);

    if (!serverResponseParsed.success) {
      throw new Error("Erro ao criar a todo no repository.");
    }

    return serverResponseParsed.data.todo;
  }

  throw new Error("Erro ao criar a todo no repository.");
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
          date: date,
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

async function toggleDone(id: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}/toggle-done`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const serverResponse = await response.json();
    const serverResponseSchema = schema.object({
      todo: TodoSchema,
    });
    const serverResponseParsed = serverResponseSchema.safeParse(serverResponse);

    if (!serverResponseParsed.success) {
      throw new Error("Erro ao alterar a todo no repository.");
    }

    const updatedTodo = serverResponseParsed.data.todo;
    return updatedTodo;
  }

  throw new Error("Erro ao alterar a todo no repository.");
}
