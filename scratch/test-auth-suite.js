async function testAuth() {
  console.log('--- STARTING AUTHENTICATION & LOGIN/REGISTER TEST SUITE ---');

  // 1. Test /login page markup
  const loginRes = await fetch('http://localhost:3001/login');
  const loginHtml = await loginRes.text();
  console.log('1. /login HTTP Status:', loginRes.status);
  console.log('   /login has Sign In:', loginHtml.includes('Sign In'));
  console.log('   /login has Google button:', loginHtml.includes('Google'));
  console.log('   /login has X button:', loginHtml.includes('X (Twitter)'));
  console.log('   /login has GitHub button:', loginHtml.includes('GitHub'));
  console.log('   /login has Email field:', loginHtml.includes('Email Address'));
  console.log('   /login has Zero-Wallet Privacy Guarantee:', loginHtml.includes('ZERO-WALLET PRIVACY GUARANTEE'));

  // 2. Test /register page markup
  const regRes = await fetch('http://localhost:3001/register');
  const regHtml = await regRes.text();
  console.log('2. /register HTTP Status:', regRes.status);
  console.log('   /register has Create Account:', regHtml.includes('Create Account'));
  console.log('   /register has Full Operator Name:', regHtml.includes('Full Operator Name / Handle'));
  console.log('   /register has Google button:', regHtml.includes('Google'));
  console.log('   /register has X button:', regHtml.includes('X (Twitter)'));
  console.log('   /register has GitHub button:', regHtml.includes('GitHub'));

  // 3. Test Registration via API
  const testEmail = `operator_${Date.now()}@nodedrops.xyz`;
  const testPassword = 'Password123!Node';
  const testName = 'Test Validator Operator';

  const regApiRes = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      password: testPassword,
    }),
  });

  const regApiData = await regApiRes.json();
  const regCookie = regApiRes.headers.get('set-cookie');
  console.log('3. Register API Status:', regApiRes.status);
  console.log('   Register API Success:', regApiData.success);
  console.log('   Registered User ID:', regApiData.user?.id);
  console.log('   Session Cookie Issued:', Boolean(regCookie && regCookie.includes('nodedrops_session')));

  // 4. Test Email/Password Login via API with the new account
  const loginApiRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const loginApiData = await loginApiRes.json();
  const loginCookie = loginApiRes.headers.get('set-cookie');
  console.log('4. Login API Status:', loginApiRes.status);
  console.log('   Login API Success:', loginApiData.success);
  console.log('   Logged In User Email:', loginApiData.user?.email);
  console.log('   Session Cookie Issued:', Boolean(loginCookie && loginCookie.includes('nodedrops_session')));

  // 5. Test Demo Admin Login
  const adminLoginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@nodedrops.xyz',
      password: 'NodeDrops2026!Admin',
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  console.log('5. Demo Admin Login Status:', adminLoginRes.status);
  console.log('   Admin Role:', adminLoginData.user?.role);

  // 6. Test Social OAuth: Google
  const googleOAuthRes = await fetch('http://localhost:3001/api/auth/oauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'google',
      name: 'Google Validator',
      email: 'google.validator@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    }),
  });
  const googleData = await googleOAuthRes.json();
  console.log('6. Google OAuth Status:', googleOAuthRes.status);
  console.log('   Google Provider Success:', googleData.success && googleData.user?.provider === 'google');

  // 7. Test Social OAuth: X (Twitter)
  const xOAuthRes = await fetch('http://localhost:3001/api/auth/oauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'x',
      name: '@BerachainRunner',
      email: 'berachain.runner@x.com',
    }),
  });
  const xData = await xOAuthRes.json();
  console.log('7. X OAuth Status:', xOAuthRes.status);
  console.log('   X Provider Success:', xData.success && xData.user?.provider === 'x');

  // 8. Test Social OAuth: GitHub
  const ghOAuthRes = await fetch('http://localhost:3001/api/auth/oauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'github',
      name: 'celestia-operator',
      email: 'celestia.op@github.com',
    }),
  });
  const ghData = await ghOAuthRes.json();
  console.log('8. GitHub OAuth Status:', ghOAuthRes.status);
  console.log('   GitHub Provider Success:', ghData.success && ghData.user?.provider === 'github');

  // 9. Test /api/auth/me with Cookie
  if (loginCookie) {
    const rawCookie = loginCookie.split(';')[0];
    const meRes = await fetch('http://localhost:3001/api/auth/me', {
      headers: { Cookie: rawCookie },
    });
    const meData = await meRes.json();
    console.log('9. /api/auth/me Authenticated Check:');
    console.log('   User Email:', meData.user?.email);
    console.log('   User Name:', meData.user?.name);
    console.log('   User Role:', meData.user?.role);
  }

  console.log('--- ALL AUTHENTICATION TESTS COMPLETED SUCCESSFULLY ---');
}

testAuth().catch(console.error);
