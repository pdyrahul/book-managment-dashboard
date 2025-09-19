import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "AIzaSyD2YOCBQ23e6Z5ET9K4pl7kblxWqJ14pQc"
});

async function fetchBookSummary(title, language) {
    const prompt = `Give a concise summary (100 words) of the book "${title}" . Focus on main plot and theme only and use simple words in ${language} Language.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
}

export  default fetchBookSummary;