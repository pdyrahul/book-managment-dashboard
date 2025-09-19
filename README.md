# Book Management Dashboard

A React-based dashboard for managing books, with features like add/edit, search, filter, delete, and AI-powered book summaries in Hindi or English.

## Features

- **Dashboard:** View, search, filter, and paginate books.
- **Add/Edit Book:** Form to add new books or edit existing ones.
- **Delete Book:** Delete books with confirmation.
- **AI Summary:** Get concise book summaries in Hindi or English using Gemini AI.
- **Error Boundary:** Graceful error handling for the entire app.
- **Snackbar Notifications:** User feedback for actions.
- **Loading Indicators:** Spinners for async actions.

## Tech Stack

- React (with hooks)
- Material UI (MUI)
- React Query
- Notistack (Snackbar)
- Gemini AI (GoogleGenAI)
- React Router

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

## Folder Structure

```
src/
  ├── components/
  │     └── BookTitleWithSummary.jsx
  ├── feature/
  │     └── gemini.js
  ├── pages/
  │     ├── Dashboard.jsx
  │     └── AddEditBook.jsx
  ├── App.jsx
  ├── ErrorBoundary.jsx
  └── main.css
```

## Key Components

### BookTitleWithSummary.jsx

- Shows book title with an info icon.
- On click, opens a popper with AI summary.
- User can toggle summary language (Hindi/English).
- Uses `fetchBookSummary(title, language)` from `gemini.js`.

### gemini.js

- Uses GoogleGenAI to fetch book summaries.
- Accepts book title and language (`hindi` or `english`).
- Returns concise summary text.

### AddEditBook.jsx

- Form for adding or editing books.
- Shows spinner and "Adding..." or "Updating..." on submit.
- Handles validation and error display.

### Dashboard.jsx

- Lists all books with pagination.
- Search and filter by genre/status.
- Delete books with confirmation dialog.

### App.jsx

- Sets up routing, error boundary, query client, and snackbar provider.

## AI Summary Language Selection

- Default summary language is Hindi.
- User can switch to English using a toggle in the summary popper.

## Environment Variables

- **GoogleGenAI API Key:** Set in `gemini.js`. Replace with your own for production.

## Customization

- Add more genres/status options in `Dashboard.jsx` and `AddEditBook.jsx`.
- Style using `main.css` or MUI theme.

## License

MIT
