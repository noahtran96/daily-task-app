import express, { type Request, type Response } from "express";
import cors from "cors";
import prisma from "./prisma.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.listen(PORT, () => {
  console.log(
    `TypeScript Backend Server is running at: http://localhost:${PORT}`,
  );
});
