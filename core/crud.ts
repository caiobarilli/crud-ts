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
 * Cria uma nova tarefa com o conteúdo fornecido e a adiciona ao banco de dados.
 * @param {string} content - O conteúdo da nova tarefa.
 * @returns {Todo} A tarefa recém-criada.
 */
function create(content: string): Todo {
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
 * Lê as tarefas do banco de dados e retorna um array de objetos Todo.
 * @returns {Array<Todo>} Um array contendo as tarefas armazenadas no banco de dados.
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
 * Atualiza uma tarefa existente com base no ID fornecido e nas informações parciais fornecidas.
 * @param {UUID} id - O ID da tarefa a ser atualizada.
 * @param {Partial<Todo>} partialTodo - As informações parciais a serem atualizadas na tarefa.
 * @returns {Todo} A tarefa atualizada.
 */
function update(id: UUID, partialTodo: Partial<Todo>): Todo {
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
 * Atualiza o conteúdo de uma tarefa com base no ID fornecido.
 * @param {UUID} id - O ID da tarefa a ser atualizada.
 * @param {string} content - O novo conteúdo da tarefa.
 * @returns {Todo} A tarefa com o conteúdo atualizado.
 */
function updateContentById(id: UUID, content: string): Todo {
  return update(id, {
    content,
  });
}

/**
 * Exclui uma tarefa com base no ID fornecido.
 * @param {UUID} id - O ID da tarefa a ser excluída.
 */
function deleteById(id: UUID) {
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
function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}
