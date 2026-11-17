//This component will contain a todo list as a prop
//It will be mapped into several TodoCards
import type { TodosContainerProps } from "./TodoApp";
import TodoCard from "./TodoCard";

export default function TodosContainer({
  todosList,
  handleTodoCheck,
  handleTodoDelete,
  handleTodoEdit,
}: TodosContainerProps) {
  return (
    <div className="TodosContainer">
      {todosList.length > 0 || "Todo List is Empty"}
      {todosList.map((todo) => (
        <TodoCard
          key={todo.id}
          {...todo}
          handleTodoCheck={handleTodoCheck}
          handleTodoDelete={handleTodoDelete}
          handleTodoEdit={handleTodoEdit}
        />
      ))}
    </div>
  );
}
