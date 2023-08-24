import { NextApiRequest, NextApiResponse } from "next";
import { todoRepository } from "@server/repository/todos";
import { z as schema } from "zod";

const bodySchema = schema.object({
  content: schema.string(),
});

/**
 * Controller todo (server)
 */
export const todoController = {
  get,
  create,
};

/**
 * Retorna todos.
 * @param {NextApiRequest} req - O objeto de solicitação HTTP recebido.
 * @param {NextApiResponse} res - O objeto de resposta HTTP a ser enviado.
 * @throws {Error} Se ocorrer um erro no servidor durante a recuperação das todos.
 */
async function get(req: NextApiRequest, res: NextApiResponse) {
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

/**
 * Cria uma nova todo.
 * @param {NextApiRequest} req - O objeto de solicitação HTTP recebido.
 * @param {NextApiResponse} res - O objeto de resposta HTTP a ser enviado.
 * @returns {Todo} - A todo criada.
 */
async function create(req: NextApiRequest, res: NextApiResponse) {
  const body = bodySchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({
      error: {
        message: "Invalid body",
        description: body.error.issues,
      },
    });
    return;
  }

  if (body.data.content === "") {
    res.status(400).json({
      error: {
        message: "Empty content",
        description: "You must provide a non empty string",
      },
    });
    return;
  }

  const createdTodo = await todoRepository.createByContent(body.data.content);

  return res.status(201).json({
    todo: createdTodo,
  });
}
