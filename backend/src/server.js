require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Establish database connection first
    await connectDB();

    // 2. Start Express Server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log('🚀 [Explore India Smartly] Backend Server is running!');
      console.log(`- Port: ${PORT}`);
      console.log(`- Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('💥 Fatal Server Error during startup:', err);
    process.exit(1);
  }
};

startServer();