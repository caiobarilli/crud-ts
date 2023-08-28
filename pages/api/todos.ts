import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

/**
 * Manipulador da API que lida com as solicitações HTTP recebidas.
 * @param {NextApiRequest} request - O objeto de solicitação HTTP recebido.
 * @param {NextApiResponse} response - O objeto de resposta HTTP a ser enviado.
 */
export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    todoController.get(request, response);
    return;
  }

  if (request.method === "POST") {
    todoController.create(request, response);
    return;
  }

  response.status(405).json({
    message: "Method not allowed",
  });
}
