//

import { useState, type ChangeEvent, type SubmitEvent } from "react";
import FormComponent from "./FormComponent";
import TodosContainer from "./TodosContainer";
import axios from "axios";
import { useEffect } from "react";

export interface TodoCardProps {
  id: string;
  checked: boolean;
  title: string;
}

export interface FormComponentProps extends TodoCardProps {
  handleFormOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}

export interface TodoCardFunctions extends TodoCardProps {
  handleTodoCheck: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
  handleTodoDelete: (id: string) => void;
  handleTodoEdit: (id: string) => void;
}

export interface TodosContainerProps {
  todosList: TodoCardProps[];
  handleTodoCheck: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
  handleTodoDelete: (id: string) => void;
  handleTodoEdit: (id: string) => void;
}

export default function TodoApp() {
  //States
  //State to store input change
  //Once submit is clicked, state will be stored as a todo entry
  //In other state that will save a list of todos
  const [todo, setTodo] = useState<TodoCardProps>({
    id: "",
    title: "",
    checked: false,
  });

  //State to store all todo entries in one array
  const [todosList, setTodosList] = useState<TodoCardProps[]>([]);

  //Handlers

  //Handles getting the stored data from the localhost:3000 server
  const handleGetData = async () => {
    try {
      await axios
        .get("http://localhost:3000/data")
        .then((data) => setTodosList(data.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetData();
  }, []);

  //Handles the form input change that allows typing in the input
  const handleFormOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo((prevTodo) => ({ ...prevTodo, [e.target.name]: e.target.value }));
  };

  //Handles the onSubmit event for the form to add the input to the todo list
  const handleOnSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); //Prevents the default refresh action from submitting the form
    if (todo.id === "") {
      // Creating a new task and sending it to the POST Route
      try {
        const newTodo: TodoCardProps = {
          id: crypto.randomUUID(),
          title: todo.title,
          checked: false,
        };
        // Send a post request to the server
        setTodosList((prevList) => [...prevList, newTodo]);
        await axios.post("http://localhost:3000/data", newTodo);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Edit section used for PATCH Route
      setTodosList((prevList) =>
        prevList.map((entry) =>
          entry.id === todo.id ? { ...entry, title: todo.title } : { ...entry },
        ),
      );
    }
    setTodo({ id: "", title: "", checked: false });
  };

  //Handles the checkbox toggle in the Todo Card
  const handleTodoCheck = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    setTodosList((prevList) =>
      prevList.map((entry) =>
        entry.id === id
          ? { ...entry, checked: e.target.checked }
          : { ...entry },
      ),
    );
  };

  //Handles the deletion of an entry using the delete button
  const handleTodoDelete = async (id: string) => {
    try {
      // Send a delete request to the server and add the id to the link to be used as its params
      await axios.delete(`http://localhost:3000/data/${id}`);
      setTodosList((prevList) => prevList.filter((entry) => entry.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  //Handles editing an entry to change the title
  const handleTodoEdit = (id: string) => {
    const todoEntry = todosList.find((entry) => entry.id === id) || {
      title: "",
      id: "",
      checked: false,
    };
    setTodo({ ...todoEntry });
  };

  //Main Return
  return (
    <div className="TodoApp">
      <h1>Todo List App</h1>
      <FormComponent
        {...todo}
        handleFormOnChange={handleFormOnChange}
        handleOnSubmit={handleOnSubmit}
      />
      <TodosContainer
        todosList={todosList}
        handleTodoCheck={handleTodoCheck}
        handleTodoDelete={handleTodoDelete}
        handleTodoEdit={handleTodoEdit}
      />
    </div>
  );
}
