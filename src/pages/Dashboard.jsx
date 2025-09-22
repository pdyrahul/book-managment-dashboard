import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Select, MenuItem, Button, CircularProgress, Box, Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ConfirmDialog from '../components/ConfirmDialog';
import { Edit, Trash2 } from 'lucide-react';
import BookTitleWithSummary from '../components/BookTitleWithSummary';

const PAGE_SIZE = 10;

const STATUS_LIST = ['Available', 'Issued'];

export default function Dashboard() {
  const { booksResult, deleteBookMutation } = useBooks();
  const { enqueueSnackbar: notify } = useSnackbar();
  const nav = useNavigate();

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // Loading state first
  if (booksResult.isLoading) {
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }

  // Error fallback
  if (booksResult.isError) {
    return <div>something went wrong loading books</div>;
  }

  const allBooks = booksResult.data || [];

  const filtered = allBooks.filter(b => {
    const matchSearch = (
      b.title.toLowerCase().includes(searchText.toLowerCase()) ||
      b.author.toLowerCase().includes(searchText.toLowerCase())
    );

    const matchGenre = genre ? b.genre === genre : true;
    const matchStatus = status ? b.status === status : true;

    return matchSearch && matchGenre && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visibleBooks = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteClick = (bookId) => {
    setIdToDelete(bookId);
    setConfirmOpen(true);
  };

  const doDelete = () => {
    deleteBookMutation.mutate(idToDelete, {
      onSuccess: () => {
        notify('Book deleted', { variant: 'success' });
        setConfirmOpen(false);
      },
      onError: (err) => {
        console.error("Delete failed", err);
        notify('Failed to delete book', { variant: 'error' });
      }
    });
  };

  return (
    <Paper sx={{ padding: 2 }}>
      {/* Header Bar */}
      <Box sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Book Management Dashboard
        </Typography>
      </Box>

      {/* Filters & Controls */}
      <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
        <TextField
          label="Search by Title or Author"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        <Select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Genres</MenuItem>
          {allBooks?.map((book, i) => (
            <MenuItem key={`${book.genre}-${i}`} value={book.genre}>{book.genre}</MenuItem>
          ))}
        </Select>
        <Select
          value={status}
          onChange={e => setStatus(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Status</MenuItem>
          {STATUS_LIST.map((s, i) => (
            <MenuItem key={i} value={s}>{s}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={() => nav('/add')}>+ Add Book</Button>
      </Box>

      {/* Book Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Published Year</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleBooks.map((book, idx) => (
              <TableRow key={book._id || idx}>
                <TableCell><BookTitleWithSummary title={book.title} /></TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>{book.publishedYear}</TableCell>
                <TableCell>{book.status}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<Edit size={16} />}
                    onClick={() => nav(`/edit/${book.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Trash2 size={16} />}
                    onClick={() => handleDeleteClick(book.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {visibleBooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No books found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2} flexWrap="wrap" gap={1}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={`page-${i}`}
            variant={page === i + 1 ? 'contained' : 'outlined'}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </Box>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Book"
        content="Are you sure you want to delete this book? This action cannot be undone."
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
      />
    </Paper>
  );
}
