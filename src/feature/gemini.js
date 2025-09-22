import { GoogleGenAI } from "@google/genai";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const BOOKS_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

async function fetchBookSummary(title, language) {
    try {
        const ai = new GoogleGenAI({
            apiKey: GEMINI_KEY
        });
        const prompt = `Give a concise summary (100 words) of the book ${title} .
     Focus on main plot and theme only and use simple words in ${language} Language.`;
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.log("Error fetching book summary:", error);
        return "No summary available";
    }
}


async function fetchBytitle(title) {
    const GOOGLE_BOOKS_KEY = BOOKS_KEY;
    try {
        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&key=${GOOGLE_BOOKS_KEY}`
        );
        const data = await res.json();

        if (data?.totalItems && data?.totalItems > 0) {
            const book = data.items[0].volumeInfo;
            return {
                author: book.authors?.[0] || "Unknown",
                genre: book.categories?.[0] || "Unknown",
                publishedYear: book.publishedDate?.slice(0, 4) || "Unknown",
            };
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
    }

}



export { fetchBookSummary, fetchBytitle };