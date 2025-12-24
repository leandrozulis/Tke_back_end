import { prisma } from "../database/prisma.js";
export default class UserService {
    async findByUsername(username) {
        return await prisma.user.findUnique({
            where: {
                username
            }
        });
    }
}
