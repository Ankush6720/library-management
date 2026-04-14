# library-management-system

   This is a library management Backend API for the management of user and books 

   # Routes and the Endpoints

   ## /users
   GET: Get all the list of users in the system
   POST: Create/Register a new user

   ## /users/{id}
   GET: Get a user by their ID
   PUT: Updating a user vby their ID
   DELETE: Delating a user by their ID (Check if the user still has an issued book) && {is there any fine/penalty to be collected}

   ## /users/subscription-details/{id}
   GET: Get a user subscription details by their ID
     >> Date of subscription
     >> Valid till ?
     Fine if any ?

   ## /books
   GET: Get all the books in the system
   POST: Add a new book to the system

   ## /books/{id}
   GET: Get a book by its ID
   PUT: Update a books by its ID
   DELETE: Delete a book by its ID

   ## /books/issued
   GET: Get all the issued books

   ### Subscription Types
       >> Basic (3 Month)
       >> Standard (6 Months)
       >> Premium (12 Months)

    >> If a user missed the renewal date, then user should be collected with ₹100
    >> If a user misses his subscription, then user is expected to pay ₹100
    >> If a user misses both renewal & Subscription, then the collected amount should be ₹100

  ### Commands:
  npm init
  npm i express
  npm i nodemon --save-dev

  npm run dev

  To restore node modules and package-lock.json --> npm i/npm install