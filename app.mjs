import express from "express";

const app = express();
const port = process.env.PORT || 4001;

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

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
