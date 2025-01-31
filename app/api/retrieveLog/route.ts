import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tempId: string = "7c3e750f-f1b9-46ac-a8b5-66bb58c48280"

async function getFoodEntriesForDate(userId: string, date: string) {
    // Convert the date string
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // next day to filter by range
  
    const foodEntries = await prisma.snap.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate, // Start 
          lt: endDate, // Before next day
        },
      },
      orderBy: { createdAt: "asc" }, // sort by time
    });
  
    return foodEntries;
  }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    console.log(searchParams)
    const date = searchParams.get('date')

    getFoodEntriesForDate(tempId, date)
    
    if (!date) {
      return Response.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    let logs = {
      date: date,
      entries: [
        { food: 'Oatmeal', calories: 150 },
        { food: 'Banana', calories: 105 }
      ]
    }

    return Response.json(logs)

  } catch (error) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}