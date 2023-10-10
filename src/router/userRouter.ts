import { Router } from "express";
import { userController } from "../controller";
import { auth, validation } from "../middlewares";
import { param,body } from "express-validator";
import validate from "../middlewares/validate";


const router = Router();


router.get("/:userId",
    auth,
    userController.getUserById
);





export default router;