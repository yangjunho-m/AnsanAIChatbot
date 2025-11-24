import 'dotenv/config';

import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 시스템 프롬프트
const systemInstruction = 
  "당신은 안산대학교의 비공식 챗봇 '산이'입니다. 모든 답변은 한국어로 1~3문장으로 간결하게 답변하세요.";


// chat API
app.post("/chat", async (req, res) => {
    try {
        const { userInput, currentTopic } = req.body;
        
        if (!userInput) {
            return res.status(400).json({ error: "userInput이 필요합니다." });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const parts = [{ text: systemInstruction }];

        if (currentTopic) {
          parts.push({ text: `[현재 대화 주제: ${currentTopic}]` });
        }

        parts.push({ text: userInput });

        const result = await model.generateContent(parts);
        const answer = result.response.text();

        res.json({  answer: answer || "응답을 받지 못했습니다." });

    } 
    catch (error) {
        console.error("Gemini API 오류:", error.message || error); 
        res.status(500).json({ error: "AI 서버 처리 중 오류 발생. 터미널 로그를 확인하세요." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});