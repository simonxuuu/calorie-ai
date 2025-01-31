
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    console.log(searchParams)
    const date = searchParams.get('date')
    
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