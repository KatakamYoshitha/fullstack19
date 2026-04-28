import React, { useState, useEffect } from "react";
import { FaHeartbeat, FaBookOpen, FaBrain, FaRobot, FaSignOutAlt } from "react-icons/fa";
import "./index.css";
import img from "./assets/img.jpg";
import MazeGame from "./MazeGame";
import DinoGame from "./DinoGame";
import TicTacToe from "./TicTacToe";


function App() {
  /* -------------------- STATES -------------------- */
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const [activeSection, setActiveSection] = useState(currentUser ? "home" : "login");
  const [isSignup, setIsSignup] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [resources, setResources] = useState([
    {
      title: "Mindful Breathing",
      category: "Mental Health",
      description: "Deep breathing to reduce anxiety and calm your mind."
    },
    {
      title: "Healthy Eating",
      category: "Nutrition",
      description: "Learn the basics of a healthy diet and energy-boosting foods."
    },
    {
      title: "Meditation Basics",
      category: "Mindfulness",
      description: "A simple guide to starting meditation."
    }
  ]);

  const [programs, setPrograms] = useState([
    {
      name: "Mindful Breathing Workshop",
      start: "2025-11-10",
      description: "Learn grounding and deep breathing techniques."
    },
    {
      name: "Yoga for Mental Clarity",
      start: "2025-11-15",
      description: "Gentle yoga to reduce anxiety and increase focus."
    },
    {
      name: "Nutrition for Brain Health",
      start: "2025-11-20",
      description: "Understand how food influences mood and energy."
    },
    {
      name: "Overcoming Exam Stress",
      start: "2025-12-01",
      description: "Improve emotional resilience before exams."
    }
  ]);
   const checkPasswordStrength = (password) => {
  if (password.length < 6) {
    setPasswordStrength("Weak");
  } else if (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  ) {
    setPasswordStrength("Strong");
  } else {
    setPasswordStrength("Medium");
  }
};
  const [articles, setArticles] = useState([
    {
      title: "How to Reduce Exam Stress",
      content: "Simple techniques to manage pressure and stay calm.",
      link: "https://www.ucl.ac.uk/news/2017/apr/7-tips-help-you-cope-exam-stress"
    },
    {
      title: "Improve Your Sleep Naturally",
      content: "Sleep cycles, habits, and science-backed tips.",
      link: "https://www.sleepfoundation.org/sleep-hygiene"
    },
    {
      title: "Benefits of Meditation",
      content: "How meditation improves your mind and body.",
      link: "https://www.mindful.org/meditation/mindfulness-getting-started/"
    },
    {
      title: "Healthy Eating for Students",
      content: "Nutrition tips for focus, energy, and mood.",
      link: "https://www.nhs.uk/live-well/eat-well/food-and-drinks-for-studying/"
    }
  ]);

  // Feedbacks stored locally (for admin panel)
  const [feedbacks, setFeedbacks] = useState([]);

  const [dummySupportCount, setDummySupportCount] = useState(0); // only for metrics count

  const updateFeedbacks = (list) => {
    setFeedbacks(list);
  };
   
  /* -------------------- CHATBOT SCRIPT -------------------- */
  useEffect(() => {
  if (activeSection === "chat") {

    const container = document.getElementById("noupe-chat-container");
    if (!container) return;

    const existing = document.getElementById("noupe-script");
    if (existing) return;

    // Tell Noupe to render inside this container
    window.noupeConfig = {
      target: "#noupe-chat-container"
    };

    const script = document.createElement("script");
    script.src = "https://www.noupe.com/embed/019acec8c5da71fbb53af7c328bce7e1135e.js";
    script.id = "noupe-script";
    script.async = true;

    document.body.appendChild(script);
  }
}, [activeSection]);
useEffect(() => {
  fetch("https://fullstack19-springboot-backend-production-7383.up.railway.app/api/articles")
    .then(res => res.json())
    .then(data => setArticles(data));
}, []);
useEffect(() => {
  fetch("https://fullstack19-springboot-backend-production-7383.up.railway.app/api/programs")
    .then(res => res.json())
    .then(data => setPrograms(data));
}, []);
  /* -------------------- SIGNUP -------------------- */
  /* -------------------- SIGNUP -------------------- */
  /* -------------------- SIGNUP -------------------- */
const handleSignup = async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;
  const role = "student";

  await fetch("https://fullstack19-springboot-backend-production-7383.up.railway.app/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      email: username + "@gmail.com",
      password
    })
  });

  alert("Account created! Please login.");
  setIsSignup(false);
};
/* -------------------- SIGNUP -------------------- */
const handleLogin = async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  // Admin login
  if (username === "admin" && password === "admin123") {
    const adminUser = {
      username: "admin",
      role: "admin",
      joinedPrograms: []
    };

    setCurrentUser(adminUser);
    localStorage.setItem("currentUser", JSON.stringify(adminUser));
    setActiveSection("home");
    return;
  }

  // Student login
  const res = await fetch(
  "https://fullstack19-springboot-backend-production-7383.up.railway.app/api/auth/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  }
);

const result = await res.text();

if (result !== "Login successful") {
  alert("Incorrect username or password!");
  return;
}

  const studentUser = {
    ...foundUser,
    role: "student",
    joinedPrograms: []
  };

  setCurrentUser(studentUser);
  localStorage.setItem("currentUser", JSON.stringify(studentUser));
  setActiveSection("home");
};

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setActiveSection("login");
  };

  /* -------------------- PROGRAMS -------------------- */
  const joinProgram = (index) => {
    const prog = programs[index];

    if (!currentUser.joinedPrograms.some((p) => p.name === prog.name)) {
      const updatedUser = {
        ...currentUser,
        joinedPrograms: [...currentUser.joinedPrograms, { ...prog, completed: false }]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const completeProgram = (name) => {
    const updatedUser = {
      ...currentUser,
      joinedPrograms: currentUser.joinedPrograms.map((p) =>
        p.name === name ? { ...p, completed: true } : p
      )
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  /* -------------------- SUPPORT (STUDENT) -------------------- */
 const handleSupport = async (e) => {
  e.preventDefault();

  const msg = e.target.supportMessage.value;

  try {
    const res = await fetch(
      "https://fullstack19-springboot-backend-production-7383.up.railway.app/api/feedback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: currentUser.username,
          message: msg,
          status: "pending",
          reply: ""
        })
      }
    );

    if (!res.ok) {
      throw new Error("Failed");
    }

    const data = await res.json();

    setFeedbacks([...feedbacks, data]);

    alert("Feedback submitted successfully!");
    e.target.reset();
  } catch (err) {
    console.error(err);
    alert("Error submitting feedback");
  }
};
  /* -------------------- ADMIN ADDING -------------------- */
  const addResource = (e) => {
    e.preventDefault();
    const newRes = {
      title: e.target.resourceTitle.value,
      category: e.target.resourceCategory.value,
      description: e.target.resourceDesc.value
    };
    setResources([...resources, newRes]);
    e.target.reset();
  };
useEffect(() => {
  fetch("https://fullstack19-springboot-backend-production-7383.up.railway.app/api/feedback")
    .then(res => res.json())
    .then(data => setFeedbacks(data));
}, []);
  const addProgram = (e) => {
  e.preventDefault();
  const newProg = {
    name: e.target.programName.value,
    start: e.target.startDate.value,
    description: e.target.programDesc.value
  };
  setPrograms([...programs, newProg]);
  e.target.reset();
};

const addArticle = async (e) => {
  e.preventDefault();

  const article = {
    title: e.target.articleTitle.value,
    content: e.target.articleContent.value,
    link: e.target.articleLink.value
  };

  try {
    const res = await fetch(
      "https://fullstack19-springboot-backend-production-7383.up.railway.app/api/articles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(article)
      }
    );

    if (!res.ok) throw new Error("Failed");

    const saved = await res.json();

    setArticles([...articles, saved]);

    alert("Article published!");
    e.target.reset();
  } catch (err) {
    console.error(err);
    alert("Error publishing article");
  }
};
const deleteArticle = async (id) => {
  try {
    const res = await fetch(
      `https://fullstack19-springboot-backend-production-7383.up.railway.app/api/articles/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) throw new Error("Delete failed");

    setArticles(articles.filter(a => a.id !== id));

    alert("Article deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Error deleting article");
  }
};
const deleteFeedback = async (id) => {
  try {
    const res = await fetch(
      `https://fullstack19-springboot-backend-production-7383.up.railway.app/api/feedback/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) throw new Error("Delete failed");

    setFeedbacks(feedbacks.filter(f => f.id !== id));

    alert("Feedback deleted!");
  } catch (err) {
    console.error(err);
    alert("Error deleting feedback");
  }
};
  /* -------------------- UI -------------------- */
  return (
    <div>
      {/* HEADER */}
      <header>
        <h1>
          <FaHeartbeat /> Mental Vision <FaBrain />
        </h1>

        {currentUser && (
          <nav>
            <button onClick={() => setActiveSection("home")}>Home</button>
            <button onClick={() => setActiveSection("sessions")}>Sessions</button>
            <button onClick={() => setActiveSection("articles")}>Articles</button>

            {/* STUDENT ONLY NAV */}
            {currentUser.role === "student" && (
              <>
                <button onClick={() => setActiveSection("progress")}>Progress</button>
                <button onClick={() => setActiveSection("support")}>Support</button>
                <button onClick={() => setActiveSection("chat")}>Chat AI</button>
                <button onClick={() => setActiveSection("games")}>Stress Free Games</button>
                {/* <button onClick={() => setActiveSection("quiz")}>Wellness Quiz</button> */}
              </>
            )}
     
            {/* ADMIN ONLY NAV */}
            {currentUser.role === "admin" && (
              <>
                <button onClick={() => setActiveSection("admin")}>Admin</button>
                <button onClick={() => setActiveSection("feedbacks")}>Feedbacks</button>
              </>
            )}

            <button onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        )}
      </header>

      {/* LOGIN + SIGNUP */}
      {!currentUser && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-left">
              <img src={img} alt="Wellness" />
            </div>

            <div className="auth-right">
              <h2 className="auth-title">{isSignup ? "Create Account ✨" : "Login"}</h2>

              <form onSubmit={isSignup ? handleSignup : handleLogin} className="auth-form">
                <label>Username</label>
                <input name="username" type="text" required />

                <label>Password</label>
                <input
  name="password"
  type="password"
  required
  onChange={(e) => checkPasswordStrength(e.target.value)}
/>
<p className="password-strength">
  Password strength: {passwordStrength}
</p>

                {isSignup && (
                  <>
                    <label>Role</label>
                    <select name="role">
  <option value="student">Student</option>
</select>
                  </>
                )}

                <button className="auth-btn" type="submit">
                  {isSignup ? "Create Account" : "Log In"}
                </button>
              </form>

              <p className="switch-text">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <span className="switch-link" onClick={() => setIsSignup(false)}>
                      Login
                    </span>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <span className="switch-link" onClick={() => setIsSignup(true)}>
                      Sign Up
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HOME */}
      {currentUser && activeSection === "home" && (
        <section>
          <h2 className="welcome-text">Welcome, {currentUser.username}! 🌼</h2>
          <h3 className="feature-title">Featured Resources</h3>

          {resources.map((r, i) => (
            <div key={i} className="card">
              <h4>{r.title}</h4>
              <p>
                <b>{r.category}</b> — {r.description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* SESSIONS */}
      {currentUser && activeSection === "sessions" && (
        <section>
          <h2 className="page-title">Sessions 💡</h2>

          {programs.map((p, i) => (
            <div key={i} className="card">
              <h4>{p.name}</h4>
              <p>Date: {p.start}</p>
              <p>{p.description}</p>

              {currentUser.role === "student" && (
                <button onClick={() => joinProgram(i)}>Join</button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ARTICLES */}
      {currentUser && activeSection === "articles" && (
  <section>
    <h2 className="page-title">
      <FaBookOpen /> Wellness Articles
    </h2>

    {articles.map((a, i) => (
      <div key={i} className="card">
        <h3>{a.title}</h3>
        <p>{a.content}</p>

        {currentUser.role === "admin" && (
  <button
    className="danger-btn"
    onClick={() => deleteArticle(a.id)}
  >
    Delete ❌
  </button>
)}

        <button
          onClick={() => window.open(a.link, "_blank")}
          className="read-btn"
        >
          Read Article
        </button>
      </div>
    ))}
  </section>
)}

      {/* PROGRESS (STUDENT ONLY) */}
      {currentUser && currentUser.role === "student" && activeSection === "progress" && (
        <section>
          <h2 className="page-title">My Progress 🌟</h2>

          {currentUser.joinedPrograms.length === 0 && <p>No sessions joined yet.</p>}

          {currentUser.joinedPrograms.map((p, i) => (
            <div key={i} className="card">
              <h4>{p.name}</h4>
              <p>Status: {p.completed ? "Completed ✔️" : "In Progress ⏳"}</p>

              {!p.completed && (
                <button onClick={() => completeProgram(p.name)}>Mark Completed</button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* GAMES MENU */}
      {currentUser && currentUser.role === "student" && activeSection === "games" && (
        <section className="games-menu">
          <h2>🎮 Stress-Free Games</h2>
          <p>Games Coming soon!!</p>
          <br />
          
          <button onClick={() => setActiveSection("maze")}>🧩 Maze Game</button>
          <br />
          <br />
          <button onClick={() => setActiveSection("dino")}>🦖 Dino Runner</button>
          <br />
          <br />
          <button onClick={() => setActiveSection("tictactoe")}>
            ⭕ Tic Tac Toe ❌
          </button>
        </section>
      )}

      {/* DINO GAME */}
      {currentUser && currentUser.role === "student" && activeSection === "dino" && (
        <section>
          <DinoGame />
        </section>
      )}

      {/* TIC TAC TOE */}
      {currentUser && currentUser.role === "student" && activeSection === "tictactoe" && (
        <section>
          <TicTacToe />
        </section>
      )}

      {/* MAZE GAME */}
      {currentUser && currentUser.role === "student" && activeSection === "maze" && (
        <section className="maze-section">
          <h2>🧩 Relaxing Maze Game</h2>
          <p>Use arrow keys ↑ ↓ ← → to move the ball and reach the goal!</p>
          <MazeGame />
        </section>
      )}

      {/* SUPPORT (STUDENT) */}
      {currentUser && currentUser.role === "student" && activeSection === "support" && (
        <section>
          <h2 className="page-title">Support 💌</h2>

          <form onSubmit={handleSupport}>
            <textarea
              name="supportMessage"
              required
              placeholder="Describe your concern..."
            />
            <button type="submit" style={{cursor:"pointer"}}>
  Submit
</button>
          </form>
        </section>
      )}

      {/* CHAT AI (STUDENT) */}
      {/* CHAT AI (STUDENT) */}
{currentUser && currentUser.role === "student" && activeSection === "chat" && (
  <section className="chat-ai-container">
  <div className="chat-ai-hero">
    <h2>
      <FaRobot /> Wellness AI Companion
    </h2>
    <p>Your personal mental wellness assistant 🤖💚</p>
  </div>

  <div id="noupe-chat-container"></div>
</section>
)}

      {/* ADMIN FEEDBACKS */}
      {currentUser && currentUser.role === "admin" && activeSection === "feedbacks" && (
        <section>
          <h2 className="page-title">Student Feedbacks 💬</h2>

          {feedbacks.length === 0 && <p>No feedback received yet.</p>}

          {feedbacks.map((req, index) => (
            <div key={index} className="card">
              <p>
                <b>User:</b> {req.username}
              </p>
              <p>
                <b>Message:</b> {req.message}
              </p>
             
              <p>
                <b>Status:</b> {req.status}
              </p>

              <label>Reply:</label>
              <textarea
  value={req.reply || ""}
  onChange={async (e) => {
    const newReply = e.target.value;

    const updated = [...feedbacks];
    updated[index].reply = newReply;
    updateFeedbacks(updated);

    await fetch(`https://fullstack19-springboot-backend-production-7383.up.railway.app/api/feedback/${req.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...req,
        reply: newReply
      })
    });
  }}
/>

              <button
                onClick={() => {
                  const updated = [...feedbacks];
                  updated[index].status = "resolved";
                  updateFeedbacks(updated);
                }}
              >
                Mark Resolved ✔
              </button>

              <button
  className="danger-btn"
  onClick={() => deleteFeedback(req.id)}
>
  Delete ❌
</button>
            </div>
          ))}
        </section>
      )}

      {/* ADMIN PANEL */}
      {currentUser && currentUser.role === "admin" && activeSection === "admin" && (
        <section>
          <h2 className="page-title">Admin Panel 🛠️</h2>

          {/* ADD RESOURCE */}
          <h3 className="feature-title">Add Resource</h3>
          <form onSubmit={addResource}>
            <input name="resourceTitle" placeholder="Resource Title" required />
            <select name="resourceCategory">
              <option value="Mental Health">Mental Health</option>
              <option value="Fitness">Fitness</option>
              <option value="Nutrition">Nutrition</option>
            </select>
            <textarea name="resourceDesc" required placeholder="Description" />
            <button type="submit">Add Resource</button>
          </form>

          {/* ADD SESSION */}
          <h3 className="feature-title">Add Session</h3>
          <form onSubmit={addProgram}>
            <input name="programName" placeholder="Session Name" required />
            <input name="startDate" type="date" required />
            <textarea name="programDesc" required placeholder="Description" />
            <button type="submit">Add Session</button>
          </form>

          {/* ADD ARTICLE */}
          <h3 className="feature-title">Add Article</h3>
          <form onSubmit={addArticle}>
            <input name="articleTitle" placeholder="Article Title" required />
            <textarea
              name="articleContent"
              placeholder="Short Description"
              required
            />
            <input
              name="articleLink"
              placeholder="Article URL (https://...)"
              required
            />
            <button type="submit">Publish Article</button>
          </form>

          {/* METRICS */}
          <h3 className="feature-title">Metrics 📊</h3>
          <div id="metrics">
            <p><b>Total Resources:</b> {resources.length}</p>
            <p><b>Total Sessions:</b> {programs.length}</p>
            <p><b>Total Articles:</b> {articles.length}</p>
            <p><b>Total Feedbacks:</b> {feedbacks.length}</p>
          </div>
        </section>
      )}
      <footer className="app-footer">
  © 2026 Mental Vision – Digital Wellness Platform. All Rights Reserved.
</footer>
    </div>
  );
}

export default App;
