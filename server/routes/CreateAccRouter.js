import Router from "express";
import CreateAccController from "../controllers/CreateAccController.js";

const CreateAccRouter = Router();

CreateAccRouter.post("/", (req, res) => {
    CreateAccController(req, res).then((result) => {
        console.log("ROUTER: ", result);
        res.send(result);
    });
});

export default CreateAccRouter;