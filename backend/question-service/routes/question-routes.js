import express from "express";
import { createQuestion, findAllQuestions,  findQuestionById, findQuestionByComplexity, updateQuestionById, deleteQuestionById } from "../controller/question-controller.js";
const router = express.Router();

router.get("/", findAllQuestions);
router.get("/:id", findQuestionById);
router.get("/complexity/:complexity", findQuestionByComplexity);
router.post("/", createQuestion);
router.put("/:id", updateQuestionById);
router.delete("/:id", deleteQuestionById);

export default router;