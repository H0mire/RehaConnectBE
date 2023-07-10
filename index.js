import "./configureEnv.js";
import './db/conn.js';
import express from "express";
import cors from "cors";
import "express-async-errors";
import users from "./routes/users.js";
import trainings from "./routes/trainings.js";
import auth from "./auth/authService.js";

const PORT = process.env.PORT || 3000;
const DEV = process.env.DEV || false;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth/",auth);
//app.use("/app",auth.authenticateToken)
// Load the routes
app.use("/app/users", users);
app.use("/app/trainings", trainings);


// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
