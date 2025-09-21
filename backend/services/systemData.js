const { exec, execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const si = require('systeminformation');
const ps = require('ps-node');
const pidusage = require('pidusage');
const { promisify } = require('util');

const execPromise = promisify(exec);
const readFilePromise = promisify(fs.readFile);

class SystemDataService {
  // ========== INFORMACIÓN DEL SISTEMA ==========
  static async getSystemInfo() {
    try {
      const [osInfo, cpu, mem, currentLoad, time] = await Promise.all([
        si.osInfo(),
        si.cpu(),
        si.mem(),
        si.currentLoad(),
        si.time()
      ]);

      return {
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
        arch: osInfo.arch,
        hostname: osInfo.hostname,
        kernel: osInfo.kernel,
        codename: osInfo.codename,
        logofile: osInfo.logofile,
        serial: osInfo.serial,
        build: osInfo.build,
        servicepack: osInfo.servicepack,
        
        cpu: {
          manufacturer: cpu.manufacturer,
          brand: cpu.brand,
          vendor: cpu.vendor,
          family: cpu.family,
          model: cpu.model,
          stepping: cpu.stepping,
          revision: cpu.revision,
          speed: cpu.speed,
          speedMin: cpu.speedMin,
          speedMax: cpu.speedMax,
          cores: cpu.cores,
          physicalCores: cpu.physicalCores,
          processors: cpu.processors,
          cache: cpu.cache
        },
        
        memory: {
          total: mem.total,
          free: mem.free,
          used: mem.used,
          active: mem.active,
          available: mem.available,
          buffers: mem.buffers,
          cached: mem.cached,
          slab: mem.slab,
          buffcache: mem.buffcache,
          swaptotal: mem.swaptotal,
          swapused: mem.swapused,
          swapfree: mem.swapfree
        },
        
        load: {
          avgLoad: currentLoad.avgLoad,
          currentLoad: currentLoad.currentLoad,
          currentLoadUser: currentLoad.currentLoadUser,
          currentLoadSystem: currentLoad.currentLoadSystem,
          currentLoadNice: currentLoad.currentLoadNice,
          currentLoadIdle: currentLoad.currentLoadIdle,
          currentLoadIrq: currentLoad.currentLoadIrq,
          cpus: currentLoad.cpus
        },
        
        uptime: os.uptime(),
        time: {
          current: time.current,
          uptime: time.uptime,
          timezone: time.timezone,
          timezoneName: time.timezoneName
        },
        
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting system info:', error);
      throw error;
    }
  }

  // ========== INFORMACIÓN DE HARDWARE ==========
  static async getHardwareInfo() {
    try {
      const [
        baseboard,
        bios,
        chassis,
        graphics,
        usb,
        bluetooth,
        audio,
        printers,
        diskLayout,
        memLayout,
        networkInterfaces
      ] = await Promise.all([
        si.baseboard(),
        si.bios(),
        si.chassis(),
        si.graphics(),
        si.usb(),
        si.bluetooth(),
        si.audio(),
        si.printers(),
        si.diskLayout(),
        si.memLayout(),
        si.networkInterfaces()
      ]);

      return {
        baseboard,
        bios,
        chassis,
        graphics: {
          controllers: graphics.controllers,
          displays: graphics.displays
        },
        usb,
        bluetooth,
        audio,
        printers,
        diskLayout,
        memLayout,
        networkInterfaces,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting hardware info:', error);
      throw error;
    }
  }

  // ========== PROCESOS DEL SISTEMA ==========
  static async getProcesses(limit = 50) {
    try {
      const processes = await new Promise((resolve, reject) => {
        ps.lookup({}, (err, resultList) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Ordenar por uso de CPU y limitar
          const sortedProcesses = resultList
            .sort((a, b) => (b.cpu || 0) - (a.cpu || 0))
            .slice(0, limit)
            .map(proc => ({
              pid: proc.pid,
              name: proc.command,
              command: proc.arguments,
              cpu: parseFloat(proc.cpu) || 0,
              memory: parseFloat(proc.memory) || 0,
              vsz: proc.vsz,
              rss: proc.rss,
              user: proc.user,
              started: proc.started,
              priority: proc.priority,
              nice: proc.nice,
              state: proc.state,
              tty: proc.tty,
              parent: proc.parent
            }));

          resolve(sortedProcesses);
        });
      });

      // Obtener uso detallado por proceso
      const processesWithUsage = await Promise.all(
        processes.map(async proc => {
          try {
            const usage = await pidusage(proc.pid);
            return {
              ...proc,
              cpu: usage.cpu,
              memory: usage.memory,
              elapsed: usage.elapsed,
              timestamp: usage.timestamp
            };
          } catch (error) {
            return proc; // Si falla, mantener los datos básicos
          }
        })
      );

      return processesWithUsage;
    } catch (error) {
      console.error('Error getting processes:', error);
      throw error;
    }
  }

  // ========== USO DE CPU ==========
  static async getCpuUsage() {
    try {
      const [currentLoad, cpuTemperature] = await Promise.all([
        si.currentLoad(),
        si.cpuTemperature()
      ]);

      return {
        avgLoad: currentLoad.avgLoad,
        currentLoad: currentLoad.currentLoad,
        currentLoadUser: currentLoad.currentLoadUser,
        currentLoadSystem: currentLoad.currentLoadSystem,
        currentLoadNice: currentLoad.currentLoadNice,
        currentLoadIdle: currentLoad.currentLoadIdle,
        currentLoadIrq: currentLoad.currentLoadIrq,
        cpus: currentLoad.cpus,
        temperature: cpuTemperature,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting CPU usage:', error);
      throw error;
    }
  }

  // ========== USO DE MEMORIA ==========
  static async getMemoryUsage() {
    try {
      const mem = await si.mem();
      
      return {
        total: mem.total,
        free: mem.free,
        used: mem.used,
        active: mem.active,
        available: mem.available,
        buffers: mem.buffers,
        cached: mem.cached,
        slab: mem.slab,
        buffcache: mem.buffcache,
        swaptotal: mem.swaptotal,
        swapused: mem.swapused,
        swapfree: mem.swapfree,
        usage: ((mem.used / mem.total) * 100).toFixed(2),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting memory usage:', error);
      throw error;
    }
  }

  // ========== USO DE DISCO ==========
  static async getDiskUsage() {
    try {
      const [fsSize, blockDevices, disksIO] = await Promise.all([
        si.fsSize(),
        si.blockDevices(),
        si.disksIO()
      ]);

      return {
        filesystems: fsSize,
        blockDevices,
        diskIO: disksIO,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting disk usage:', error);
      throw error;
    }
  }

  // ========== INFORMACIÓN DE RED ==========
  static async getNetworkStats() {
    try {
      const [networkStats, networkConnections, defaultGateway] = await Promise.all([
        si.networkStats(),
        si.networkConnections(),
        si.networkGatewayDefault()
      ]);

      // Obtener IP pública
      let publicIP = 'N/A';
      try {
        const { stdout } = await execPromise('curl -s ifconfig.me');
        publicIP = stdout.trim();
      } catch (error) {
        console.warn('Could not get public IP:', error.message);
      }

      return {
        interfaces: networkStats,
        connections: networkConnections,
        gateway: defaultGateway,
        publicIP,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting network stats:', error);
      throw error;
    }
  }

  // ========== INFORMACIÓN DE SEGURIDAD ==========
  static async getSecurityInfo() {
    try {
      const [users, packages, services] = await Promise.all([
        si.users(),
        si.versions(),
        si.services('*')
      ]);

      // Verificar firewalls
      const firewallStatus = await this.checkFirewallStatus();
      
      // Verificar updates disponibles
      const updates = await this.checkSystemUpdates();

      return {
        users,
        installedPackages: packages,
        services: services.list,
        firewall: firewallStatus,
        updates,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting security info:', error);
      throw error;
    }
  }

  // ========== ESTADO DEL FIREWALL ==========
  static async checkFirewallStatus() {
    try {
      // Verificar UFW (Ubuntu/Debian)
      try {
        const { stdout } = await execPromise('sudo ufw status');
        return {
          active: stdout.includes('Status: active'),
          name: 'UFW',
          status: stdout
        };
      } catch (error) {
        // Verificar iptables
        const { stdout } = await execPromise('sudo iptables -L');
        return {
          active: stdout.length > 0,
          name: 'iptables',
          status: 'Active rules present'
        };
      }
    } catch (error) {
      return {
        active: false,
        name: 'unknown',
        status: 'Unable to determine firewall status',
        error: error.message
      };
    }
  }

  // ========== ACTUALIZACIONES DEL SISTEMA ==========
  static async checkSystemUpdates() {
    try {
      // Para Debian/Ubuntu
      const { stdout } = await execPromise('apt list --upgradable 2>/dev/null | wc -l');
      const upgradableCount = parseInt(stdout.trim()) - 1; // Restar la línea de encabezado
      
      return {
        upgradable: upgradableCount > 0,
        count: upgradableCount > 0 ? upgradableCount : 0,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        upgradable: false,
        count: 0,
        error: error.message,
        lastChecked: new Date().toISOString()
      };
    }
  }

  // ========== INFORMACIÓN DE TEMPERATURAS ==========
  static async getTemperatures() {
    try {
      const temperatures = await si.cpuTemperature();
      return {
        main: temperatures.main,
        cores: temperatures.cores,
        max: temperatures.max,
        socket: temperatures.socket,
        chipset: temperatures.chipset,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting temperatures:', error);
      throw error;
    }
  }

  // ========== INFORMACIÓN DE BATERÍA ==========
  static async getBatteryInfo() {
    try {
      const battery = await si.battery();
      return {
        hasBattery: battery.hasBattery,
        cycleCount: battery.cycleCount,
        isCharging: battery.isCharging,
        designedCapacity: battery.designedCapacity,
        maxCapacity: battery.maxCapacity,
        currentCapacity: battery.currentCapacity,
        capacityUnit: battery.capacityUnit,
        voltage: battery.voltage,
        percent: battery.percent,
        timeRemaining: battery.timeRemaining,
        acConnected: battery.acConnected,
        type: battery.type,
        model: battery.model,
        manufacturer: battery.manufacturer,
        serial: battery.serial,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting battery info:', error);
      throw error;
    }
  }

  // ========== ESTADÍSTICAS DEL SISTEMA ==========
  static async getSystemStats() {
    try {
      const [
        cpuUsage,
        memoryUsage,
        diskUsage,
        networkStats,
        processes
      ] = await Promise.all([
        this.getCpuUsage(),
        this.getMemoryUsage(),
        this.getDiskUsage(),
        this.getNetworkStats(),
        this.getProcesses(10) // Solo 10 procesos para stats
      ]);

      return {
        cpu: cpuUsage,
        memory: memoryUsage,
        disk: diskUsage,
        network: networkStats,
        topProcesses: processes,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw error;
    }
  }

  // ========== TERMINAR PROCESO ==========
  static async terminateProcess(pid) {
    try {
      await execPromise(`kill -9 ${pid}`);
      return {
        success: true,
        message: `Process ${pid} terminated successfully`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to terminate process ${pid}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ========== HELPERS ==========
  static bytesToGB(bytes) {
    return (bytes / 1024 / 1024 / 1024).toFixed(2);
  }

  static bytesToMB(bytes) {
    return (bytes / 1024 / 1024).toFixed(2);
  }

  static formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  }
}

module.exports = SystemDataService;