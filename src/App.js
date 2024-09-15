import "./App.css";
import TaskDetailView from "./component/TaskDetailView";
import TaskListView from "./component/TaskListView";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskListView />} />
        <Route path="/task/:id" element={<TaskDetailView />} />
      </Routes>
    </Router>
  );
}

export default App;
