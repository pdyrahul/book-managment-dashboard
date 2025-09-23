import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField, Button, Paper, Box, Typography, CircularProgress, InputAdornment
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { useSnackbar } from 'notistack';
import { fetchBytitle } from '../feature/gemini';  // AI function

const STATUS_OPTIONS = ['Available', 'Issued'];

export default function AddEditBook() {
  const { id } = useParams();
  const nav = useNavigate();
  const { enqueueSnackbar: toast } = useSnackbar();

  const { booksResult, addBookMutation, updateBookMutation } = useBooks();

  const {
    register, handleSubmit, reset, setValue, watch,
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

  const [loadingFields, setLoadingFields] = useState({
    author: false,
    genre: false,
    publishedYear: false
  });

  // pre-fill if editing
  useEffect(() => {
    if (id && booksResult.data) {
      const existingBook = booksResult.data.find(item => item.id === id);
      if (existingBook) reset(existingBook);
    }
  }, [id, booksResult.data, reset]);

  // fetch AI data when title is entered
  const handleTitleBlur = async (e) => {
    const title = e.target.value.trim();
    if (!title) return;

    const currentAuthor = watch('author');
    const currentGenre = watch('genre');
    const currentYear = watch('publishedYear');

    if (currentAuthor || currentGenre || currentYear) {
      toast("Fields already filled, skipping autofill", { variant: "info" });
      return; // do not overwrite
    }

    try {
      setLoadingFields({ author: true, genre: true, publishedYear: true });
      const bookData = await fetchBytitle(title);
      if (bookData) {
        setValue("author", bookData.author || "");
        setValue("genre", bookData.genre || "");
        setValue("publishedYear", bookData.publishedYear || "");
        toast("Book details auto-filled", { variant: "info" });
      }
    } catch (err) {
      console.error("Autofill failed", err);
      toast("Could not fetch book details", { variant: "warning" });
    } finally {
      setLoadingFields({ author: false, genre: false, publishedYear: false });
    }
  };

  const saveBook = async (formValues) => {
    try {
      if (id) {
        await updateBookMutation.mutateAsync({ id, book: formValues });
        toast('Book updated successfully', { variant: 'success' });
      } else {
        await addBookMutation.mutateAsync(formValues);
        toast('Book added successfully', { variant: 'success' });
      }
      nav('/');
    } catch (err) {
      console.error("Error saving book:", err);
      toast('Failed to save book', { variant: 'error' });
    }
  };

  if (id && booksResult.isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h6" mb={2}>
        {id ? "Edit Book" : "Add Book"}
      </Typography>

      <form onSubmit={handleSubmit(saveBook)} noValidate>
        {/* Title */}
        <TextField
          label="Title"
          placeholder='Enter book title to fetch from AI'
          fullWidth
          margin="normal"
          {...register('title', { required: 'Title is required' })}
          error={!!errors.title}
          helperText={errors.title?.message}
          onBlur={handleTitleBlur}
          value={watch('title')}
          onChange={(e) => setValue('title', e.target.value)}
        />

        {/* Author */}
        <TextField
          label="Author"
          fullWidth
          margin="normal"
          {...register('author', { required: 'Author is required' })}
          error={!!errors.author}
          helperText={errors.author?.message}
          value={watch('author')}
          onChange={(e) => setValue('author', e.target.value)}
          InputProps={{
            endAdornment: loadingFields.author && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            )
          }}
        />

        {/* Genre */}
        <TextField
          label="Genre"
          fullWidth
          margin="normal"
          {...register('genre', { required: 'Genre is required' })}
          error={!!errors.genre}
          helperText={errors.genre?.message}
          value={watch('genre')}
          onChange={(e) => setValue('genre', e.target.value)}
          InputProps={{
            endAdornment: loadingFields.genre && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            )
          }}
        />

        {/* Published Year */}
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
          value={watch('publishedYear')}
          onChange={(e) => setValue('publishedYear', e.target.value)}
          InputProps={{
            endAdornment: loadingFields.publishedYear && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            )
          }}
        />

        {/* Status */}
        <TextField
          select
          label="Status"
          fullWidth
          margin="normal"
          {...register('status', { required: 'Status is required' })}
          error={!!errors.status}
          helperText={errors.status?.message}
          value={watch('status')}
          onChange={(e) => setValue('status', e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value=""></option>
          {STATUS_OPTIONS.map((s, idx) => (
            <option key={idx} value={s}>{s}</option>
          ))}
        </TextField>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => nav('/')}>
            Cancel
          </Button>
          <Button type="button" variant="contained"  onClick={() => reset()} sx={{ mx: 2 }}>
            clear
          </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {id ? "Updating..." : "Adding..."}
                </>
              ) : (
                id ? "Update" : "Add"
              )}
            </Button>
        </Box>
      </form>
    </Paper>
  );
}
