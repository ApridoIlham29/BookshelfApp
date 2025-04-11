// State untuk mengelola mode edit
let isEditing = false;
let editingBookId = null;

// Fungsi untuk memeriksa ketersediaan localStorage
function isLocalStorageAvailable() {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    console.error('localStorage tidak tersedia:', e);
    alert('localStorage tidak tersedia. Data tidak akan disimpan.');
    return false;
  }
}

// Inisialisasi array books dari localStorage atau array kosong jika belum ada
let books = [];
if (isLocalStorageAvailable()) {
  try {
    const storedBooks = localStorage.getItem('books');
    books = storedBooks ? JSON.parse(storedBooks) : [];
  } catch (error) {
    console.error('Error loading books from localStorage:', error);
    books = [];
  }
} else {
  console.warn('localStorage tidak tersedia. Data akan disimpan di memori.');
  books = []; // Fallback ke array in-memory
}

// Fungsi untuk menyimpan books ke localStorage
function saveBooks() {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem('books', JSON.stringify(books));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert('Gagal menyimpan data buku');
    }
  } else {
    console.warn('localStorage tidak tersedia. Data hanya disimpan di memori.');
  }
}

// Fungsi validasi input
function validateBookInput(title, author, year) {
  if (!title || !author || !year) {
    alert('Semua field harus diisi!');
    return false;
  }

  if (title.length > 100 || author.length > 100) {
    alert('Judul dan penulis tidak boleh lebih dari 100 karakter.');
    return false;
  }

  const yearNum = Number(year);
  if (isNaN(yearNum) || yearNum < 1) {
    alert('Tahun harus berupa angka positif!');
    return false;
  }

  const currentYear = new Date().getFullYear();
  if (yearNum > currentYear) {
    alert(`Tahun tidak boleh melebihi tahun saat ini (${currentYear}).`);
    return false;
  }

  return true;
}

// Fungsi untuk menambahkan buku baru
function addBook(title, author, year, isComplete) {
  if (!validateBookInput(title, author, year)) {
    return;
  }

  const id = new Date().getTime();
  books.push({
    id,
    title: title.trim(),
    author: author.trim(),
    year: Number(year),
    isComplete,
    finishedAt: isComplete ? new Date().toISOString() : null, // Tambahkan properti finishedAt
  });

  saveBooks();
  renderBooks();
}

// Fungsi untuk memindahkan buku antar rak
function toggleIsComplete(id) {
  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    books[bookIndex].finishedAt = books[bookIndex].isComplete ? new Date().toISOString() : null; // Update finishedAt
    saveBooks();
    renderBooks();
  }
}

// Fungsi untuk menghapus buku
function deleteBook(id) {
  const book = books.find((b) => b.id === id);
  if (book && confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}"?`)) {
    books = books.filter((b) => b.id !== id);
    saveBooks();
    renderBooks();
  }
}

// Fungsi untuk merender buku ke dalam rak yang sesuai
function renderBooks(booksToRender = books) {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  booksToRender.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Fungsi untuk membuat elemen buku
function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');
  bookItem.className = 'book-item';

  const titleElement = document.createElement('h3');
  titleElement.setAttribute('data-testid', 'bookItemTitle');
  titleElement.textContent = book.title;

  const authorElement = document.createElement('p');
  authorElement.setAttribute('data-testid', 'bookItemAuthor');
  authorElement.textContent = `Penulis: ${book.author}`;

  const yearElement = document.createElement('p');
  yearElement.setAttribute('data-testid', 'bookItemYear');
  yearElement.textContent = `Tahun: ${book.year}`;

  // Tambahkan informasi waktu penyelesaian
  if (book.isComplete && book.finishedAt) {
    const finishedAtElement = document.createElement('p');
    finishedAtElement.className = 'finished-at';
    finishedAtElement.textContent = `Selesai: ${formatDate(book.finishedAt)}`;
    bookItem.appendChild(finishedAtElement);
  }

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  const moveButton = document.createElement('button');
  moveButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  moveButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  moveButton.setAttribute('aria-label', book.isComplete ? 'Pindahkan ke rak belum selesai dibaca' : 'Pindahkan ke rak selesai dibaca');
  moveButton.addEventListener('click', () => toggleIsComplete(book.id));

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit buku';
  editButton.addEventListener('click', () => editBook(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus buku';
  deleteButton.setAttribute('aria-label', 'Hapus buku ' + book.title);
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  buttonGroup.appendChild(moveButton);
  buttonGroup.appendChild(editButton);
  buttonGroup.appendChild(deleteButton);

  bookItem.appendChild(titleElement);
  bookItem.appendChild(authorElement);
  bookItem.appendChild(yearElement);
  bookItem.appendChild(buttonGroup);

  return bookItem;
}

// Fungsi untuk mengedit buku
function editBook(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  isEditing = true;
  editingBookId = id;

  // Isi form dengan data buku yang akan diedit
  document.getElementById('bookFormTitle').value = book.title;
  document.getElementById('bookFormAuthor').value = book.author;
  document.getElementById('bookFormYear').value = book.year;
  document.getElementById('bookFormIsComplete').checked = book.isComplete;

  // Ubah teks tombol submit
  const submitButton = document.getElementById('bookFormSubmit');
  submitButton.textContent = 'Edit Buku';

  // Scroll ke form
  document.querySelector('.book-form').scrollIntoView({ behavior: 'smooth' });
}

// Event listener untuk form penambahan/edit buku
document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (!validateBookInput(title, author, year)) {
    return;
  }

  if (isEditing) {
    // Update buku yang sedang diedit
    const bookIndex = books.findIndex((b) => b.id === editingBookId);
    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        title: title.trim(),
        author: author.trim(),
        year: Number(year),
        isComplete,
        finishedAt: isComplete ? new Date().toISOString() : null, // Update finishedAt
      };
    }

    // Reset mode edit
    isEditing = false;
    editingBookId = null;
    document.getElementById('bookFormSubmit').textContent = 'Tambah Buku ke rak';
  } else {
    // Tambah buku baru
    addBook(title, author, year, isComplete);
  }

  // Reset form
  this.reset();
  saveBooks();
  renderBooks();
});

// Fungsi untuk mencari buku
function searchBooks(query) {
  if (!query.trim()) return books;

  const lowercaseQuery = query.toLowerCase().trim();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery)
  );
}

// Fungsi debouncing
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Fungsi pencarian yang di-debounce
const debouncedSearch = debounce(function (query) {
  const searchResult = searchBooks(query);
  renderBooks(searchResult);
}, 250); // Tunda pencarian 250ms

// Event listener untuk form pencarian
document.getElementById('searchBook').addEventListener('submit', function (e) {
  e.preventDefault();
  const query = document.getElementById('searchBookTitle').value;
  debouncedSearch(query);
});

// Event listener untuk input pencarian (search realtime)
document.getElementById('searchBookTitle').addEventListener('input', function (e) {
  const query = e.target.value;
  debouncedSearch(query);
});

// Render buku saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  renderBooks();

  // Reset form dan state edit jika ada
  document.getElementById('bookForm').reset();
  isEditing = false;
  editingBookId = null;
  document.getElementById('bookFormSubmit').textContent = 'Tambah Buku ke rak';

  // Set nilai max tahun secara dinamis
  document.getElementById('bookFormYear').max = new Date().getFullYear();
});

// Fungsi untuk memformat tanggal
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('id-ID', options);
}