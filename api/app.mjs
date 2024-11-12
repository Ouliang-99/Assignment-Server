import express from "express";
import cors from "cors";
import postRouter from "../routes/posts.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/posts", postRouter);

app.listen(port, (error) => {
  if (error) {
    console.error("Server failed to start:", error);
  } else {
    console.log(`Server is running at ${port}`);
  }
});
