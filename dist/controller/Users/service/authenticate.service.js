import bcrypt from 'bcrypt';
import UserService from '../../../services/User.service.js';
const userAuthService = new UserService();
export async function authenticateUser(user, password) {
    const findUser = await userAuthService.findByUsername(user);
    const doesPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!doesPasswordMatch) {
        throw new Error('Usuário incorreto.');
    }
    return {
        id: findUser.id,
        username: findUser.username,
        role: findUser.role
    };
}
