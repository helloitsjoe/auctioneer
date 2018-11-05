export class Poller {

    public isPolling = false;
    private interval = null;
    private func: () => any;

    init(func) {
        this.func = func;
        this.start();
    }

    async start() {
        if (this.isPolling) {
            return;
        }
        this.isPolling = true;
        this.func();
        this.interval = setInterval(() => {
            this.func();
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.isPolling = false;
    }
}
