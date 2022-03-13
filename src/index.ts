import { Router } from 'itty-router'
import { parseDate } from 'chrono-node'

const router = Router()

interface NaturalDateParseRequest {
  naturalDate?: string
}

router.post('/naturaldate/parse', async (request: Request) => {
  const body = (await request.json()) as NaturalDateParseRequest
  if (!body?.naturalDate) {
    return new Response('', {
      status: 400,
    })
  }

  const parsedDate = parseDate(body.naturalDate)
  const response = {
    input: body.naturalDate,
    output: parsedDate?.toISOString() ?? null,
  }
  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

router.all('*', () => {
  return new Response('Not found', {
    status: 404,
  })
})

export default {
  async fetch(request: Request) {
    return router.handle(request)
  },
}
