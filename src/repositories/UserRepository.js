import IUserRepository from './IUserRepository.js';
import { createUser } from '../services/UserService.js';

class UserRepository extends IUserRepository {
    constructor() {
        super();
    }

    async getUserById(id) {
        return await getUserById(id);
    }

    async createUser(userData) {
        return await createUser(userData);
    }

    async updateUser(id, userData) {
        return await updateUser(id, userData);
    }

    async deleteUser(id) {
        return await deleteUser(id);
    }
}

export default UserRepository;
