import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/profiles", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Profile retrieved successfully",
    data: {
      name: "john",
      age: 20,
    },
  });
});

export default app;
