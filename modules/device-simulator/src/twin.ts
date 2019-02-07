// import { IDeviceState } from './';
import { Twin, Client } from 'azure-iot-device';
import { DeviceState, IDeviceState, IStatePatch } from './devicestate';
import * as AzureSDK from './lib/azure-sdk';
import { EventEmitter } from 'events';

import { Observable, Observer } from 'rxjs';
import { debounce } from 'rxjs/operators';

// No implicit any imports
const { isEmpty } = require('lodash');

export interface IDeviceTwin extends EventEmitter {
    state: IDeviceState;

    init: (client: Client) => Promise<void>;
    onState: (key: string | symbol, cb: (args?: any[]) => void) => void;
    updateState: (patch: IStatePatch) => Promise<void>;
}

export default class DeviceTwin extends EventEmitter implements IDeviceTwin {
    public state!: IDeviceState;

    protected twin!: Twin;
    protected updateObservable!: Observable<any>;

    constructor() {
        super();
        this.state = new DeviceState();
    }

    public async init(client: Client): Promise<void> {
        await this.state.init();
        this.twin = await AzureSDK.getDeviceTwin(client);
        this.setEvents();
        this.state.update(this.twin.properties.desired, this.twin.properties.reported);
        this.emit('twin.state.update');
    }

    public getState(): IDeviceState {
        return this.state;
    }

    public onState(key: string | symbol, cb: (args?: any[]) => void) {
        this.state.on(key, (...args) => {
            console.debug(`Twin.StateChange: ${key}`, args);
            cb(args);
        });
    }

    public updateState(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.twin.properties.reported.update(this.state.getPatch(), (err: Error) => {
                if (err) {
                    return reject(err);
                }
                console.debug('Twin.DeviceStateUpdated', this.state.getPatch());
                resolve();
            });
        });
    }

    private setEvents(): void {
        this.twin.on('properties.desired', async (desired) => {
            this.state.update(desired)
            await this.updateState();
        });
        this.updateObservable = Observable.fromEvent(this as any, 'twin.state.update');
        this.updateObservable.pipe(debounce(() => timer(2500))) // debounce updates 2.5 seconds
        .subscribe(async () => {
            await this.updateState();
        });
    }
}
