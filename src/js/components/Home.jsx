import React, { useState, useEffect } from "react";




const Home = () => {
  const [Tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState("");
  const [message, setMessage] = useState("");
  const apiUrl = "https://playground.4geeks.com/todo";

  useEffect(() => {
    getTaskFromServer();
  }, []);

  async function getTaskFromServer() {
    try {
      let response = await fetch(apiUrl + "/users/GiovannyTrotta",);
      if (!response.ok) {
        console.info(response.statusText, response.status);
        setMessage(`Error ${response.status}: ${response.statusText}`);
        setTimeout(() => setMessage(""), 5000);
        return;
      }
      let dataJson = await response.json();
      setTasks(dataJson.todos);
    } catch (error) {
      console.error("Error al obtener las tareas", error);
    }
  }

  async function addNewTask() {
    if (newTasks.trim() === "") return;

    let response = await fetch(`${apiUrl}/todos/GiovannyTrotta`, {
      body: JSON.stringify({ label: newTasks, is_done: false }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      setMessage(`Error ${response.status}: ${response.statusText}`);
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setNewTasks("");

    await getTaskFromServer();
  }

  async function deleteTask(index) {
    let tasksId = Tasks[index]?.id;
    if (!tasksId){
      console.error("la tarea no tiene un id valido")
      return;
    }

    let response = await fetch(`${apiUrl}/todos/${tasksId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error al eliminar la tarea");
      return;
    }

    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));

    await getTaskFromServer(); 
  }

  const toggleTask = async (index) => {
    let task = Tasks[index];
    if (!task?.id){
      console.error("la tarea no tiene un id valido")
      return;
    }
    
let updatedTasks= {...Tasks, is_done: !task.is_done};

    let response = await fetch(`${apiUrl}/todos/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTasks),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error al actualizar la tarea");
      return;
    }

    setTasks((prevTasks) => 
    prevTasks.map((t, i) => (i === index ? updatedTasks : t))
  );

    await getTaskFromServer();
  };

  async function clearTasks() {
    let response = await fetch(`${apiUrl}/users/GiovannyTrotta`, {
      method: "POST",
      body: JSON.stringify([]),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error al limpiar las tareas");
      return;
    }

setTasks([]);

  }

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
        <button className="btn btn-primary" onClick={addNewTask}>
          Agregar
        </button>
      </div>
      {message?<div className="alert alert-danger" role="alert">
        {message}
</div>:""}

      <ul className="list-group">
        {Tasks.map((task, index) => (
          <li
            key={index}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              task.is_done ? "text-decoration-line-through text-muted" : ""
            }`}
          >
            <span onClick={() => toggleTask(index)} style={{ cursor: "pointer" }}>
              {task.label}
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