import express, { type Request, type Response } from "express";
import cors from "cors";
import prisma from "./prisma.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET
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

// POST
app.post("api/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      res.status(400).json({ error: "Task title is required" });
      return;
    }

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        isCompleted: false,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PATCH
app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { isCompleted },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.listen(PORT, () => {
  console.log(
    `TypeScript Backend Server is running at: http://localhost:${PORT}`,
  );
});
