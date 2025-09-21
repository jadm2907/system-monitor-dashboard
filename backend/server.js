const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const systemData = require('./services/systemData'); // Importar el servicio

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de API usando el servicio
app.get('/api/system-info', async (req, res) => {
  try {
    const systemInfo = await systemData.getSystemInfo();
    res.json(systemInfo);
  } catch (error) {
    console.error('Error getting system info:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/processes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const processes = await systemData.getProcessesDetails(limit);
    res.json(processes);
  } catch (error) {
    console.error('Error getting processes:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/network-stats', async (req, res) => {
  try {
    const networkStats = await si.networkStats();
    res.json(networkStats);
  } catch (error) {
    console.error('Error getting network stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/disk-usage', async (req, res) => {
  try {
    const diskUsage = await systemData.getDiskUsage();
    res.json(diskUsage);
  } catch (error) {
    console.error('Error getting disk usage:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/network-connections', async (req, res) => {
  try {
    const connections = await systemData.getNetworkConnections();
    res.json(connections);
  } catch (error) {
    console.error('Error getting network connections:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/system-health', async (req, res) => {
  try {
    const health = await systemData.getSystemHealth();
    res.json(health);
  } catch (error) {
    console.error('Error getting system health:', error);
    res.status(500).json({ error: error.message });
  }
});

// Socket.io para datos en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado para datos en tiempo real');
  
  const sendRealTimeData = async () => {
    try {
      const realTimeData = await systemData.getRealTimeData();
      socket.emit('real-time-data', realTimeData);
    } catch (error) {
      console.error('Error obteniendo datos en tiempo real:', error);
    }
  };

  // Enviar datos cada 2 segundos
  const interval = setInterval(sendRealTimeData, 2000);
  
  // Enviar datos inmediatamente al conectar
  sendRealTimeData();

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
  });

  socket.on('force-refresh', async () => {
    systemData.clearCache();
    const systemInfo = await systemData.getSystemInfo();
    socket.emit('system-info-updated', systemInfo);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api/system-info`);
});