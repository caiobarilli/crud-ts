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
  try {
    // eslint-disable-next-line no-console
    console.log(request.method); // Registra o método da solicitação no console

    if (request.method === "GET") {
      todoController.get(request, response);
      return;
    }

    response.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    response.status(500).json({
      error: "Internal server error",
    });
  }
}
