export interface IClientInfo {
    /**
     * The client identifier.
     *
     * @type {string}
     */
    CI: string;

    /**
     * The controller identifier.
     *
     * @type {string}
     */
    C: string;

    /**
     * The timestamp when the instance was created.
     *
     * @type {Date}
     */
    TS: Date;
}

export class ClientInfo implements IClientInfo {
    /**
     * The client identifier.
     *
     * @type {string}
     */
    public CI: string;

    /**
     * The controller identifier.
     *
     * @type {string}
     */
    public C: string;

    /**
     * The timestamp when the instance was created.
     *
     * @type {Date}
     */
    public TS: Date;

    /**
     * Creates an instance of ClientInfo.
     *
     * @param {string} ci - The client identifier.
     * @param {string} controller - The controller identifier.
     */
    constructor(ci: string, controller: string) {
        this.CI = ci;
        this.C = controller;
        this.TS = new Date();
    }
}
