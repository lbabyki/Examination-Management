import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Subjects from "./pages/Subjects";
import Questions from "./pages/Questions";
import Quiz from "./pages/Quiz";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import Admin from "./pages/Admin";
import CreateQuiz from "./pages/CreateQuiz";
import ManageAll from "./pages/ManageAll";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/register"
              element={
                <RequireAuth>
                  <RequireRole role="admin">
                    <Register />
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/subjects"
              element={
                <RequireAuth>
                  <Subjects />
                </RequireAuth>
              }
            />
            <Route
              path="/questions"
              element={
                <RequireAuth>
                  <Questions />
                </RequireAuth>
              }
            />
            <Route
              path="/quiz"
              element={
                <RequireAuth>
                  <Quiz />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <RequireRole role="admin">
                    <Admin />
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/create-quiz"
              element={
                <RequireAuth>
                  <CreateQuiz />
                </RequireAuth>
              }
            />
            <Route
              path="/manage-all"
              element={
                <RequireAuth>
                  <RequireRole role="admin">
                    <ManageAll />
                  </RequireRole>
                </RequireAuth>
              }
            />
            {/* Các route khác */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
