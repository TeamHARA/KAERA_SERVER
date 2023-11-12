import { Router } from "express";
import { auth, validation } from "../middlewares";
import { param,body } from "express-validator";
import validate from "../middlewares/validate";
import { authController,tokenController } from "../controller";


const router = Router();


router.get("/kakao/authorize", authController.kakaoLogin_getAuthorizedCode)
router.get("/kakao/token", authController.kakaoLogin_getToken)

router.post(
    "/kakao/login",
    [
        body('accessToken').notEmpty().withMessage("body 에 'accessToken' 값이 존재하지 않습니다"),
    ],
    validate,
    authController.kakaoLogin
)

router.post("/apple/login",
    [
        body('identityToken').notEmpty().withMessage("body 에 'identityToken' 값이 존재하지 않습니다"),
        body('user').notEmpty().withMessage("body 에 'user' 값이 존재하지 않습니다"),

    ],
    validate,
    authController.appleLogin
)

router.post("/logout",
    auth,
    authController.serviceLogout
)

router.post("/unregister",
 
    authController.serviceUnregister
)

router.post("/token/refresh",
    [
        body('accessToken').notEmpty().withMessage("body 에 'accessToken' 값이 존재하지 않습니다"),
        body('refreshToken').notEmpty().withMessage("body 에 'refreshToken' 값이 존재하지 않습니다")
    ],
    validate,
    tokenController.refreshToken
)

export default router;