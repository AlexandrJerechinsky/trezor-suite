/**
 * Opens external links in the default browser (displays a warning when using Tor)
 */
import { shell, dialog } from 'electron';

import * as config from '../config';

const init = ({ mainWindow, store, logger }: Dependencies) => {
    const handleExternalLink = (event: Event, url: string) => {
        if (config.oauthUrls.some(u => url.startsWith(u))) {
            event.preventDefault();

            logger.info('External Links', `${url} was allowed (OAuth list)`);
            return shell.openExternal(url);
        }

        if (url !== mainWindow.webContents.getURL()) {
            event.preventDefault();

            const torSettings = store.getTorSettings();
            if (torSettings.running) {
                // TODO: Replace with in-app modal
                const result = dialog.showMessageBoxSync(mainWindow, {
                    type: 'warning',
                    message: `The following URL is going to be opened in your browser\n\n${url}`,
                    buttons: ['Cancel', 'Continue'],
                });
                const cancel = result === 0;
                logger.info(
                    'External Links',
                    `${url} was ${cancel ? 'not ' : ''}allowed by user in TOR mode`,
                );

                // Cancel
                if (cancel) return;
            }
            logger.debug('External Links', `${url} opened in default browser`);
            shell.openExternal(url);
        }
    };

    mainWindow.webContents.on('new-window', handleExternalLink);
    mainWindow.webContents.on('will-navigate', handleExternalLink);
};

export default init;
