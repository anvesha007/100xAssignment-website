import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import TopicCard from "./components/TopicCard";

import logo from "./assets/logo.png";

const BASE_URL = "http://localhost:3000";

function App() {
  const [topics, setTopics] = useState([]);
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch all topics
  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/100xassignments`);
      setTopics(res.data.upload.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Add topic
  const handleAdd = async () => {
    try {
      await axios.post(
        `${BASE_URL}/100xassignments`,
        { text, link },
        { headers: { password } }
      );

      setText("");
      setLink("");
      fetchTopics();
    } catch (err) {
      alert("Wrong Password or empty field");
    }
  };

  // Delete topic
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/100xassignments/${id}`, {
        headers: { password },
      });

      fetchTopics();
    } catch (err) {
      alert("Unauthorized");
    }
  };

  // Simple admin mode check
  const handleLogin = async () => {
  if (!password) {
    alert("Enter password");
    return;
  }

  try {
    // Call protected route with fake ID (won’t delete anything)
    await axios.delete(`${BASE_URL}/100xassignments/test-id`, {
      headers: { password },
    });

    // If password correct
    setIsAdmin(true);

  } catch (err) {
    // If password wrong (400 from verifyAdmin)
    if (err.response?.data?.message === "Unauthorized" ||
        err.response?.data?.message === "password required") {
      alert("Wrong password");
      setIsAdmin(false);
    } else {
      // If error is something else (like invalid ID)
      setIsAdmin(true);
    }
  }
};

  return (
    <div className="container">
      
      {/* LEFT SIDE */}
      <div className="left">
        <img src={logo} alt="100xlogo" />
        <div className="infoCard">
          <p>All assignments</p>
          <p>organized in one place.</p>

          <br />

          <p>Built for</p>
          <p>consistency & clarity.</p>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="middle">
        <h2>100xAssignments</h2>

        <div className="topicList">
          {topics.map((topic) => (
            <TopicCard
              key={topic._id}
              topic={topic}
              isAdmin={isAdmin}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">

        {/* Password Box */}
        <div className="box">
          <h3>Teacher Login</h3>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>

        {isAdmin && (
          <>
            {/* Link Box */}
            <div className="box">
              <h3>Paste Notion Link</h3>
              <input
                type="text"
                placeholder="Enter Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            {/* Topic Name Box */}
            <div className="box">
              <h3>Topic Name</h3>
              <input
                type="text"
                placeholder="Enter Topic Name"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={handleAdd}>Add Topic</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;