import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField, Button, Paper, MenuItem, Box, Typography, CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { useSnackbar } from 'notistack';

const GENRES = [
  'Fiction', 'Non-fiction', 'Mystery', 'Thriller',
  'Romance', 'Science Fiction', 'Fantasy', 'Biography',
  'History', 'Self-help', 'Horror', "Children's",
  'Adventure', 'Memoir', 'Crime', 'Drama'
];

const STATUS_OPTIONS = ['Available', 'Issued'];

export default function AddEditBook() {
  const { id } = useParams(); 
  const nav = useNavigate();  
  const { enqueueSnackbar: toast } = useSnackbar(); 

  const { booksResult, addBookMutation, updateBookMutation } = useBooks();

  // setting up form defaults here
  const { 
    register, 
    handleSubmit, 
    reset, 
    control, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      publishedYear: '',
      status: '',
    }
  });
  useEffect(() => {
    if (id && booksResult.data) {
      const existingBook = booksResult.data.find(item => item._id === id);
      if (existingBook) {
        reset({
          title: existingBook.title,
          author: existingBook.author,
          genre: existingBook.genre,
          publishedYear: existingBook.publishedYear,
          status: existingBook.status,
        });
      }
    }
  }, [id, booksResult.data, reset]);

  const saveBook = async (formValues) => {
    try {
      if (id) {
        await updateBookMutation.mutateAsync({ id, book: formValues });
        toast('Book updated successfully', { variant: 'success' });
      } else {

        const newBook = { ...formValues };
        await addBookMutation.mutateAsync(newBook);
        toast('Book added successfully', { variant: 'success' });
      }
      nav('/');
    } catch (err) {
      console.error("Error saving book:", err); 
      toast('Failed to save book', { variant: 'error' });
    }
  };

  // show spinner while book details load
  if (id && booksResult.isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ maxWidth: 600, margin: 'auto', p: 3, mt: 5 }}>
      <Typography variant="h6" mb={2}>
        {id ? 'Edit Book' : 'Add Book'}
      </Typography>

      <form onSubmit={handleSubmit(saveBook)} noValidate>
        {/* title input */}
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          {...register('title', { required: 'Title is required' })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        {/* author input */}
        <TextField
          label="Author"
          fullWidth
          margin="normal"
          {...register('author', { required: 'Author is required' })}
          error={!!errors.author}
          helperText={errors.author?.message}
        />

        {/* genre select */}
        <Controller
          name="genre"
          control={control}
          rules={{ required: 'Genre is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Genre"
              fullWidth
              margin="normal"
              error={!!errors.genre}
              helperText={errors.genre?.message}
            >
              {GENRES.map((g, idx) => (
                <MenuItem key={`${g}-${idx}`} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* published year input */}
        <TextField
          label="Published Year"
          type="number"
          fullWidth
          margin="normal"
          {...register('publishedYear', {
            required: 'Published Year is required',
            min: { value: 1000, message: 'Enter a valid year' },
            max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
          })}
          error={!!errors.publishedYear}
          helperText={errors.publishedYear?.message}
        />

        {/* status select */}
        <Controller
          name="status"
          control={control}
          rules={{ required: 'Status is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Status"
              fullWidth
              margin="normal"
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              {STATUS_OPTIONS.map((s, idx) => (
                <MenuItem key={idx} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box mt={3} display="flex" justifyContent="space-between">
          {/* cancel just goes home */}
          <Button variant="outlined" onClick={() => nav('/')}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                {id ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              id ? 'Update' : 'Add'
            )}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
