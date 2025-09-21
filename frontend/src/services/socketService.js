import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.isConnected) return this.socket;
    
    this.socket = io('http://localhost:5000');
    
    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor de datos en tiempo real');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('❌ Error de conexión:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  onRealTimeData(callback) {
    if (this.socket) {
      this.socket.on('real-time-data', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new SocketService();