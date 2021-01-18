import { app } from 'electron';
import electronLocalshortcut from 'electron-localshortcut';

const init = ({ mainWindow, src, logger }: Dependencies) => {
    electronLocalshortcut.register(mainWindow, 'CommandOrControl+Alt+I', () => {
        logger.debug('Shortcuts', 'CTRL+ALT+I pressed');
        mainWindow.webContents.openDevTools();
    });

    electronLocalshortcut.register(mainWindow, 'F5', () => {
        logger.debug('Shortcuts', 'F5 pressed');
        mainWindow.loadURL(src);
    });

    electronLocalshortcut.register(mainWindow, 'CommandOrControl+R', () => {
        logger.debug('Shortcuts', 'CTRL+R pressed');
        mainWindow.loadURL(src);
    });

    app.on('before-quit', () => {
        electronLocalshortcut.unregisterAll(mainWindow);
    });
};

export default init;
