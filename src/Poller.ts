export class Poller {

    public isPolling = false;
    private interval = null;
    private func: () => void = () => {};

    init(func): void {
        this.func = func;
        this.start();
    }

    start(): void {
        if (this.isPolling) {
            return;
        }
        this.isPolling = true;
        this.func();
        this.interval = setInterval(() => {
            this.func();
        }, 1000);
    }

    stop(): void {
        clearInterval(this.interval);
        this.interval = null;
        this.isPolling = false;
    }
}
