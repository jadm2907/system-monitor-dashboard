import { getLocalIP } from '../utils/helpers';

export const getNetworkInfo = async () => {
  const ip = await getLocalIP();
  
  return {
    ip: ip,
    connection: navigator.connection ? {
      type: navigator.connection.type,
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : null,
    bandwidth: Math.random() * 100,
    latency: Math.floor(Math.random() * 100),
    packetsSent: Math.floor(Math.random() * 1000),
    packetsReceived: Math.floor(Math.random() * 1000)
  };
};

export const getNetworkStats = async () => {
  return {
    bytesReceived: Math.floor(Math.random() * 1000000000),
    bytesSent: Math.floor(Math.random() * 100000000),
    downloadSpeed: Math.floor(Math.random() * 5000000),
    uploadSpeed: Math.floor(Math.random() * 1000000),
    connections: Math.floor(Math.random() * 150)
  };
};

export default {
  getNetworkInfo,
  getNetworkStats
};