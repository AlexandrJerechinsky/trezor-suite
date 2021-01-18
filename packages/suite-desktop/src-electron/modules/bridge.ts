/**
 * Bridge runner
 */
import { app, session } from 'electron';
import BridgeProcess from '@lib/processes/BridgeProcess';
import { b2t } from '@lib/utils';

const filter = {
    urls: ['http://127.0.0.1:21325/*'],
};

const bridgeDev = app.commandLine.hasSwitch('bridge-dev');
const bridge = new BridgeProcess();

const init = async ({ logger }: Dependencies) => {
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        // @ts-ignore electron declares requestHeaders as an empty interface
        details.requestHeaders.Origin = 'https://electron.trezor.io';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    try {
        logger.debug('Bridge', `Starting (Dev: ${b2t(bridgeDev)})`);
        if (bridgeDev) {
            await bridge.startDev();
        } else {
            await bridge.start();
        }
    } catch {
        //
    }

    app.on('before-quit', () => {
        logger.debug('Bridge', 'Stopping (app quit)');
        bridge.stop();
    });
};

export default init;
