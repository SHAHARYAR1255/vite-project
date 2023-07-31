import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Amplify, API, } from "aws-amplify";
import awsconfig from "./aws-exports";
import { addTodo } from "./graphql/mutations";
import { getTodos } from "./graphql/queries";
import shortid from "shortid"
Amplify.configure(awsconfig);

function App() {
  const [loading, setLoading] = useState(true);
  const [todoData, setTodoData] = useState(null);
  const todoTitleRef = useRef("");
  const addTodoMutation = async () => {
    try {
      const todo = {
        id: shortid.generate(),
        title: todoTitleRef.current.value,
        done: false,
      };
      const data = await API.graphql({
        query: addTodo,
        variables: {
          todo: todo,
        },
      });
      console.log(data);

      todoTitleRef.current.value = "";
      fetchTodos();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTodos = async () => {
    try {
      const data = await API.graphql({
        query: getTodos,
      });
      setTodoData(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <h1>Loading ...</h1>
        ) : (
          <div>
            <label>
              Todo:
              <input ref={todoTitleRef} />
            </label>
            <button onClick={() => addTodoMutation()}>Create Todo</button>
            {todoData.data &&
              todoData.data.getTodos.map((item, ind) => (
                <div
                  style={{ marginLeft: "1rem", marginTop: "2rem" }}
                  key={ind}
                >
                  {item.title}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
