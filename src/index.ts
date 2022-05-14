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
  const responseObj = {
    input: body.naturalDate,
    output: parsedDate?.toISOString() ?? null,
  }
  const response = new Response(JSON.stringify(responseObj), {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  response.headers.set('Access-Control-Allow-Origin', '*')

  return response
})

router.get('/datetime/utcnow', (request) => {
  const utcNowResponse = {
    utcNow: new Date().toISOString(),
  }
  return new Response(JSON.stringify(utcNowResponse), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

router.options('*', (request: Request) => {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    // Cloudflare supports the GET, POST, HEAD, and OPTIONS methods from any origin,
    // and allow any header on requests. These headers must be present
    // on all responses to all CORS preflight requests. In practice, this means
    // all responses to OPTIONS requests.
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
      'Access-Control-Max-Age': '86400',
    }

    let respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Headers': request.headers.get(
        'Access-Control-Request-Headers',
      ),
    }

    return new Response(null, {
      headers: respHeaders,
    })
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
})

router.all('*', () => {
  return new Response('Not found', {
    status: 404,
  })
})

export default {
  fetch: router.handle,
}
