const express = require("express");
const {users} = require("./data/users.json");

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");

const app = express();

const PORT = 8081;

app.use(express.json());

app.get('/', (req, res)=> {

    res.status(200).json({
        message: "Home Page"
    })
})

app.use('/users', userRouter);
app.use('/books', bookRouter);


app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})