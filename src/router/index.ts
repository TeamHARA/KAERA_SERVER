import { Router } from "express";
import userRouter from './userRouter';
import templateRouter from "./templateRouter";

const router: Router = Router();

router.use("/user", userRouter);

/**
 * @swagger
 *  /template:
 *    get:
 *      tags:
 *      - product
 *      description: 모든 제품 조회
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: category
 *          required: false
 *          schema:
 *            type: integer
 *            description: 카테고리
 *      responses:
 *       200:
 *        description: 제품 조회 성공
 *        schema:
 *          $ref: '#/components/schemas/Template'
 */
router.use("/template",templateRouter);

export default router;
