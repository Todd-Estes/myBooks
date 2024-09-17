import { React, useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import SearchBooks from './SearchBooks';
import BookShelves from './BookShelves';
import * as BooksAPI from './BooksAPI.js';

const App = () => {
  const [shelvedBooks, setShelvedBooks] = useState([]);
  const [error, setError] = useState(null);

  const updateBookShelf = async (book, shelf) => {
    const prevShelvedBooks = [...shelvedBooks];

    setShelvedBooks((currentShelvedBooks) => {
      const filteredShelvedBooks = currentShelvedBooks.filter(
        (b) => b.id !== book.id
      );
      if (shelf === 'none') {
        return filteredShelvedBooks;
      } else {
        return [...filteredShelvedBooks, { ...book, shelf }];
      }
    });

    try {
      await BooksAPI.update(book, shelf);
    } catch (updateError) {
      console.error('Failed to update book shelf:', updateError);
      setShelvedBooks(prevShelvedBooks);
      setError('Failed to update book. Please try again.');
    }
  };

  const getAllBooks = async () => {
    try {
      const res = await BooksAPI.getAll();
      console.log('App component mounted');
      setShelvedBooks(res);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setError('Failed to load books. Please refresh the page.');
    }
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <div className="app">
      {error && <div className="error-message">{error}</div>}
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <BookShelves
                books={shelvedBooks}
                onUpdateBook={updateBookShelf}
              />
              <div className="open-search">
                <Link to="/search">Add a book</Link>
              </div>
            </>
          }
        />
        <Route
          exact
          path="/search"
          element={
            <SearchBooks
              shelvedBooks={shelvedBooks}
              onUpdateBook={updateBookShelf}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;