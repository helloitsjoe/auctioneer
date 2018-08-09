export class Poller {

    public isPolling = true;
    private interval = null;
    private func: () => any;

    constructor(func) {
        this.func = func;
    }

    start() {
        this.isPolling = true;
        this.interval = setInterval(async () => {
            await this.func();
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.isPolling = false;
    }
}
