import { Router } from "express";
import { pool } from "../utils/db.mjs";
import validateCreatePostData from "../middlewares/post.validation.mjs";

const postRouter = Router();

postRouter.post("/", [validateCreatePostData], async (req, res) => {
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
      "INSERT INTO posts (title, image, description, content, status_id) VALUES ($1, $2, $3, $4, $5)",
      [
        newPosts.title,
        newPosts.image,
        newPosts.description,
        newPosts.content,
        newPosts.status_id,
      ]
    );

    return res.status(201).json({
      message: "Created post successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

postRouter.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const postResult = await pool.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(postResult.rows[0]);
  } catch (e) {
    res.status(500).json({
      message: "Server could not read post due to a database connection issue",
    });
  }
});

postRouter.put("/:postId", [validateCreatePostData], async (req, res) => {
  const { title, image, description, content, status_id, category_id } =
    req.body;
  const postIdFromClient = req.params.postId;

  if (
    !title ||
    !image ||
    !description ||
    !content ||
    !status_id ||
    !category_id
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required for updating the post" });
  }

  try {
    const updatedPost = { ...req.body };

    const result = await pool.query(
      "UPDATE posts SET title = $2, image = $3, category_id = $4, description = $5, content = $6, status_id = $7 WHERE id = $1",
      [
        postIdFromClient,
        updatedPost.title,
        updatedPost.image,
        updatedPost.category_id,
        updatedPost.description,
        updatedPost.content,
        updatedPost.status_id,
      ]
    );

    return res.status(200).json({ message: "Updated post successfully" });
  } catch (e) {
    console.error("Database error:", e);
    res.status(500).json({
      message:
        "Server could not update post because of a database connection issue",
    });
  }
});

postRouter.delete("/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1", [
      postId,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post to delete" });
    }

    return res.status(200).json({ message: "Deleted post successfully" });
  } catch (e) {
    res.status(500).json({
      message:
        "Server could not delete post because of a database connection issue",
    });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const category = req.query.category ? req.query.category.trim() : null;
    const keywords = req.query.keywords ? req.query.keywords.trim() : null;
    let page = parseInt(req.query.page) || 1;
    let PAGE_SIZE = parseInt(req.query.limit) || 6;

    const offset = (page - 1) * PAGE_SIZE;

    let query = "SELECT * FROM posts";
    let values = [];

    if (keywords && category) {
      query +=
        " WHERE category_id = $1 AND (title ILIKE $2 OR description ILIKE $2 OR content ILIKE $2) LIMIT $3 OFFSET $4";
      values = [category, `%${keywords}%`, PAGE_SIZE, offset];
    } else if (keywords) {
      query +=
        " WHERE (title ILIKE $1 OR description ILIKE $1 OR content ILIKE $1) LIMIT $2 OFFSET $3";
      values = [`%${keywords}%`, PAGE_SIZE, offset];
    } else if (category) {
      query += " WHERE category_id = $1 LIMIT $2 OFFSET $3";
      values = [category, PAGE_SIZE, offset];
    } else {
      query += " LIMIT $1 OFFSET $2";
      values = [PAGE_SIZE, offset];
    }

    const postResult = await pool.query(query, values);

    const totalPages = Math.ceil(postResult.rows.length / PAGE_SIZE);

    const nextPage = page < totalPages ? page + 1 : null;

    return res.json({
      totalPosts: postResult.rows.length,
      totalPages: totalPages,
      currentPage: page,
      limit: PAGE_SIZE,
      posts: postResult.rows,
      nextPage: nextPage,
    });
  } catch (e) {
    return res.json({
      message: "Server could not read post because database connection",
    });
  }
});

export default postRouter;
