import { read } from "@db-crud-todo";
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
 */
function get(_: NextApiRequest, res: NextApiResponse) {
  try {
    const ALL_TODOS = read();

    res.status(200).json({
      todos: ALL_TODOS,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
