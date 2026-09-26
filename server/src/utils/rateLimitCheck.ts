import http from 'http'

async function postLogin(): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => {
        res.resume()
        resolve(res.statusCode || 500)
      }
    )
    req.on('error', reject)
    req.write(JSON.stringify({ email: 'test@example.com', password: 'Password123' }))
    req.end()
  })
}

async function testRateLimit() {
  console.log('Sending 18 consecutive login attempts to verify rate limit trigger...')
  const statuses: number[] = []
  for (let i = 0; i < 18; i++) {
    const status = await postLogin()
    statuses.push(status)
  }

  const has429 = statuses.includes(429)
  console.log(`Statuses received: ${statuses.slice(0, 5).join(', ')} ... ${statuses.slice(-3).join(', ')}`)
  if (has429) {
    console.log('[PASS] Rate limiter triggered 429 Too Many Requests as expected.')
  } else {
    console.error('[FAIL] Rate limiter did not trigger 429.')
  }
}

testRateLimit()
