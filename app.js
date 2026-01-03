//import './config/loadEnv.js';
import express from "express";
import morgan from "morgan";
import cors from "cors";
//import path from "path";

import connectToDB from "./config/db.js";

import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";
import reportRouter from "./routes/report.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";
import multerErrorMiddleware from "./middleware/multer.error.middleware.js";
import { PORT } from "./config/env.js";

const app = express();


//***************************************
// =======================================
// 2. Built-in Middlewares
// =======================================
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// =======================================
// 3. Developer Middlewares
// =======================================
app.use(morgan("dev"));   // Log requests
app.use(cors());          // Allow frontend access

// =======================================
// 4. API Routes
// =======================================
app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/post", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/reports", reportRouter);

// =======================================
// 5. Error Handler (must be last)
// =======================================
app.use(errorMiddleware);
app.use(multerErrorMiddleware);

// =======================================
// 6. Root Welcome Route
// =======================================
app.get("/", (req, res) => {
  res.send("Welcome To My First Room Finder API");
});

// =======================================
// 7. Start Server + Connect DB
// =======================================
app.listen(PORT, async () => {
  console.log(`Server is running on PORT ${PORT}`);
  await connectToDB();
});
