import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
    apiKey: "AIzaSyD2YOCBQ23e6Z5ET9K4pl7kblxWqJ14pQc"
});

async function fetchBookSummary(title, language) {
    const prompt = `Give a concise summary (100 words) of the book ${title} . Focus on main plot and theme only and use simple words in ${language} Language.`;
    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
    });
    return response.text;
}
const GOOGLE_BOOKS_KEY = "AIzaSyDHpi2CM5ez8Zb49VWVGX43exNCxJiVEGg";

async function fetchBytitle(title) {

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
    }else{
        return toast("Could not fetch book details", { variant: "warning" });
    }

}



export { fetchBookSummary, fetchBytitle };