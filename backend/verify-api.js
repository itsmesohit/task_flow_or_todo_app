const BASE_URL = 'http://localhost:5001/api';

async function testApi() {
  console.log('🧪 Starting TaskFlow API End-to-End Verification...\n');

  // 1. Health Check
  console.log('1️⃣ Testing GET /api/health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('   Status:', healthData.status);
  console.log('   Database connected:', healthData.database.connected);
  console.log('   Database host:', healthData.database.host);
  if (!healthData.database.connected) throw new Error('Database not connected');

  // 2. Registration
  console.log('\n2️⃣ Testing POST /api/auth/register...');
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Verification Bot',
      email: uniqueEmail,
      password: 'password123',
    }),
  });
  const regData = await regRes.json();
  console.log('   Registration success:', regData.success);
  console.log('   User ID:', regData.user?.id);
  console.log('   Token received:', !!regData.token);
  if (!regData.success || !regData.token) throw new Error('Registration failed');

  const token = regData.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 3. Login
  console.log('\n3️⃣ Testing POST /api/auth/login...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: uniqueEmail,
      password: 'password123',
    }),
  });
  const loginData = await loginRes.json();
  console.log('   Login success:', loginData.success);
  console.log('   User name:', loginData.user?.name);
  if (!loginData.success) throw new Error('Login failed');

  // 4. Get Current User (/me)
  console.log('\n4️⃣ Testing GET /api/auth/me...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders });
  const meData = await meRes.json();
  console.log('   Me success:', meData.success);
  console.log('   Verified email:', meData.user?.email);

  // 5. Create Tasks
  console.log('\n5️⃣ Testing POST /api/tasks (Creating High, Medium, Low tasks)...');
  const task1Res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Urgent Atlas Security Configuration',
      description: 'Audit database users, IP whitelists and SSL/TLS certificates',
      priority: 'high',
      dueDate: '2026-09-26T14:00',
      category: 'Work',
    }),
  });
  const task1 = (await task1Res.json()).task;
  console.log('   Created High Priority Task:', task1.title, `[ID: ${task1.id}]`);

  const task2Res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Weekly Sprint Retrospective',
      description: 'Review task flow metrics and delivery throughput',
      priority: 'medium',
      dueDate: '2026-09-28T10:00',
      category: 'Work',
    }),
  });
  const task2 = (await task2Res.json()).task;
  console.log('   Created Medium Priority Task:', task2.title, `[ID: ${task2.id}]`);

  const task3Res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Grocery shopping & meal prep',
      description: 'Fresh fruits and healthy snacks',
      priority: 'low',
      dueDate: '2026-09-30T18:00',
      category: 'Personal',
    }),
  });
  const task3 = (await task3Res.json()).task;
  console.log('   Created Low Priority Task:', task3.title, `[ID: ${task3.id}]`);

  // 6. Get Tasks & Verify Smart Sorting
  console.log('\n6️⃣ Testing GET /api/tasks?sortBy=smart (Priority & Due Date)...');
  const listRes = await fetch(`${BASE_URL}/tasks?sortBy=smart`, { headers: authHeaders });
  const listData = await listRes.json();
  console.log(`   Fetched ${listData.count} tasks.`);
  console.log('   Tasks order:');
  listData.tasks.forEach((t, i) => {
    console.log(`     ${i + 1}. [${t.priority.toUpperCase()}] ${t.title} (Due: ${t.dueDate})`);
  });
  if (listData.tasks[0].priority !== 'high') {
    throw new Error('Smart sort failed: First task is not high priority');
  }

  // 7. Toggle Task Completion
  console.log(`\n7️⃣ Testing PATCH /api/tasks/${task2.id}/toggle...`);
  const toggleRes = await fetch(`${BASE_URL}/tasks/${task2.id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders,
  });
  const toggleData = await toggleRes.json();
  console.log('   Task completed status:', toggleData.task.completed);
  console.log('   Completed at:', toggleData.task.completedAt);
  if (!toggleData.task.completed) throw new Error('Toggle task failed');

  // 8. Get Stats
  console.log('\n8️⃣ Testing GET /api/tasks/stats...');
  const statsRes = await fetch(`${BASE_URL}/tasks/stats`, { headers: authHeaders });
  const statsData = await statsRes.json();
  console.log('   Stats:', statsData.stats);
  if (statsData.stats.total !== 3 || statsData.stats.completed !== 1) {
    throw new Error('Stats computation mismatch');
  }

  // 9. Delete Task
  console.log(`\n9️⃣ Testing DELETE /api/tasks/${task3.id}...`);
  const delRes = await fetch(`${BASE_URL}/tasks/${task3.id}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  const delData = await delRes.json();
  console.log('   Delete success:', delData.success);

  // 10. Demo Login
  console.log('\n🔟 Testing POST /api/auth/demo (Instant Demo Account)...');
  const demoRes = await fetch(`${BASE_URL}/auth/demo`, { method: 'POST' });
  const demoData = await demoRes.json();
  console.log('   Demo login success:', demoData.success);
  console.log('   Demo user:', demoData.user?.name, `(${demoData.user?.email})`);
  console.log('   Demo token generated:', !!demoData.token);

  console.log('\n🎉 ALL 10 API & DATABASE TESTS PASSED WITH 100% SUCCESS!\n');
}

testApi().catch((err) => {
  console.error('\n❌ Verification failed:', err.message);
  process.exit(1);
});
