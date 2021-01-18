/**
 * Tor feature (toggle, configure)
 */
import { app, session, ipcMain, IpcMainEvent } from 'electron';

import TorProcess from '@lib/processes/TorProcess';

import { onionDomain } from '../config';
import { b2t } from '@lib/utils';

const tor = new TorProcess();

const torFlag = app.commandLine.hasSwitch('tor');

const init = async ({ mainWindow, store, logger }: Dependencies) => {
    const torSettings = store.getTorSettings();

    const toggleTor = async (start: boolean) => {
        if (start) {
            if (torSettings.running) {
                logger.debug('TOR', 'Restarting...');
                await tor.restart();
            } else {
                logger.debug('TOR', 'Starting...');
                await tor.start();
            }
        } else {
            logger.debug('TOR', 'Stopping...');
            await tor.stop();
        }

        torSettings.running = start;
        store.setTorSettings(torSettings);

        mainWindow.webContents.send('tor/status', start);

        const proxy = start ? `socks5://${torSettings.address}` : '';
        logger.debug('TOR', `Setting proxy to "${proxy}"`);
        session.defaultSession.setProxy({
            proxyRules: proxy,
        });
    };

    if (torFlag || torSettings.running) {
        logger.debug('TOR', [
            'Auto starting:',
            `- Running with flag: ${b2t(torFlag)}`,
            `- Running with settings: ${b2t(torSettings.running)}`,
        ]);
        await toggleTor(true);
    }

    ipcMain.on('tor/toggle', async (_, start: boolean) => {
        logger.debug('TOR', `Toggling ${start ? 'ON' : 'OFF'}`);
        await toggleTor(start);
    });

    ipcMain.on('tor/set-address', () => async (_: IpcMainEvent, address: string) => {
        if (torSettings.address !== address) {
            logger.debug('TOR', [
                'Updating address:',
                `- From: ${torSettings.address}`,
                `- To: ${address}`,
            ]);

            torSettings.address = address;
            store.setTorSettings(torSettings);

            if (torSettings.running) {
                await toggleTor(true);
            }
        }
    });

    ipcMain.on('tor/get-status', () => {
        logger.debug('TOR', `Getting status (${torSettings.running ? 'ON' : 'OFF'})`);
        mainWindow.webContents.send('tor/status', torSettings.running);
    });

    ipcMain.handle('tor/get-address', () => {
        logger.debug('TOR', `Getting address (${torSettings.address})`);
        return torSettings.address;
    });

    session.defaultSession.webRequest.onBeforeRequest({ urls: ['*://*/*'] }, (details, cb) => {
        const { hostname, protocol } = new URL(details.url);

        // Redirect outgoing trezor.io requests to .onion domain
        if (torSettings.running && hostname.endsWith('trezor.io') && protocol === 'https:') {
            logger.debug('TOR', `Rewriting ${details.url} to .onion URL`);
            cb({
                redirectURL: details.url.replace(
                    /https:\/\/(([a-z0-9]+\.)*)trezor\.io(.*)/,
                    `http://$1${onionDomain}$3`,
                ),
            });
            return;
        }

        cb({ cancel: false });
    });
};

export default init;
