import prisma from "../config/prisma.js";

class UserService {
  async create(data: any, tx?: any) {
    const db = tx || prisma;
    return await db.user.create({ data });
  }
}

export default new UserService();
