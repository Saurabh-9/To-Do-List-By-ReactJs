import React, { useState } from "react";
import "./App.css";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Task = ({ task, index, moveTask, toggleTaskCompletion, toggleTaskFavorite, pinTask, deleteTask }) => {
  const [, drag] = useDrag(() => ({
    type: "task",
    item: { index },
  }));

  const [, drop] = useDrop(() => ({
    accept: "task",
    hover: (item) => {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
  }));

  return (
    <li
      ref={(node) => drag(drop(node))}
      className={`${task.completed ? "completed" : ""} ${task.favorite ? "favorite" : ""}`}
    >
      <div>
        <span onClick={() => toggleTaskCompletion(index)}>
          {task.text} ({task.completed ? "Completed" : "Incomplete"})
        </span>
        <br />
        <small>Deadline: {task.deadline.toLocaleString()}</small>
      </div>
      <div className="buttons">
        <button className="favorite-btn" onClick={() => toggleTaskFavorite(index)}>
          {task.favorite ? "Unfavorite" : "Favorite"}
        </button>
        <button className="pin-btn" onClick={() => pinTask(index)}>
          Pin
        </button>
        <button className="delete-btn" onClick={() => deleteTask(index)}>
          Delete
        </button>
      </div>
    </li>
  );
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Add a new task with a deadline
  const addTask = () => {
    if (newTask.trim() === "" || deadline === "") return;
    setTasks([
      ...tasks,
      {
        text: newTask,
        completed: false,
        favorite: false,
        deadline: new Date(deadline),
      },
    ]);
    setNewTask("");
    setDeadline("");
  };

  // Toggle task completion
  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  // Toggle task favorite
  const toggleTaskFavorite = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].favorite = !updatedTasks[index].favorite;
    setTasks(updatedTasks);
  };

  // Pin task to the top
  const pinTask = (index) => {
    const updatedTasks = [...tasks];
    const [pinnedTask] = updatedTasks.splice(index, 1);
    updatedTasks.unshift(pinnedTask);
    setTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  // Move task in the list
  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  // Calculate progress
  const calculateProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`App ${isDarkMode ? "dark" : "light"}`}>
        <div className="sticker" onClick={toggleTheme}>
          <span>{isDarkMode ? "🌞" : "🌙"}</span>
        </div>
        <h1>To-Do List with Deadlines</h1>
        <div className="progress-container">
          <h2>Progress: {Math.round(calculateProgress())}%</h2>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task"
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Set a deadline"
          />
          <button onClick={addTask}>Add</button>
        </div>
        <ul className="task-list">
          {tasks.map((task, index) => (
            <Task
              key={index}
              index={index}
              task={task}
              moveTask={moveTask}
              toggleTaskCompletion={toggleTaskCompletion}
              toggleTaskFavorite={toggleTaskFavorite}
              pinTask={pinTask}
              deleteTask={deleteTask}
            />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
}

export default App;