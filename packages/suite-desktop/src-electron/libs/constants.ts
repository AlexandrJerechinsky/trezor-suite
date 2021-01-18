import path from 'path';
import isDev from 'electron-is-dev';

export const PROTOCOL = 'file';

export const RESOURCES = isDev
    ? path.join(__dirname, '..', 'public', 'static')
    : process.resourcesPath;

export const MODULES = [
    { name: 'menu', dependencies: ['mainWindow'] },
    { name: 'shortcuts', dependencies: ['mainWindow', 'src'] },
    { name: 'request-filter', dependencies: ['mainWindow'] },
    { name: 'external-links', dependencies: ['mainWindow', 'store'] },
    { name: 'window-controls', dependencies: ['mainWindow', 'store'] },
    { name: 'http-receiver', dependencies: ['mainWindow', 'src'] },
    { name: 'metadata', dependencies: [] },
    { name: 'bridge', dependencies: [] },
    { name: 'tor', dependencies: ['mainWindow', 'store'] },
    { name: 'dev-tools', dependencies: ['mainWindow'], isDev: true },
    { name: 'csp', dependencies: ['mainWindow'], isDev: false },
    { name: 'file-protocol', dependencies: ['mainWindow', 'src'], isDev: false },
    { name: 'auto-updater', dependencies: ['mainWindow', 'store'], isDev: false },
];
