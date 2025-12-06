import express from "express";
import cors from "cors";
import indexPageRouter from "./routes/indexPageRouter.js";

const app = express();
app.use(express.urlencoded({ extended: true })); // encodes req.body into obj

app.use(cors({origin: ["http://localhost:5173/"]}));

app.use('/', indexPageRouter);

const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(`Listening on port ${PORT}!`);
});