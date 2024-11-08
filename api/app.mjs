import express from "express";
import { pool } from "../utils/db.mjs";
import cors from "cors"

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post("/posts", async (req, res) => {
  const { title, image, description, content, status_id } = req.body;

  if (!title || !image || !description || !content || !status_id) {
    return res.status(400).json({
      message:
        "Server could not create post because there are missing data from client",
    });
  }

  try {
    const newPosts = {
      ...req.body,
    };

    await pool.query(
      `insert into posts ( title, image, description, content, status_id)
	    values ($1, $2, $3, $4, $5)`,
      [
        newPosts.title,
        newPosts.image,
        newPosts.description,
        newPosts.content,
        newPosts.status_id,
      ]
    );

    return res.status(201).json({
      message: "Created post sucessfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
