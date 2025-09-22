import axios from 'axios';
const API_BASE = "https://crudcrud.com/api/05de014ff8964ac197efc51d2dbf4403/books";
export const fetchBooks = () => axios.get(API_BASE);
export const addBook = (book) => axios.post(API_BASE, book);
export const updateBook = (id, book) => axios.put(`${API_BASE}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_BASE}/${id}`);
