import { Router } from "express";
import { userController } from "../controller";
import { auth, validation } from "../middlewares";
import { param,body } from "express-validator";
import validate from "../middlewares/validate";



const router = Router();

// router.get("/kakao/login", userController.kakaoLogin_getAuthorizedCode)
// router.get("/kakao/token", userController.kakaoLogin_getToken)

router.post("/kakao/login", userController.kakaoLogin)


router.get("/:userId",
    auth,
    userController.getUserById
);

router.post("/token/refresh", userController.refreshToken)

router.post("/logout", userController.serviceLogout)

export default router;