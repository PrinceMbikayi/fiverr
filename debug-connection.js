// Script de débogage pour tester la connectivité réseau
const https = require('https');
const http = require('http');

// Configuration des serveurs à tester (URLs réelles de l'app)
const servers = {
  PRODUCTION: 'https://calypshome.avidsen.one',
  PREPROD: 'https://preprod.calypshome.com',
  DEV_PROFALUX: 'https://profalux.avidsen.one',
  DEV_LOCAL: 'http://10.0.2.2:3000',
  LOCALHOST: 'http://127.0.0.1:3000'
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      timeout: options.timeout || 5000,
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Timeout')));
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testConnectivity() {
  console.log('🔍 Démarrage des tests de connectivité réseau...\n');
  
  // Test 1: Connectivité Internet de base
  console.log('📡 Test 1: Connectivité Internet de base');
  try {
    const response = await makeRequest('https://httpbin.org/get', { timeout: 10000 });
    console.log('✅ Internet accessible:', response.status);
  } catch (error) {
    console.log('❌ Pas d\'accès Internet:', error.message);
  }
  
  // Test 2: Serveurs de l'application
  console.log('\n🏠 Test 2: Serveurs de l\'application');
  
  for (const [name, url] of Object.entries(servers)) {
    try {
      const response = await makeRequest(url + '/health', { timeout: 5000 });
      console.log(`✅ ${name} (${url}) accessible:`, response.status);
    } catch (error) {
      console.log(`❌ ${name} (${url}) inaccessible:`, error.message);
    }
  }
  
  // Test 3: Endpoints API spécifiques
  console.log('\n🌐 Test 3: Endpoints API spécifiques');
  
  const endpoints = [
    '/services/durin/login',
    '/services/durin/my/objects',
    '/services/durin/notifications',
    '/services/durin/my/rooms'
  ];
  
  for (const [name, baseUrl] of Object.entries(servers)) {
    console.log(`\n--- Tests pour ${name} ---`);
    
    for (const endpoint of endpoints) {
      try {
        const response = await makeRequest(baseUrl + endpoint, { 
          timeout: 5000,
          method: endpoint.includes('login') ? 'POST' : 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: endpoint.includes('login') ? JSON.stringify({
            email: 'test@example.com',
            password: 'test123'
          }) : undefined
        });
        console.log(`✅ ${endpoint}:`, response.status);
      } catch (error) {
        console.log(`❌ ${endpoint}:`, error.message);
      }
    }
  }
  
  // Test 4: Configuration réseau Android
  console.log('\n📱 Test 4: Configuration réseau Android');
  console.log('Adresses testées pour émulateur Android:');
  console.log('- 10.0.2.2:3000 (adresse standard émulateur)');
  console.log('- 127.0.0.1:3000 (localhost)');
  console.log('- localhost:3000 (nom d\'hôte)');
  
  console.log('\n🏁 Tests terminés');
  console.log('\n💡 Recommandations:');
  console.log('1. Si aucun serveur local n\'est accessible, démarrez un serveur de développement');
  console.log('2. Si seule la production fonctionne, utilisez l\'API de production pour les tests');
  console.log('3. Vérifiez que l\'émulateur Android a accès au réseau');
  console.log('4. Testez le bouton de débogage dans l\'application (5 taps sur le logo)');
}

testConnectivity().catch(console.error);