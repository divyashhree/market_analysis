const app = require('./app');
const websocketService = require('./services/websocketService');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║   🌍 Global Market Analyzer API Server v2.0                  ║
║   ──────────────────────────────────────────────────────────  ║
║   🚀 HTTP: http://localhost:${PORT}                              ║
║   🔌 WebSocket: ws://localhost:${PORT}/ws                        ║
║   🌐 Environment: ${(process.env.NODE_ENV || 'development').padEnd(12)}                       ║
║   ──────────────────────────────────────────────────────────  ║
║   Features: Real-time updates, Social, AI Chat, 35+ countries ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Initialize WebSocket server
websocketService.initialize(server);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  websocketService.shutdown();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Closing server gracefully...');
  websocketService.shutdown();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
