import express from "express";
import cors from "cors";
import IndexPageRouter from "./routes/IndexPageRouter.js";
import CreateAccRouter from "./routes/CreateAccRouter.js";
import LogInRouter from "./routes/LogInRouter.js";
import RefreshRouter from "./routes/RefreshRouter.js";
import LogoUploadRouter from "./routes/LogoUploadRouter.js";
import LogOutRouter from "./routes/LogOutRouter.js";
import verifyJWT from "./middleware/verifyJWT.js";
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.urlencoded({ extended: true })); // encodes req.body into obj
app.use(cookieParser()); // middleware for cookies

const corsOptions = {origin: ["http://localhost:5173"], credentials: true};
app.use(cors(corsOptions));

app.use('/', IndexPageRouter);
app.use('/create_account', CreateAccRouter);
app.use('/login', LogInRouter);
app.use('/refresh', RefreshRouter);
app.use('/logout', LogOutRouter);

app.use(verifyJWT);

app.use('/logo_upload', LogoUploadRouter);



const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(`Listening on port ${PORT}!`);
});