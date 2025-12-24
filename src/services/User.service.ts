import { prisma } from "../database/prisma.js";

export default class UserService {
  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: {
        username
      }
    });
  }
}