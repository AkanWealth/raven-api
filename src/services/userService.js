const db = require('../utils/db');

// User service: business logic for user operations
class UserService {
  // Example: get user by ID
  async getUserById(id) {
    const user = await db('users').where({ id }).first();
    return user;
  }
  async createUser(data) {
    // Ensure the password is stored as password_hash
    const userData = {
      name: data.name,
      email: data.email,
      password_hash: data.password,
    };
    const [id] = await db('users').insert(userData);
    return this.getUserById(id);
  }
  async getUserByEmail(email) {
    return db('users').where({ email }).first();
  }
}
module.exports = new UserService();
