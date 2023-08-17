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
 * Realiza uma requisição assíncrona para obter a lista de todos do servidor.
 * @param {number} params.page - O número da página a ser obtida (começando em 1).
 * @returns {Promise<Array>} Uma Promise que resolve para um array os todos obtidos do servidor.
 */
async function get({ page }: TodoControllerParams = {}) {
  return todoRepository.get({ page: page || 1, limit: 1 });
}
