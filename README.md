# Money Transfer Application

A robust and secure money transfer application built with Node.js and Express, featuring user authentication, account management, and secure money transfer capabilities.

## Features

- 🔐 Secure user authentication with JWT
- 💳 Account management
- 💸 Money transfers between accounts
- 📝 Transaction history
- 🎯 Webhook integration for transfer status updates
- 📚 API documentation with Swagger
- ✅ Comprehensive test suite

## Technology Stack

- Node.js
- Express.js
- MySQL
- Knex.js (Query Builder)
- JWT for authentication
- Jest for testing
- Swagger for API documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd money-transfer-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/money_transfer_db
JWT_SECRET=your_jwt_secret
```

4. Run database migrations:
```bash
npx knex migrate:latest
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Running Tests
```bash
npm test
```

## API Documentation

The API documentation is available through Swagger UI at `/api-docs` when the application is running.

### Main API Endpoints

- **Authentication**
  - POST /api/auth/register - Register a new user
  - POST /api/auth/login - User login

- **Accounts**
  - GET /api/accounts - Get user accounts
  - POST /api/accounts - Create new account

- **Transfers**
  - POST /api/transfers - Initiate money transfer
  - GET /api/transfers - Get transfer history

- **Transactions**
  - GET /api/transactions - Get transaction history

## Database Schema

The application uses the following main tables:
- users
- accounts
- transactions

## Testing

The application includes comprehensive testing:
- Unit tests
- Integration tests
- API endpoint tests

Run tests using:
```bash
npm test
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Request validation with Joi
- Secure HTTP headers
- Input sanitization
- Transaction logging

## Error Handling

The application implements comprehensive error handling with:
- Custom error classes
- Detailed error messages
- Transaction rollbacks
- Error logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the development team.
# raven-api
