import express from "express";
// import cors from "cors";

const app = express();

const STUB_PORT = Number(process.env.STUB_PORT ?? 3001);

// app.use(cors()).use(express.json()).use(getRandomFilm);

app.listen(STUB_PORT, () => {
  console.log(`Stub server running on http://localhost:${STUB_PORT}`);
});
