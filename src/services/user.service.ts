import prisma from "../config/prisma.js";

class UserService {
  async create(data: any, tx?: any) {
    const db = tx || prisma;
    return await db.user.create({ data });
  }

  async findByAnyIdentifierAndRole(identifier: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier },
          { username: identifier },
          { identifier: identifier },
        ],
      },
      include: { role: true },
    });

    return user;
  }
}

export default new UserService();
