import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import EnterName from "./pages/EnterName";
import TeacherCreate from "./pages/TeacherCreate";
import TeacherView from "./pages/TeacherView";
import StudentWait from "./pages/StudentWait";
import StudentQuestion from "./pages/StudentQuestion";
import PollHistory from "./pages/PollHistory";
import ResultsView from "./pages/ResultsView";
import socket from "./socket";

export default function App() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  return (
    <div className="app-root">
      <Routes>
        <Route
          path="/"
          element={<RoleSelect setRole={setRole} navigate={navigate} />}
        />
        <Route
          path="/enter-name"
          element={<EnterName role={role} setName={setName} navigate={navigate} />}
        />
        <Route
          path="/teacher/create"
          element={<TeacherCreate name={name} socket={socket} navigate={navigate} />}
        />
        <Route path="/teacher/view/:id" element={<TeacherView socket={socket} />} />
        <Route path="/student/wait" element={<StudentWait name={name} socket={socket} />} />
        <Route
          path="/student/question/:id"
          element={<StudentQuestion name={name} socket={socket} />}
        />
        <Route path="/history" element={<PollHistory />} />
        <Route path="/results/:id" element={<ResultsView />} />
      </Routes>
    </div>
  );
}
