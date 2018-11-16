import { Poller } from '../src/Poller';

describe('Poller', function () {

    it('calls function during setInterval', function () {
        jest.useFakeTimers();
        const poller = new Poller();
        const func = jest.fn();
        expect(poller.isPolling).toBe(false);
        poller.init(func);
        expect(poller.isPolling).toBe(true);
        jest.advanceTimersByTime(1000);
        expect(setInterval).toBeCalledTimes(1);
        expect(func).toBeCalledTimes(2);
        poller.stop();
        expect(poller.isPolling).toBe(false);
        expect(clearInterval).toBeCalledTimes(1);
        poller.start();
        expect(poller.isPolling).toBe(true);
        poller.stop();
        jest.useRealTimers();
    });
});
