import { prisma } from "@/app/utils/prisma";

export default async function findUserDB (user) {
  return await prisma.user.findUnique({
    omit: {
      id: true,
    },
    where: {
      id: user.id,
    },
  });
}
