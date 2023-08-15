import { NextApiRequest, NextApiResponse } from "next";

/**
 * Manipulador da API que lida com as solicitações HTTP recebidas.
 * @param {NextApiRequest} request - O objeto de solicitação HTTP recebido.
 * @param {NextApiResponse} response - O objeto de resposta HTTP a ser enviado.
 */
export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  response.status(200).json({ message: "NextJS" });
}
