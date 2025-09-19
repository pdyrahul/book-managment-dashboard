import './main.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddEditBook from './pages/AddEditBook';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import ErrorBoundary from './ErrorBoundary';
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3}>
        <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddEditBook />} />
            <Route path="/edit/:id" element={<AddEditBook />} />
          </Routes>
        </Router>
        </ErrorBoundary>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
export default App;
