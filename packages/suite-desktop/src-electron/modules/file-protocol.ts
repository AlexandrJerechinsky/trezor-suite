/**
 * Helps pointing to the right folder to load
 */
import path from 'path';
import { session } from 'electron';

import { PROTOCOL } from '@lib/constants';

const init = ({ mainWindow, src }: Dependencies) => {
    const { logger } = global;

    // Point to the right directory for file protocol requests
    session.defaultSession.protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
        let url = request.url.substr(PROTOCOL.length + 1);
        url = path.join(__dirname, '..', '..', 'build', url);
        callback(url);
    });

    // Refresh if it failed to load
    mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDescription, validatedUrl) => {
        logger.warn(
            'File Protocol',
            `Failure to load ${validatedUrl} (${errorCode} - ${errorDescription})`,
        );
        mainWindow.loadURL(src);
    });
};

export default init;
