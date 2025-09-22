# Book Management Dashboard

A modern React + Vite dashboard for managing books, featuring AI-powered summaries, autofill, search, filter, and CRUD operations.

---

## Features

- **Dashboard:**  
  View all books in a paginated, searchable, and filterable table.  
  Filter by genre and status, search by title or author.

- **Add/Edit Book:**  
  Add new books or edit existing ones using a form.  
  Autofill author, genre, and published year using Google Books API or Gemini AI by simply entering the title.

- **AI Summary:**  
  Instantly generate concise book summaries in Hindi or English using Gemini AI.  
  Language selection available in the UI.

- **Delete Book:**  
  Remove books with confirmation dialogs and instant UI updates.

- **Error Handling:**  
  Global error boundary for graceful error recovery.  
  User-friendly notifications via Snackbar.

- **Loading Indicators:**  
  Spinners for async actions and field-level loading for autofill.

---

## Environment Variables Setup

**Important:**  
All API keys and endpoints are managed securely using environment variables in a `.env` file at the project root.

### Example `.env` file

```env
VITE_GEMINI_KEY=your-gemini-api-key
VITE_GOOGLE_BOOKS_KEY=your-google-books-api-key
VITE_API_BASE=https://crudcrud.com/api/your-api-key/books
```

- **VITE_GEMINI_KEY**: Gemini AI API key for book summaries.
- **VITE_GOOGLE_BOOKS_KEY**: Google Books API key for autofill.
- **VITE_API_BASE**: Backend API endpoint for book CRUD operations.

**Notes:**  
- All variable names must start with `VITE_` for Vite to expose them to your app.
- Never commit your `.env` file to version control. Add `.env` to `.gitignore`.
- After changing `.env`, restart the dev server.

---

## How to Run

1. **Create a `.env` file** as shown above.
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Start the development server:**
   ```bash
   yarn dev
   ```
4. **Access the app:**  
   Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Folder Structure

```
src/
  ├── components/         # Reusable UI components (e.g., BookTitleWithSummary)
  ├── feature/            # AI and external API integration (e.g., gemini.js)
  ├── hooks/              # Custom React hooks (e.g., useBooks.jsx)
  ├── pages/              # Main pages (Dashboard, AddEditBook)
  ├── App.jsx             # Main app component with routing and providers
  └── main.css            # Global styles
.env                      # Environment variables (not committed)
```

---

## Security

- API keys are loaded from `.env` and never hardcoded.
- For production, rotate keys regularly and restrict their usage.
- Do not commit `.env` to source control.

---

## Extending & Customizing

- **Add more fields:**  
  Extend the book model and form as needed.
- **Add authentication:**  
  Integrate user login for secure access.
- **Improve accessibility:**  
  Audit and add ARIA labels and semantic HTML.
- **Enhance AI features:**  
  Refine prompts for better summaries or autofill.

---

## Troubleshooting

- **API keys not working?**  
  Double-check `.env` values and restart the dev server.
- **Autofill not working?**  
  Ensure valid API keys and network connectivity.
- **UI not updating?**  
  Check browser console for errors and verify API responses.

---

## License

MIT

---
