PRAGMA foreign_keys = ON;


-- -----------------------------------------------------
-- Table authors
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS authors (
    'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    'firstname' VARCHAR(32) NOT NULL,
    'lastname' VARCHAR(32) NOT NULL,
    'url' VARCHAR(255) NOT NULL
);


-- -----------------------------------------------------
-- Table categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    'name' VARCHAR(128) NOT NULL
);


-- -----------------------------------------------------
-- Table books
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
    'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    'title' VARCHAR(128) NOT NULL,
    'isbn' VARCHAR(16) NOT NULL,
    'url' VARCHAR(255) NOT NULL,
    'summary' TEXT NOT NULL,
    'categories_id' INTEGER NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);


-- -----------------------------------------------------
-- Table authors_books
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS authors_books (
    'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    'books_id' INTEGER NOT NULL REFERENCES books(id) ON UPDATE CASCADE ON DELETE CASCADE,
    'authors_id' INTEGER NOT NULL REFERENCES authors(id) ON UPDATE CASCADE ON DELETE CASCADE
);
