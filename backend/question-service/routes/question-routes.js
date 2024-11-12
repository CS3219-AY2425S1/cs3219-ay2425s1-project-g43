import express from "express";
import { createQuestion, findAllQuestions,  findQuestionById, findQuestionByComplexity, updateQuestionById, deleteQuestionById, findRandomQuestionByCategoryAndComplexity } from "../controller/question-controller.js";
import {verifyAccessToken} from "../middleware/basic-access-control.js";
const router = express.Router();

router.get("/", verifyAccessToken,findAllQuestions);
router.get("/:id", verifyAccessToken, findQuestionById);
router.get("/complexity/:complexity", verifyAccessToken, findQuestionByComplexity);
router.post("/", verifyAccessToken, createQuestion);
router.put("/:id", verifyAccessToken, updateQuestionById);
router.delete("/:id", verifyAccessToken, deleteQuestionById);
router.get("/:category/:complexity", verifyAccessToken, findRandomQuestionByCategoryAndComplexity);

export default router;