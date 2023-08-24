import fs from "fs";
import { v4 as uuid } from "uuid";
const DB_FILE_PATH = "./core/db";

type UUID = string;

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

/**
 * Cria uma nova todo com o conteúdo fornecido e a adiciona ao banco de dados.
 * @param {string} content - O conteúdo da nova todo.
 * @returns {Todo} A todo recém-criada.
 */
export function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Array<Todo> = [...read(), todo];

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
        dogs: [],
      },
      null,
      2
    )
  );

  return todo;
}

/**
 * Lê as todos do banco de dados e retorna um array de objetos Todo.
 * @returns {Array<Todo>} Um array contendo as todos armazenadas no banco de dados.
 */
export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) {
    return [];
  }

  return db.todos;
}

/**
 * Atualiza uma todo existente com base no ID fornecido e nas informações parciais fornecidas.
 * @param {UUID} id - O ID da todo a ser atualizada.
 * @param {Partial<Todo>} partialTodo - As informações parciais a serem atualizadas na todo.
 * @returns {Todo} A todo atualizada.
 */
export function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();

  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  if (!updatedTodo) {
    throw new Error("Please, provide another ID!");
  }

  return updatedTodo;
}

/**
 * Atualiza o conteúdo de uma todo com base no ID fornecido.
 * @param {UUID} id - O ID da todo a ser atualizada.
 * @param {string} content - O novo conteúdo da todo.
 * @returns {Todo} A todo com o conteúdo atualizado.
 */
export function updateContentById(id: UUID, content: string): Todo {
  return update(id, {
    content,
  });
}

/**
 * Exclui uma todo com base no ID fornecido.
 * @param {UUID} id - O ID da todo a ser excluída.
 */
export function deleteById(id: UUID) {
  const todos = read();

  const todosWithoutOne = todos.filter((todo) => {
    if (id === todo.id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
      },
      null,
      2
    )
  );
}

/**
 * Limpa completamente o banco de dados, apagando todo o seu conteúdo.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}
