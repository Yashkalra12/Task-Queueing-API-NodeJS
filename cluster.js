const cluster = require('cluster');
const numCPUs = 2;  // Two replicas
const app = require('./src/app');  // Import the main app

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();  // Create worker processes
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();  // Restart the worker if it crashes
  });
} else {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });
}
