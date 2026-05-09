const express = require("express");
const fs = require("fs");
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");

const router = express.Router();

/*
* Route: /books
* Method: GET
* Description: Get all books
* Access: Public
* Parameters: None
*/
router.get('/', (req, res)=>{
    res.status(200).json({
        success: true,
        data: books
    })
})

/*
* Route: /books/:id
* Method: GET
* Description: Get a book by ID
* Access: Public
* Parameters: id
*/
router.get('/:id', (req, res)=>{
    const {id} = req.params;
    const book = books.find((each)=> each.id === parseInt(id));

    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book: ${id} not found`
        })
    }

    res.status(200).json({
        success: true,
        data: book
    })
})

/*
* Route: /books/:id
* Method: POST
* Description: Add a new book by ID
* Access: Public
* Parameters: id
*/
router.post('/:id', (req, res)=>{
    const {id, title, author, published, available, price} = req.body;

    // Validate the request body
    if(!id || !title || !author || !published || !available || !price){
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        })
    }

    // Check if the book already exists
    const book = books.find((each)=> each.id === id);
    if(book){
        return res.status(400).json({
            success: false,
            message: `Book: ${id} already exists`
        })
    }

    // Add the new book to the books array
    books.push({id, title, author, published, available, price});

    res.status(201).json({
        success: true,
        message: `Book: ${id} added successfully`
    })

})

/*
* Route: /books/:id
* Method: PUT
* Description: Update an existing book by ID
* Access: Public
* Parameters: id
*/
router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const {title, author, published, available, price} = req.body;

    // Validate that all fields are provided
    if (!title || !author || !published || available === undefined || !price) {
        return res.status(400).json({
            success: false,
            message: "All Fields are required"
        });
    }

    // Find the book to update
    const book = books.find((each)=> each.id === parseInt(id));
    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book: ${id} not found`
        })
    }

    // Update the book details
    const updatedBook = {...book, title, author, published, available, price};

    // Replace the old book with the updated one
    const bookIndex = books.findIndex((each)=> each.id === parseInt(id));
    books[bookIndex] = updatedBook;

    res.status(200).json({
        success: true,
        message: `Book: ${id} updated successfully`,
        data: updatedBook
    })
})

/*
* Route: /books/:id
* Method: DELETE
* Description: Delete an existing book by ID
* Access: Public
* Parameters: id
*/
router.delete('/:id', (req, res)=>{
    const {id} = req.params;

    // Find the book to delete
    const bookIndex = books.findIndex((each)=> each.id === parseInt(id));
    if(bookIndex === -1){
        return res.status(404).json({
            success: false,
            message: `Book: ${id} not found`
        })
    }

    // Remove the book from the books array
    books.splice(bookIndex, 1);

    res.status(200).json({
        success: true,
        message: `Book: ${id} deleted successfully`
    })
})

/*
* Route: /books/issued
* Method: GET
* Description: Get all issued books
* Access: Public
* Parameters: None
*/
router.get('/issued/for-user', (req, res)=>{
    const usersWithIssuedBooks = users.filter((each)=> {
        if(each.issuedBook)
            return each;
    })

    const issuedBooks = [];
    usersWithIssuedBooks.forEach((each)=>{
        const book = books.find((book)=> book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    })

    if(issuedBooks === 0){
        return res.status(404).json({
            success: false,
            message: "No books have been issued"
        })
    }
    
    res.status(200).json({
        success: true,
        data: issuedBooks
    })
})


module.exports = router;