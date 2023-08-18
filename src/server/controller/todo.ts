import { todoRepository } from "@server/repository/todos";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Controller todo (server)
 */
export const todoController = {
  get,
};

/**
 * Retorna todos.
 * @param {NextApiRequest} _ - O objeto de solicitação HTTP recebido (não utilizado neste contexto).
 * @param {NextApiResponse} res - O objeto de resposta HTTP a ser enviado.
 * @throws {Error} Se ocorrer um erro no servidor durante a recuperação das todos.
 */
function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = req.query;
    const page = Number(query.page);
    const limit = Number(query.limit);

    if (query.page && isNaN(page)) {
      throw new Error("Invalid query params");
    }
    if (query.limit && isNaN(page)) {
      throw new Error("Invalid query params");
    }

    const output = todoRepository.get({
      page: page,
      limit: limit,
    });

    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
