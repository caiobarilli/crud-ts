import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

const bg = "/bg.jpeg"; // side bar backeground image

interface Todo {
  id: string;
  content: string;
}

function HomePage() {
  const initialLoadComplete = React.useRef(false);

  const [page, setPage] = React.useState(1),
    [totalPages, setTotalPages] = React.useState(0);

  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [searchText, setSearchText] = React.useState("");
  const homeTodos = todoController.filterTodosByContent(searchText, todos);

  const hasNoTodos = todos.length === 0 && !isLoading;
  const hasMorePages = totalPages > page;

  const [newTodoContent, setNewTodoContent] = React.useState("");

  React.useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, [page]);

  return (
    <main>
      <GlobalStyles themeName="crudComQualidade" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            todoController.create({
              content: newTodoContent,
              onSucess(todo: Todo) {
                setTodos((oldTodos) => {
                  return [todo, ...oldTodos];
                });
              },
              onError(errorMessage) {
                alert(errorMessage || "Erro ao criar todo");
              },
            });
          }}
        >
          <input
            type="text"
            placeholder="Correr, Estudar..."
            onChange={function newTodoHandler(e) {
              setNewTodoContent(e.target.value);
            }}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {homeTodos.map((currTodo) => {
              return (
                <tr key={currTodo.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{currTodo.id.substring(0, 4)}</td>
                  <td>{currTodo.content}</td>
                  <td align="right">
                    <button data-type="delete">Apagar</button>
                  </td>
                </tr>
              );
            })}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);

                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                          setTotalPages(pages);
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    Página {page}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default HomePage;
