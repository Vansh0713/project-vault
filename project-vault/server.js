const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const users = JSON.parse(fs.readFileSync("users.json"));
const fileRoutes = require("./routes/fileRoutes");

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.use("/api", fileRoutes);
app.get("/", (req, res) => {
  res.send("✅ Project Vault API is running!");
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
