import React, { useState } from "react";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import Quiz from "./components/Quiz";
import GamesPlaceholder from "./components/GamesPlaceholder";
import ProgressChart from "./components/ProgressChart";
import "./index.css";


function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [activePage, setActivePage] = useState("home");

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // LOGIN SCREEN
  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div>
      {/* HEADER */}
      <header>
        <h1>Student Wellness App</h1>

        <nav>
          <button onClick={() => setActivePage("home")}>Home</button>
          <button onClick={() => setActivePage("quiz")}>Quiz</button>
          <button onClick={() => setActivePage("games")}>Games</button>
          <button onClick={() => setActivePage("progress")}>Progress</button>

          {user.role === "admin" && (
            <button onClick={() => setActivePage("admin")}>Admin</button>
          )}

          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      {/* PAGES */}
      {activePage === "home" && (
        <section>
          <h2>Welcome, {user.username} 👋</h2>
          <p>Your wellness dashboard</p>
        </section>
      )}

      {activePage === "quiz" && <Quiz />}
      {activePage === "games" && <GamesPlaceholder />}
      {activePage === "progress" && <ProgressChart />}

      {activePage === "admin" && user.role === "admin" && <AdminPanel />}
    </div>
  );
}

export default App;
