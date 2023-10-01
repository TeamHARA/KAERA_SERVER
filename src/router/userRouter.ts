import { Router } from "express";
import { userController } from "../controller";
import { auth, validation } from "../middlewares";
import { param,body } from "express-validator";
import validate from "../middlewares/validate";



const router = Router();

router.get("/kakao/authorize", userController.kakaoLogin_getAuthorizedCode)
router.get("/kakao/token", userController.kakaoLogin_getToken)

router.post(
    "/kakao/login",
    [
        body('accessToken').notEmpty().withMessage("body 에 'accessToken' 값이 존재하지 않습니다"),
    ],
    validate,
    userController.kakaoLogin
)

router.post("/kakao/logout",
    [
        body('accessToken').notEmpty().withMessage("body 에 'accessToken' 값이 존재하지 않습니다"),
    ],
    validate,
    userController.kakaoLogout
)

router.get("/:userId",
    auth,
    userController.getUserById
);

router.post("/token/refresh",
    [
        body('accessToken').notEmpty().withMessage("body 에 'accessToken' 값이 존재하지 않습니다"),
        body('refreshToken').notEmpty().withMessage("body 에 'refreshToken' 값이 존재하지 않습니다")
    ],
    validate,
    userController.refreshToken
)



export default router;