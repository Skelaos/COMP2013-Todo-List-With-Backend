//This component will contain
//1. A body for the title of the todo message
//2. A button for deleting this todo entry
//3. A button to edit this todo entry
//4. A checkbox to indicate a completed entry
import type { TodoCardFunctions } from "./TodoApp";

export default function TodoCard({
  id,
  checked,
  title,
  handleTodoCheck,
  handleTodoDelete,
  handleTodoEdit,
}: TodoCardFunctions) {
  return (
    <div className="TodoCard">
      <div>
        {" "}
        <input
          type="checkbox"
          name="checked"
          id="checked"
          checked={checked}
          onChange={(e) => handleTodoCheck(e, id)}
        />
        <span
          style={
            checked
              ? { textDecoration: "line-through" }
              : { textDecoration: "none" }
          }
        >
          {title}
        </span>
      </div>
      <div>
        <button onClick={() => handleTodoDelete(id)}>Delete</button>
        <button onClick={() => handleTodoEdit(id)}>Edit</button>
      </div>
    </div>
  );
}
