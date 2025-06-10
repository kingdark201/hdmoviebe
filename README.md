# Node.js and MongoDB Project

## Overview
This project is a simple Node.js application that uses Express for the server framework and MongoDB for the database. It provides basic user management functionalities such as creating a user, retrieving a user, and listing all users.

## Project Structure
```
node-mongodb-project
├── src
│   ├── app.js                # Entry point of the application
│   ├── controllers
│   │   └── userController.js # Handles user-related operations
│   ├── models
│   │   └── userModel.js      # Defines the user schema
│   ├── routes
│   │   └── userRoutes.js     # Sets up user-related routes
│   └── config
│       └── db.js             # Database connection configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-mongodb-project
   ```

2. **Install dependencies**
   Make sure you have Node.js and npm installed. Then run:
   ```bash
   npm install
   ```

3. **Configure the database**
   Update the `src/config/db.js` file with your MongoDB connection string.

4. **Run the application**
   Start the server using:
   ```bash
   node src/app.js
   ```

## Usage Examples

- **Create a User**
  - Endpoint: `POST /users`
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "securepassword" }`

- **Get a User**
  - Endpoint: `GET /users/:id`

- **Get All Users**
  - Endpoint: `GET /users`

### Comments API

- **Add Comment**
  - Endpoint: `POST /api/comments/add`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "comment": "Great movie!", "slug_film": "film-slug", "name_film": "Film Name" }`

- **Delete Comment**
  - Endpoint: `DELETE /api/comments/delete/:id`
  - Headers: `Authorization: Bearer <token>`

- **Get Comments By Slug**
  - Endpoint: `GET /api/comments/by-slug/:slug`

## License
This project is licensed under the MIT License.