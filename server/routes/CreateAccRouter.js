import Router from "express";
import createAccController from "../controllers/createAccController.js";

const CreateAccRouter = Router();

CreateAccRouter.post("/", (req, res) => {
    createAccController(req, res).then((result) => {
        console.log("ROUTER: ", result);
        res.send(result);
    });
});

export default CreateAccRouter;