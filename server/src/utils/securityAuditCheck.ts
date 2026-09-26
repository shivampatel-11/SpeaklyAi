import http from 'http'

async function request(options: http.RequestOptions, body?: any): Promise<{ statusCode?: number; headers: http.IncomingHttpHeaders; body: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: JSON.parse(data) })
        } catch {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: data })
        }
      })
    })
    req.on('error', reject)
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body))
    }
    req.end()
  })
}

async function runSecurityTests() {
  console.log('--- Starting Speakly AI Security Hardening Audit ---')
  let passed = 0
  let failed = 0

  function assert(name: string, condition: boolean) {
    if (condition) {
      console.log(`[PASS] ${name}`)
      passed++
    } else {
      console.error(`[FAIL] ${name}`)
      failed++
    }
  }

  try {
    // 1. Test Security Headers
    const health = await request({
      hostname: '127.0.0.1',
      port: 3001,
      path: '/api/health',
      method: 'GET',
    })
    assert('Security header X-Content-Type-Options is nosniff', health.headers['x-content-type-options'] === 'nosniff')
    assert('Security header X-Frame-Options is DENY', health.headers['x-frame-options'] === 'DENY')
    assert('Content-Security-Policy header is present', Boolean(health.headers['content-security-policy']))
    assert('X-Powered-By header is removed/hidden', !health.headers['x-powered-by'])

    // 2. Test Invalid Login
    const invalidLogin = await request(
      {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'nonexistent@example.com', password: 'wrongpassword123' }
    )
    assert('Invalid login returns 401 Unauthorized', invalidLogin.statusCode === 401)
    assert('Invalid login returns generic safe error without user enumeration', invalidLogin.body.error === 'Invalid email or password.')

    // 3. Test Weak Password Rejection on Signup
    const weakPassword = await request(
      {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/api/auth/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Test User', email: 'test@example.com', password: '123' }
    )
    assert('Signup with short password returns 400 Bad Request', weakPassword.statusCode === 400)

    // 4. Test Malformed Email on Signup
    const badEmail = await request(
      {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/api/auth/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Test User', email: 'not-an-email', password: 'ValidPassword123' }
    )
    assert('Signup with invalid email returns 400 Bad Request', badEmail.statusCode === 400)

    // 5. Test AI Message Oversize (>1000 characters)
    const oversizeMessage = await request(
      {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/api/conversations/message',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { sessionId: 'sess_valid_sample_id_123', userText: 'a'.repeat(1200) }
    )
    assert('Oversize conversation message (>1000 chars) returns 400 Bad Request', oversizeMessage.statusCode === 400)

    // 6. Test BOLA / IDOR Protection on Progress
    const idorCheck = await request({
      hostname: '127.0.0.1',
      port: 3001,
      path: '/api/progress/usr_alex_rivera',
      method: 'GET',
    })
    assert('Unauthorized query to another user progress returns 403 Forbidden', idorCheck.statusCode === 403)

    console.log(`\nSecurity Test Results: ${passed} passed, ${failed} failed.`)
  } catch (err) {
    console.error('Security test encountered execution error:', err)
  }
}

runSecurityTests()
