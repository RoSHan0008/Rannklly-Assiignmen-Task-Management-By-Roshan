import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const TaskDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/todos/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setTask(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="task-detail">
      <button className="back-button" onClick={handleBackToHome}>
        Back to Home
      </button>
      <h1>Task Details</h1>
      {task && (
        <div className="task-detail-content">
          <p>
            <strong>Task:</strong> {task.todo}
          </p>
          <p>
            <strong>User ID:</strong> {task.userId}
          </p>
          <p>
            <strong>Completed:</strong> {task.completed ? "Yes" : "No"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskDetailView;
