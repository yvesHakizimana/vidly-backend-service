// POST /api/returns/ {customerId, movieId}

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId in not provided
// Return 400 if movieId/customerId are not valid objectIds.
// Return 404 if no rental found for this customer/movie combination

// Return 200 if it is valid request
// Set the return date
// calculate the rental fee
// Increase the stock because the movie will be already returned.
// Return the rental with all properties set