import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalActive, setModalActive] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTaskHandler = () => {
    if (value.trim() === "") return;
    const newTask = {
      text: value,
      priority,
      dueDate,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setValue("");
    setPriority("Low");
    setDueDate("");
  };

  const toggleComplete = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const deleteTaskHandler = () => {
    setTasks(tasks.filter((_, index) => index !== taskToDelete));
    setModalActive(false);
    setTaskToDelete(null);
  };

  const openModal = (index) => {
    setTaskToDelete(index);
    setModalActive(true);
  };

  const cancelDelete = () => {
    setModalActive(false);
    setTaskToDelete(null);
  };

  const clearAllTasks = () => {
    if (window.confirm("Delete all tasks?")) {
      setTasks([]);
    }
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  const saveEdit = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, text: editText } : task
    );
    setTasks(updated);
    setEditIndex(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => {
      if (filterStatus === "Completed") return task.completed;
      if (filterStatus === "Pending") return !task.completed;
      return true;
    });

  return (
    <>
      <div>
        <h1>My To Do List</h1>
        <p>Total: {tasks.length} | Completed: {tasks.filter(t => t.completed).length} | Pending: {tasks.length - tasks.filter(t => t.completed).length}</p>
      </div>

      <div>
        <h2>Search</h2>
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button onClick={() => setSearchTerm("")}>Clear Search</button>
      </div>

      <div>
        <h2>Add Task</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Task"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTaskHandler}>Add Task</button>
        <button onClick={clearAllTasks}>Clear All</button>
      </div>

      <div>
        <h2>Filter</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div>
        <ul>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <li
                key={index}
                className={task.completed ? "completed" : ""}
                style={{
                  borderLeft: `6px solid ${
                    task.priority === "High"
                      ? "red"
                      : task.priority === "Medium"
                      ? "orange"
                      : "green"
                  }`,
                }}
              >
                {editIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => saveEdit(index)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>{task.text}</strong> <br />
                      <small>Priority: {task.priority}</small> <br />
                      <small>Due: {task.dueDate || "No due date"}</small>
                    </div>
                    <div>
                      <button onClick={() => toggleComplete(index)}>
                        {task.completed ? "Undo" : "Complete"}
                      </button>
                      <button onClick={() => startEditing(index)}>Edit</button>
                      <button onClick={() => openModal(index)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <li>No tasks found</li>
          )}
        </ul>
      </div>

      {/* Modal Confirmation */}
      {modalActive && (
        <div className="modal active">
          <div className="modal-content">
            <p>Are you sure you want to delete this task?</p>
            <button className="modal-button modal-confirm" onClick={deleteTaskHandler}>Yes</button>
            <button className="modal-button modal-cancel" onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
