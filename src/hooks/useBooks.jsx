import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchBooks, addBook, updateBook, deleteBook } from '../api';

export function useBooks() {
  const qc = useQueryClient();

  // main books query
  const booksResult = useQuery(
    'books',
    async () => {
      const res = await fetchBooks();
      const data = res.data;
      return data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  // add a book 
  const addBookMutation = useMutation(addBook, {
    onSuccess: () => {
      qc.invalidateQueries('books');
    },
  });

  // update existing book
  const updateBookMutation = useMutation(
    ({ id, book }) => {
      const { _id, ...bookWithoutId } = book; 
      return updateBook(id, bookWithoutId);  
    },
    {
      onSuccess: () => {
        qc.invalidateQueries('books');
      },
    }
  );


  // delete a book
  const deleteBookMutation = useMutation(
    (id) => deleteBook(id),
    {
      onSuccess: () => {
        qc.invalidateQueries('books');
      },
    }
  );

  return {
    booksResult,
    addBookMutation,
    updateBookMutation,
    deleteBookMutation,
  };
}
