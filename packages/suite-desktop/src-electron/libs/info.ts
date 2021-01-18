import { app } from 'electron';
import isDev from 'electron-is-dev';
import si from 'systeminformation';

import Logger from '@lib/logger';
import { b2t } from '@lib/utils';
import { toHumanReadable } from '@suite/utils/suite/file';

export const buildInfo = () => {
    const logger = Logger.getInstance();
    if (!logger) {
        return;
    }

    logger.info('Build', [
        'Info:',
        `- Version: ${app.getVersion()}`,
        `- Commit: ${process.env.COMMITHASH}`,
        `- Dev: ${b2t(isDev)}`,
        `- Args: ${process.argv.slice(1).join(' ')}`,
        `- CWD: ${process.cwd()}`,
    ]);
};

export const computerInfo = async () => {
    const logger = Logger.getInstance();
    if (!logger && logger.level !== 'debug') {
        return;
    }

    const { system, cpu, mem, osInfo } = await si.get({
        system: 'manufacturer, model, virtual',
        cpu: 'manufacturer, brand, processors, physicalCores, cores, speed',
        mem: 'total',
        osInfo: 'platform, arch, distro, release',
    });

    logger.debug('Computer', [
        'Info:',
        `- Platform: ${osInfo.platform} ${osInfo.arch}`,
        `- OS: ${osInfo.distro} ${osInfo.release}`,
        `- Manufacturer: ${system.manufacturer}`,
        `- Model: ${system.model}`,
        `- Virtual: ${b2t(system.virtual)}`,
        `- CPU: ${cpu.manufacturer} ${cpu.brand}`,
        `- Cores: ${cpu.processors}x${cpu.physicalCores}(+${cpu.cores - cpu.physicalCores}) @ ${
            cpu.speed
        }GHz`,
        `- RAM: ${toHumanReadable(mem.total)}`,
    ]);
};
