import fs from 'fs';
import path from 'path';
import Logger, { Options } from '../libs/logger';

const testOptions: Options = {
    colors: false,
    logFormat: '%0(%1): %2',
    outputFile: 'test-log.txt',
    outputPath: __dirname,
};
const output = path.join(testOptions.outputPath, testOptions.outputFile);

describe('logger', () => {
    let spy: any;
    beforeEach(() => {
        spy = jest.spyOn(global.console, 'log').mockImplementation();
    });
    afterEach(() => {
        spy.mockRestore();
    });
    afterAll(() => {
        // Clean up (delete log file)
        fs.unlinkSync(output);
    });

    it('Level "mute" should not log any messages', () => {
        const logger = new Logger('mute', testOptions);
        logger.error('Test', 'A');
        logger.warn('Test', 'B');
        logger.info('Test', 'C');
        logger.debug('Test', 'D');
        expect(spy).toHaveBeenCalledTimes(0);
    });
    it('Level "error" should only show error messages', () => {
        const logger = new Logger('error', testOptions);
        logger.error('Test', 'A');
        logger.warn('Test', 'B');
        logger.info('Test', 'C');
        logger.debug('Test', 'D');
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls).toEqual([['ERROR(Test): A']]);
    });
    it('Level "warn" should show error and warning messages', () => {
        const logger = new Logger('warn', testOptions);
        logger.error('Test', 'A');
        logger.warn('Test', 'B');
        logger.info('Test', 'C');
        logger.debug('Test', 'D');
        expect(console.log).toHaveBeenCalledTimes(2);
        expect(spy.mock.calls).toEqual([['ERROR(Test): A'], ['WARN(Test): B']]);
    });
    it('Level "info" should show all messages except debug', () => {
        const logger = new Logger('info', testOptions);
        logger.error('Test', 'A');
        logger.warn('Test', 'B');
        logger.info('Test', 'C');
        logger.debug('Test', 'D');
        expect(console.log).toHaveBeenCalledTimes(3);
        expect(spy.mock.calls).toEqual([['ERROR(Test): A'], ['WARN(Test): B'], ['INFO(Test): C']]);
    });
    it('Level "debug" should not log all messages', () => {
        const logger = new Logger('debug', testOptions);
        logger.error('Test', 'A');
        logger.warn('Test', 'B');
        logger.info('Test', 'C');
        logger.debug('Test', 'D');
        expect(console.log).toHaveBeenCalledTimes(4);
        expect(spy.mock.calls).toEqual([
            ['ERROR(Test): A'],
            ['WARN(Test): B'],
            ['INFO(Test): C'],
            ['DEBUG(Test): D'],
        ]);
    });
    it('Output file should be written', async () => {
        const logger = new Logger('debug', {
            ...testOptions,
            writeToDisk: true,
        });
        logger.error('Test', 'A');
        logger.warn('Test', 'B');
        logger.info('Test', 'C');
        logger.debug('Test', 'D');
        logger.exit();

        // Delay for file to finish writing
        await new Promise(res => setTimeout(res, 1000));

        const logFile = fs.readFileSync(output, { encoding: 'utf8' });
        expect(logFile).toBe('ERROR(Test): A\nWARN(Test): B\nINFO(Test): C\nDEBUG(Test): D\n');
    });
});
