import React, { useState, } from "react";



const Home = (props) => {
const [Tasks, setTasks] = useState([]);
const [newTasks, setNewTasks] = useState("");

const addTask = () => {
  if (newTasks.trim() === "") return;
  setTasks([...Tasks, { text: newTasks, completed: false }]);
  setNewTasks("");
};
const deleteTask = (index) => {
  setTasks(Tasks.filter((_, i) => i !== index));
  
};
const toggleTask = (index) => {
  setTasks(
    Tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    )
  );
};

	return (
		<div className="container mt-4">
      <h2 className="text-center">List  ✅</h2>


      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New List..."
          value={newTasks}
          onChange={(e) => setNewTasks(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTask}>
          Agregar
        </button>
      </div>

      <ul className="list-group">
        {Tasks.map((task, index) => (
          <li
            key={index}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              task.completed ? "text-decoration-line-through text-muted" : ""
            }`}
          >
            <span onClick={() => toggleTask(index)} style={{ cursor: "pointer" }}>
              {task.text}
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(index)}>
              Delete ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;