import { NextApiRequest, NextApiResponse } from "next";
import { todoRepository } from "@server/repository/todos";
import { z as schema } from "zod";
import { HttpNotFoundError } from "@server/infra/errors";

/**
 * Validação do corpo da requisição.
 */
const bodySchema = schema.object({
  content: schema.string(),
});

/**
 * Controller todo (server)
 */
export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
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

  if (
    body.data.content === "" ||
    body.data.content.replace(/\s+/g, "") === ""
  ) {
    res.status(411).json({
      error: {
        message: "Length Required",
        description:
          "The request did not specify the length of its content, which is required by the requested resource.",
      },
    });
    return;
  }

  const createdTodo = await todoRepository.createByContent(body.data.content);

  return res.status(201).json({
    todo: createdTodo,
  });
}

/**
 * Altera o status de done de uma todo.
 * @param {NextApiRequest} req - O objeto de solicitação HTTP recebido.
 * @param {NextApiResponse} res - O objeto de resposta HTTP a ser enviado.
 * @returns {Todo} - A todo atualizada.
 * @throws {Error} Se ocorrer um erro no servidor durante a alteração do status de done da todo.
 */
async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;

  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "You must to provide a valid todo id",
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(404).json({
        error: error.message,
      });
    return;
  }
}

/**
 * Deleta uma todo.
 * @param {NextApiRequest} req - O objeto de solicitação HTTP recebido.
 * @param {NextApiResponse} res - O objeto de resposta HTTP a ser enviado.
 */
async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const QuerySchema = schema.object({
    id: schema.string().uuid().nonempty(),
  });
  const parsedQuery = QuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    res.status(400).json({
      error: {
        message: "You must to provide a valid todo uuid",
      },
    });
    return;
  }

  try {
    const todoId = parsedQuery.data.id;
    await todoRepository.deleteById(todoId);
    res.status(204).end();
  } catch (error) {
    if (error instanceof HttpNotFoundError) {
      return res.status(error.status).json({
        error: {
          message: error.message,
        },
      });
    }
    res.status(500).json({
      error: {
        message: `Internal server error`,
      },
    });
  }
}
