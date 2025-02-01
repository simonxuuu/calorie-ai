import { prisma } from "@/app/utils/prisma";

export default async function createDefaultUserDB (user){
    return await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          snaps: {
            create: [],
          },
        },
    });
}