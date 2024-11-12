const validateCreatePostData = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Title is required",
    });
  } else if (typeof req.body.title !== "string") {
    return res.status(400).json({
      message: "Title must be a string",
    });
  }

  if (!req.body.image) {
    return res.status(400).json({
      message: "Image is required",
    });
  } else if (typeof req.body.image !== "string") {
    return res.status(400).json({
      message: "Image must be a string",
    });
  }

  if (!req.body.category) {
    return res.status(400).json({
      message: "Category is required",
    });
  } else if (typeof req.body.category !== "number") {
    return res.status(400).json({
      message: "Category must be a string",
    });
  }

  if (!req.body.description) {
    return res.status(400).json({
      message: "Description is required",
    });
  } else if (typeof req.body.description !== "string") {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  if (!req.body.content) {
    return res.status(400).json({
      message: "Content is required",
    });
  } else if (typeof req.body.content !== "string") {
    return res.status(400).json({
      message: "Content must be a string",
    });
  }

  if (!req.body.status) {
    return res.status(400).json({
      message: "Status is required",
    });
  } else if (typeof req.body.status !== "string") {
    return res.status(400).json({
      message: "Status must be a string",
    });
  }

  next();
};

export default validateCreatePostData;
