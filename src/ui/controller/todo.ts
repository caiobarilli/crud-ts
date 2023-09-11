import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControllerGetParams {
  page: number;
}

interface TodoControllerCreateParams {
  content: string;
  onError: (errorMessage?: string) => void;
  onSucess: (todo: Todo) => void;
}

interface TodoControllerToggleDoneParams {
  todoId: string;
  onCheckboxChange: () => void;
  onError: () => void;
}

/**
 * Controlador todo (UI)
 */
export const todoController = {
  get,
  create,
  filterTodosByContent,
  toggleDone,
  deleteById,
};

/**
 * Realiza uma requisição assíncrona para obter a lista de todos do servidor.
 * @param {number} params.page - O número da página a ser obtida (começando em 1).
 * @returns {Promise<Array>} Uma Promise que resolve para um array os todos obtidos do servidor.
 */
async function get({ page }: TodoControllerGetParams) {
  return todoRepository.get({ page, limit: 2 });
}

/**
 * Criar uma nova todo.
 * @param {string} params.content - O conteúdo da todo.
 * @param {Function} params.onError - Função a ser chamada em caso de erro.
 * @param {Function} params.onSucess - Função a ser chamada em caso de sucesso.
 * @returns {Promise<void>} Uma Promise que resolve quando a todo for criada.
 **/
async function create({
  content,
  onError,
  onSucess,
}: TodoControllerCreateParams) {
  const parsedParams = schema.string().nonempty().safeParse(content);

  if (!parsedParams.success) {
    onError("O conteúdo da todo não pode ser vazio.");
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSucess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

/**
 * Deleta uma todo pelo id.
 * @param {string} todoId - O id da todo.
 * @returns {Promise<void>} Uma Promise que resolve quando a todo for deletada.
 **/
async function deleteById(todoId: string): Promise<void> {
  await todoRepository.deleteById(todoId);
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

/**
 * Altera o estado de done de uma todo.
 * @param {string} id - O id da todo.
 **/
async function toggleDone({
  todoId,
  onCheckboxChange,
  onError,
}: TodoControllerToggleDoneParams) {
  todoRepository
    .toggleDone(todoId)
    .then(() => {
      onCheckboxChange();
    })
    .catch(() => {
      onError();
    });

  return;
}
