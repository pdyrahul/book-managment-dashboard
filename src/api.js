import axios from 'axios';
const API_BASE = 'https://crudcrud.com/api/a03dd7de960a4e6b91f1d3a66fa6585a/books';
export const fetchBooks = () => axios.get(API_BASE);
export const addBook = (book) => axios.post(API_BASE, book);
export const updateBook = (id, book) => axios.put(`${API_BASE}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_BASE}/${id}`);
