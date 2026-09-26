import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "TypeScript Backend is working!" });
});

app.listen(PORT, () => {
  console.log(
    `TypeScript Backend Server is running at: http://localhost:${PORT}`,
  );
});


