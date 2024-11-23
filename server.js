const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS for frontend access
app.use(cors(
{
  origin: "[https://ird-task-edx1-gk3djcgbz-md-kamranul-islams-projects.vercel.app/]",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}
));
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./dua_main.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Dua API!");
});

// Get all categories
app.get("/category", (req, res) => {
  const query = "SELECT * FROM category";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get sub_category by category ID
app.get("/sub_category/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const query = "SELECT * FROM sub_category WHERE cat_id = ?";
  db.all(query, [categoryId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get dua by sub_category ID
app.get("/dua/:sub_categoryId", (req, res) => {
  const { sub_categoryId } = req.params;
  const query = `
    SELECT * FROM dua 
    WHERE subcat_id = ?`;

  db.all(query, [sub_categoryId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Check if there are any results
      if (rows.length === 0) {
        res
          .status(404)
          .json({ message: "No duas found for this sub-category" });
      } else {
        res.json(rows);
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Close database connection when the app exits
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing the database connection:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});
