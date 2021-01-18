/**
 * Enable development tools
 */
const init = ({ mainWindow, logger }: Dependencies) => {
    mainWindow.webContents.once('dom-ready', () => {
        logger.debug('DevTools', 'Opening Dev Tools');
        mainWindow.webContents.openDevTools();
    });
};

export default init;
