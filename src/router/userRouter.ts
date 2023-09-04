import { Router } from "express";
import { userController } from "../controller";
import { auth, validation } from "../middlewares";
import { param,body } from "express-validator";
import validate from "../middlewares/validate";



const router = Router();

// router.get("/kakao/login", userController.kakaoLogin_getAuthorizedCode)
// router.get("/kakao/token", userController.kakaoLogin_getToken)

router.get("/kakao/login", userController.kakaoLogin)


router.get("/:userId",
    auth,
    userController.getUserById
);

router.post("/",
    [
        body('name').notEmpty().withMessage("body 에 name 값이 존재하지 않습니다"),
        // body('age').notEmpty(),
        body('email').notEmpty().withMessage("body 에 email 값이 존재하지 않습니다"),
    ],
    validate,
    userController.createUser);

export default router;