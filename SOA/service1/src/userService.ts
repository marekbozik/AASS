import uuid from 'uuid';

export class UserService {
    registerUser(name: string, email: string, password: string): Promise<string> {
      // Add logic for registering the user and returning a unique user ID
      // For example, you can generate a UUID using a library like `uuid`:
      const userId = uuid();
      // Return the generated user ID
      return Promise.resolve(userId);
    }
  }