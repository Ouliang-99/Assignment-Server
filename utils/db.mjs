import * as pg from "pg";
const { Pool } = pg.default;

const pool = new Pool({
  connectionString: "postgresql://postgres:br422416@localhost:5432/blog-post",
});

export { pool };
