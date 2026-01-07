import express from "express";
import cors from "cors";
import ListVenuesRouter from "./routes/ListVenuesRouter.js";
import CreateAccRouter from "./routes/CreateAccRouter.js";
import SignInRouter from "./routes/SignInRouter.js";
import RefreshRouter from "./routes/RefreshRouter.js";
import LogoutRouter from "./routes/LogoutRouter.js";
import verifyJWT from "./middleware/verifyJWT.js";
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.urlencoded({ extended: true })); // encodes req.body into obj

app.use(cookieParser()); // middleware for cookies

const corsOptions = {origin: ["http://localhost:5173"], credentials: true};
app.use(cors(corsOptions));

app.use('/', ListVenuesRouter);
app.use('/create_account', CreateAccRouter);
app.use('/sign_in', SignInRouter);
app.use('/refresh', RefreshRouter);
app.use('/logout', LogoutRouter);

app.use(verifyJWT);

const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(`Listening on port ${PORT}!`);
});