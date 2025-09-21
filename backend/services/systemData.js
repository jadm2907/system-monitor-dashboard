const si = require('systeminformation');

class SystemDataService {
  constructor() {
    this.cache = {
      systemInfo: null,
      lastUpdate: null,
      cacheDuration: 30000 // 30 segundos
    };
  }

  async getSystemInfo() {
    const now = Date.now();
    
    // Usar cache si está fresco
    if (this.cache.systemInfo && (now - this.cache.lastUpdate) < this.cache.duration) {
      return this.cache.systemInfo;
    }

    try {
      const [
        cpu, memory, osInfo, diskLayout, 
        networkInterfaces, battery, versions,
        graphics, bios, baseboard
      ] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.osInfo(),
        si.diskLayout(),
        si.networkInterfaces(),
        si.battery().catch(() => ({})),
        si.versions(),
        si.graphics().catch(() => ({})),
        si.bios().catch(() => ({})),
        si.baseboard().catch(() => ({}))
      ]);

      const systemInfo = {
        cpu: {
          manufacturer: cpu.manufacturer,
          brand: cpu.brand,
          speed: cpu.speed,
          cores: cpu.cores,
          physicalCores: cpu.physicalCores,
          processors: cpu.processors,
          socket: cpu.socket
        },
        memory: {
          total: memory.total,
          free: memory.free,
          used: memory.used,
          active: memory.active,
          available: memory.available,
          swapTotal: memory.swaptotal,
          swapUsed: memory.swapused,
          swapFree: memory.swapfree
        },
        os: {
          platform: osInfo.platform,
          distro: osInfo.distro,
          release: osInfo.release,
          arch: osInfo.arch,
          hostname: osInfo.hostname,
          codename: osInfo.codename,
          kernel: osInfo.kernel,
          build: osInfo.build,
          servicepack: osInfo.servicepack,
          logofile: osInfo.logofile,
          serial: osInfo.serial,
          uefi: osInfo.uefi
        },
        disks: diskLayout.map(disk => ({
          device: disk.device,
          type: disk.type,
          name: disk.name,
          vendor: disk.vendor,
          size: disk.size,
          bytesPerSector: disk.bytesPerSector,
          totalCylinders: disk.totalCylinders,
          totalHeads: disk.totalHeads,
          totalSectors: disk.totalSectors,
          totalTracks: disk.totalTracks,
          tracksPerCylinder: disk.tracksPerCylinder
        })),
        network: networkInterfaces.map(nic => ({
          iface: nic.iface,
          ifaceName: nic.ifaceName,
          ip4: nic.ip4,
          ip4subnet: nic.ip4subnet,
          ip6: nic.ip6,
          ip6subnet: nic.ip6subnet,
          mac: nic.mac,
          internal: nic.internal,
          virtual: nic.virtual,
          operstate: nic.operstate,
          type: nic.type,
          duplex: nic.duplex,
          mtu: nic.mtu,
          speed: nic.speed
        })),
        battery: battery,
        versions: versions,
        graphics: graphics,
        bios: bios,
        baseboard: baseboard,
        timestamp: new Date().toISOString()
      };

      // Actualizar cache
      this.cache.systemInfo = systemInfo;
      this.cache.lastUpdate = now;

      return systemInfo;

    } catch (error) {
      console.error('Error obteniendo información del sistema:', error);
      throw error;
    }
  }

  async getRealTimeData() {
    try {
      const [
        currentLoad, mem, networkStats, 
        temperature, diskIO, processes
      ] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.networkStats(),
        si.cpuTemperature(),
        si.disksIO().catch(() => ({ rIO: 0, wIO: 0, tIO: 0 })),
        si.processes().catch(() => ({ list: [] }))
      ]);

      return {
        cpu: {
          usage: currentLoad.currentload,
          user: currentLoad.currentload_user,
          system: currentLoad.currentload_system,
          idle: currentLoad.currentload_idle,
          nice: currentLoad.currentload_nice,
          irq: currentLoad.currentload_irq,
          raw: currentLoad.raw_currentload
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          active: mem.active,
          available: mem.available,
          buffers: mem.buffers,
          cached: mem.cached,
          slab: mem.slab,
          buffcache: mem.buffcache,
          swaptotal: mem.swaptotal,
          swapused: mem.swapused,
          swapfree: mem.swapfree,
          usage: ((mem.used / mem.total) * 100)
        },
        network: networkStats[0] || {
          iface: 'unknown',
          operstate: 'unknown',
          rx_bytes: 0,
          tx_bytes: 0,
          rx_sec: 0,
          tx_sec: 0,
          ms: 0
        },
        temperature: {
          main: temperature.main,
          cores: temperature.cores,
          max: temperature.max,
          socket: temperature.socket,
          chipset: temperature.chipset
        },
        diskIO: {
          rIO: diskIO.rIO || 0,
          wIO: diskIO.wIO || 0,
          tIO: diskIO.tIO || 0,
          rIO_sec: diskIO.rIO_sec || 0,
          wIO_sec: diskIO.wIO_sec || 0,
          tIO_sec: diskIO.tIO_sec || 0
        },
        processes: {
          total: processes.list.length,
          running: processes.list.filter(p => p.state === 'running').length,
          sleeping: processes.list.filter(p => p.state === 'sleeping').length,
          zombie: processes.list.filter(p => p.state === 'zombie').length,
          stopped: processes.list.filter(p => p.state === 'stopped').length
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error obteniendo datos en tiempo real:', error);
      throw error;
    }
  }

  async getProcessesDetails(limit = 50) {
    try {
      const processes = await si.processes();
      return processes.list
        .sort((a, b) => (b.cpu || 0) - (a.cpu || 0))
        .slice(0, limit)
        .map(process => ({
          pid: process.pid,
          name: process.name,
          cpu: process.cpu,
          memory: process.mem,
          priority: process.priority,
          memVsz: process.mem_vsz,
          memRss: process.mem_rss,
          nice: process.nice,
          started: process.started,
          state: process.state,
          tty: process.tty,
          user: process.user,
          command: process.command
        }));
    } catch (error) {
      console.error('Error obteniendo procesos:', error);
      throw error;
    }
  }

  async getDiskUsage() {
    try {
      const fsSize = await si.fsSize();
      return fsSize.map(fs => ({
        fs: fs.fs,
        type: fs.type,
        size: fs.size,
        used: fs.used,
        available: fs.available,
        use: fs.use,
        mount: fs.mount
      }));
    } catch (error) {
      console.error('Error obteniendo uso de disco:', error);
      throw error;
    }
  }

  async getNetworkConnections() {
    try {
      const connections = await si.networkConnections();
      return connections.map(conn => ({
        protocol: conn.protocol,
        localAddress: conn.localAddress,
        localPort: conn.localPort,
        peerAddress: conn.peerAddress,
        peerPort: conn.peerPort,
        state: conn.state,
        pid: conn.pid
      }));
    } catch (error) {
      console.error('Error obteniendo conexiones de red:', error);
      throw error;
    }
  }

  async getSystemHealth() {
    try {
      const [currentLoad, mem, temperature] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.cpuTemperature()
      ]);

      return {
        cpu: {
          usage: currentLoad.currentload,
          temperature: temperature.main,
          status: temperature.main > 80 ? 'critical' : temperature.main > 70 ? 'warning' : 'normal'
        },
        memory: {
          usage: (mem.used / mem.total) * 100,
          status: (mem.used / mem.total) > 90 ? 'critical' : (mem.used / mem.total) > 80 ? 'warning' : 'normal'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo salud del sistema:', error);
      throw error;
    }
  }

  clearCache() {
    this.cache.systemInfo = null;
    this.cache.lastUpdate = null;
  }
}

module.exports = new SystemDataService();