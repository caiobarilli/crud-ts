import { todoRepository } from "@ui/repository/todo";

interface TodoControllerParams {
  page?: number;
}

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
async function get({ page }: TodoControllerParams = {}) {
  return todoRepository.get({ page: page || 1, limit: 1 });
}
