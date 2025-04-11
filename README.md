# Bookshelf APP

A simple web application built with HTML, CSS, and JavaScript to manage your personal book reading list. Keep track of books you want to read, are currently reading, and have finished reading, all stored conveniently in your browser's local storage.

## Features

* **Add Books:** Easily add new books with Title, Author, and Publication Year.
* **Manage Reading Status:** Mark books as "Finished" or "Unfinished".
* **Organized Shelves:** Books are automatically sorted into "Unfinished Books" and "Finished Books" sections.
* **Track Completion Time:** Finished books display the date and time they were marked as complete.
* **Edit Book Details:** Modify the title, author, year, or completion status of existing books.
* **Delete Books:** Remove books from your list with a confirmation prompt.
* **Search Functionality:** Quickly find books by searching for titles or authors (real-time search with debouncing).
* **Data Persistence:** Your book list is saved in the browser's `localStorage`, so your data persists even after closing the browser window.
* **Input Validation:** Ensures required fields are filled and the year is a valid number within reasonable limits.
* **Responsive Design:** Adapts to different screen sizes for a good user experience on desktop and mobile devices.
* **Edit Mode:** Smoothly transitions the add form into an edit form when modifying a book.

## Technologies Used

* **HTML5:** For the structure and content of the application.
* **CSS3:** For styling, layout (including Flexbox and Grid), responsiveness, and visual appeal.
* **JavaScript (ES6+):** For application logic, DOM manipulation, event handling, `localStorage` interaction, and dynamic updates.

## Setup & Usage

1.  **Clone or Download:** Get the project files (`index.html`, `style.css`, `main.js`).
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
    Or simply download the ZIP file if you don't use Git yet.

2.  **Open in Browser:** Open the `index.html` file directly in your preferred web browser (like Chrome, Firefox, Edge, etc.).

3.  **Interact:**
    * Use the "Add New Book" form to input book details and add them to your shelves.
    * Books will appear in either the "Unfinished Books" or "Finished Books" section based on the checkbox selection.
    * Use the buttons on each book item to:
        * Move between shelves ("Selesai dibaca" / "Belum selesai dibaca").
        * Edit the book's details ("Edit buku").
        * Delete the book ("Hapus buku").
    * Use the "Search Books" form to filter your book list by title or author. The list updates as you type.

## Screenshot

*(Optional: It's highly recommended to add a screenshot of your application here. You can take a picture and embed it in the README using Markdown: `![App Screenshot](path/to/your/screenshot.png)`)*

## Author

* **Aprido Ilham**

## License

*(Optional but good practice: Consider adding a license, like the MIT License. You would create a file named `LICENSE` containing the license text and link to it here.)*
[MIT License](LICENSE)
