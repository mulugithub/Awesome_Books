/* eslint-disable no-use-before-define */
let books = [];
const booksList = document.getElementById('book-list');
const errorMessage = document.getElementById('error-message');
const bookTitle = document.getElementById('title');
const bookAuthor = document.getElementById('author');

function addBook(title, author) {
  // Check if book already exists in collection
  if (isDuplicate(title, author)) {
    errorMessage.textContent = 'This book is already exist!';
    errorMessage.style.display = 'block';
    bookTitle.style.border = '1px solid red';
    bookAuthor.style.border = '1px solid red';
    setTimeout(() => {
      errorMessage.style.display = 'none';
      bookTitle.style.border = '';
      bookAuthor.style.border = '';
      clearInput();
    }, 5000); // hide the error message after 5 seconds
    return;
  }

  if(bookTitle.value === '' || bookAuthor.value === '') {
    errorMessage.textContent = 'Please enter book details';
    preventDefault();
    errorMessage.style.display = 'block';
  }

  // Generate new unique ID for book
  const id = counterAutoIncreatmentId();

  // Add book to collection
  // eslint-disable-next-line object-shorthand
  books.push({ id: id, title: title, author: author });

  // Save books to local storage
  saveBooksLocalStorage();

  // Clear input fields
  clearInput();

  // Display book in list
  displayBook(id, title, author);
}

function isDuplicate(title, author) {
  return books.some((book) => book.title === title && book.author === author);
}

function removeBook(id) {
  // Remove book from collection
  books = books.filter((book) => book.id !== id);

  // Save books to local storage
  // eslint-disable-next-line no-use-before-define
  saveBooksLocalStorage();

  // Remove book from list
  const bookElement = document.getElementById(`book-${id}`);
  if (bookElement) {
    bookElement.remove();
  }
}

function displayBook(id, title, author) {
  // Create list of awesome book
  const bookElement = document.createElement('li');
  bookElement.setAttribute('id', `book-${id}`);
  bookElement.textContent = `"${title}" by ${author}`;

  // Create remove button for book
  const removeButton = document.createElement('button');
  removeButton.setAttribute('class', 'remove-btn');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    removeBook(id);
  });
  bookElement.appendChild(removeButton);

  // Add book to list
  booksList.appendChild(bookElement);
}

function counterAutoIncreatmentId() {
  if (books.length === 0) {
    return 1;
  }
  return books[books.length - 1].id + 1;
}

function saveBooksLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

function clearInput() {
  bookTitle.value = '';
  bookAuthor.value = '';
}

// Add event listener to click or submit button
const addButton = document.getElementById('add-btn');
addButton.addEventListener('click', (event) => {
  event.preventDefault();
  const title = bookTitle.value;
  const author = bookAuthor.value;
  addBook(title, author);
  errorMessage.style.display = 'none';
});

Window.addEventListener('load', (e) => {
  e.preventDefault();
  // Load books from local storage
  if (localStorage.getItem('books')) {
    books = JSON.parse(localStorage.getItem('books'));
    books.forEach((book) => {
      displayBook(book.id, book.title, book.author);
    });
  }
});