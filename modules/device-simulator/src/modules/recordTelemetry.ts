import { IDeviceState, IRecordTelemetryState } from "../devicestate";
import * as si from 'systeminformation';
import * as AzureSDK from '../lib/azure-sdk';
import { Client } from "azure-iot-device";
import { IDeviceTwin } from "../twin";

export interface IRecordTelemetry {
    start: () => Promise<void>
}

export class RecordTelemetry implements IRecordTelemetry{
    protected telemetryTimeoutReference: any;

    constructor(protected twin: IDeviceTwin, protected readonly client: Client) {
        this.setListeners();
    }

    private setListeners(): void {
        this.twin.onState('recordtelemetry.changed', () => {
            setTimeout(this.completeStateChange.bind(this), 10000);
            console.log('recordTelemetry.setListenres.onState');
        });
    }

    private completeStateChange() {
        let state = this.twin.state.recordTelemetry;
        if (state.pending) {
            Object.assign(state, {
                ...state.pending
            });
            state.status = 'done';
            state.pending = null;
        }
        this.twin.emit('twin.state.update');
    }

    public async start(): Promise<void> {
        try {
            let telemetry = this.twin.state.recordTelemetry;
            if (telemetry.enabled) {
                await this.sendTelemetry();
                if (!this.telemetryTimeoutReference) {
                    this.telemetryTimeoutReference = setTimeout(() => {
                        this.telemetryTimeoutReference = null;
                        this.start();
                    }, telemetry.frequencyMS);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    private async sendTelemetry() {
        const [ battery, currentLoad, cpuTemperature, memory ] = await Promise.all([
            si.battery(),
            si.currentLoad(),
            si.cpuTemperature(),
            si.mem(),
        ]);
        delete currentLoad.cpus; // Too much verbosity
        return AzureSDK.sendMessage(this.client, { battery, currentLoad, cpuTemperature, memory });
    }
}