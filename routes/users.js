const express = require("express");
const {users} = require("../data/users.json");

const router = express.Router();

/*
* Route: /users
* Method: GET
* Description: Get all users
* Access: Public
* Parameters: None
*/
router.get('/', (req, res)=>{
    res.status(200).json({
        success: true,
        data: users
    })
})

/*
* Route: /users/:id
* Method: GET
* Description: Get a user by ID
* Access: Public
* Parameters: id
*/
router.get('/:id', (req, res)=>{

    const {id} = req.params;
    const user = users.find((each)=> each.id === parseInt(id));

    if(!user){
        return res.status(404).json({
            success: false,
            message: `User: ${id} not found`
        })
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

/*
* Route: /users
* Method: POST
* Description: Create/Register a user
* Access: Public
* Parameters: id
*/
router.post('/', (req, res)=>{
    const {id, name, email, role, membershipDate, active} = req.body;
    if(!id || !name || !email || !role || !membershipDate || active === undefined){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    const user = users.find((each)=> each.id === parseInt(id))
    if(user){
        return res.status(409).json({
            success: false,
            message: `User ${id} already exists`
        })
    }

    users.push({id, name, email, role, membershipDate, active})

    res.status(201).json({
        success: true,
        message: "User created successfully",
    })
})

/*
* Route: /users/:id
* Method: PUT
* Description: Update an existing user
* Access: Public
* Parameters: id
*/
router.put('/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const {data} = req.body;

    if(!data || typeof data !== 'object'){
        return res.status(400).json({
            success: false,
            message: 'Invalid update payload'
        })
    }

    const userIndex = users.findIndex((each)=> each.id === id)
    if(userIndex === -1){
        return res.status(404).json({
            success: false,
            message: `User ${id} not found`
        })
    }

    users[userIndex] = {
        ...users[userIndex],
        ...data,
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: users[userIndex]
    })
})

/*
* Route: /users/:id
* Method: DELETE
* Description: Delete an existing user by ID
* Access: Public
* Parameters: id
*/
router.delete('/:id', (req, res)=>{
    // Parse the id parameter from the URL and convert it to a number.
    const id = parseInt(req.params.id);

    // Find the index of the user with the matching numeric id.
    const userIndex = users.findIndex((each)=> each.id === id)

    // If no user is found, return a 404 error response.
    if(userIndex === -1){
        return res.status(404).json({
            success: false,
            message: `User ${id} not found`
        })
    }

    // Remove the user from the array in place.
    users.splice(userIndex, 1)

    // Return a success response with the updated users list.
    res.status(200).json({
        success: true,
        message: `User ${id} deleted successfully`,
        data: users
    })
})

/*
* Route: /users/subscription-details/:id
* Method: GET
* Description: Get all users with role 'user'
* Access: Public
* Parameters: None
*/
router.get('/subscription-details/:id', (req, res)=>{
    const {id} = req.params;

    // Find the user with the matching numeric id.
    const user = users.find((each)=> each.id === id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: `User ${id} not found`
        })
    }

    // Extract subscription details from the user object.
    const getDateInDays = (data = '')=>{
        let date;
        if(data){
            date = new Date(data);
        } else {
            date = new Date();
        }
        let days = Math.floor(date/(1000*60*60*24));
        return days;
    }

    const subscriptionType = (date)=>{
        if(user.subscriptionType === 'Basic'){
            date = date + 90
        } else if(user.subscriptionType === 'Standard'){
            date = date + 180
        } else if(user.subscriptionType === 'Premium'){
            date = date + 365
            } 
        return date;
    }

    // Calculate subscription details based on the user's subscription type and date.
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiry = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiry < currentDate,
        subscriptionDaysLeft: subscriptionExpiry - currentDate,
        daysLeftForExpiration: returnDate - currentDate,
        returnDate: returnDate < currentDate ? "Book return overdue" : returnDate,
        fine: returnDate < currentDate ? subscriptionExpiry <= currentDate ? 200 : 100 : 0
    }

    res.status(200).json({
        success: true,
        data

    });
})


module.exports = router;
