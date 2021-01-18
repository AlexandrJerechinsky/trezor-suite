/**
 * Enable development tools
 */
const init = ({ mainWindow }: Dependencies) => {
    const { logger } = global;

    mainWindow.webContents.once('dom-ready', () => {
        logger.debug('DevTools', 'Opening Dev Tools');
        mainWindow.webContents.openDevTools();
    });
};

export default init;
