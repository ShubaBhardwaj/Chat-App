import express from "express";
import { closeDb } from "./lib/db.js";

import './lib/db.js';

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let shuttingDown = false;

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  server.close((error) => {
    try {
      closeDb();
      console.log("Database connection closed.");
    } catch (dbError) {
      console.error(dbError);
      process.exitCode = 1;
    }

    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", shutdown);  // Usually Ctrl+C.
process.on("SIGTERM", shutdown); // A request to stop the app.