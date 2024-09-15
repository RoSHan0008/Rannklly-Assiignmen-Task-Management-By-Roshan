import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  deleteTask,
  updateTask,
  moveTaskToInProgress,
  moveTaskToDone,
  createTask,
} from "../api/tasksSlice";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const TaskListView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, status, error } = useSelector((state) => state.tasks);

  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState({
    todo: "",
    completed: false,
    userId: 1,
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleToggleCompletion = (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    dispatch(updateTask({ id: task.id, updates: updatedTask }));
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const handleMoveToInProgress = (id) => {
    dispatch(moveTaskToInProgress(id));
  };

  const handleMoveToDone = (id) => {
    dispatch(moveTaskToDone(id));
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTask(newTask));
    setNewTask({ todo: "", completed: false, userId: 1 });
    handleClosePopup();
  };

  if (status === "loading") {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <Loader />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
        }}
      >
        Error: {error}
      </div>
    );
  }

  const handleTaskClick = (id) => {
    navigate(`/task/${id}`);
  };

  return (
    <div className="container">
      <div className="title-row">
        <h1 className="title" >Task Manager</h1>
        <button className="create-button" onClick={handleOpenPopup}>
          Create New Task
        </button>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Completed</th>
            <th>Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.userId}</td>
              <td>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleCompletion(task)}
                />
              </td>
              <td
                onClick={() => handleTaskClick(task.id)}
                className="task-link"
              >
                {task.todo}
              </td>
              <td>
                {task.completed ? (
                  <button
                    className="move-button"
                    onClick={() => handleMoveToInProgress(task.id)}
                  >
                    Move to In Progress
                  </button>
                ) : (
                  <button
                    className="move-button"
                    onClick={() => handleMoveToDone(task.id)}
                  >
                    Mark as Done
                  </button>
                )}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Create New Task</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Task:
                <input
                  type="text"
                  name="todo"
                  value={newTask.todo}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                User ID:
                <input
                  type="number"
                  name="userId"
                  value={newTask.userId}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Add Task</button>
              <button type="button" onClick={handleClosePopup}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListView;
