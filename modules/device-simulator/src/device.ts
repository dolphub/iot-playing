/*
*/

import { clientFromConnectionString, Mqtt } from 'azure-iot-device-mqtt';
import { results } from 'azure-iot-common';

import { Client, Message, Twin } from 'azure-iot-device';

import { Registry, Device } from 'azure-iothub';

import * as AzureSDK from './lib/azure-sdk';

import DeviceTwin, { IDeviceTwin } from './twin';
import { EventEmitter } from 'events';
import { IDeviceState, IMotionDetectionState, IStatePatch, IRecordTelemetryState } from './devicestate';
import { RecordTelemetry, IRecordTelemetry } from './modules';

const connectionString = process.env.IOTHUB_CONNECTION_STRING;
if (!connectionString) {
    throw new Error('Must have a connection string provided in process.env.IOTHUB_CONNECTION_STRING');
}

const registry = Registry.fromConnectionString(connectionString);

export class IotDevice extends EventEmitter {
    protected client!: Client;
    protected device!: Device;
    protected twin!: IDeviceTwin;
    
    protected recordTelemetry!: IRecordTelemetry;

    constructor() {
        super();
    }

    public async init(deviceObject: any) {
        this.device = await AzureSDK.getDeviceInformation(deviceObject, registry);
        this.client = clientFromConnectionString(AzureSDK.getDeviceConnectionString(this.device));
        this.client.on('message', this.onDeviceMessage.bind(this));
        await AzureSDK.openClient(this.client);
        this.twin = new DeviceTwin();
        this.recordTelemetry = new RecordTelemetry(this.twin, this.client);
        await this.twin.init(this.client);
        await this.start();
    }

    /**
     * Start all device services
     */
    public async start(): Promise<void> {
        this.recordTelemetry.start();
    }

    public getState(): IDeviceState {
        return this.twin.state;
    }


    /**
     * Cloud to Device Message Callback
     * @param {Message} msg 
     */
    private onDeviceMessage(msg: Message) {
        console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
        this.client.complete(msg, AzureSDK.printResultFor('completed'));
    }

    private async onMotionDetectionChanged() {
        console.log('@TODO: Remove - MOTION DETECTION STATE CHANGED');

        setTimeout(async () => {
            // let motionDetection: IMotionDetection = { ...this.getState().motionDetection, status: 'done' };
            // let patch: IStatePatch = { motionDetection };
            // await this.twin.updateState(patch);
        }, 10000);
    }
}

export async function getInfo(deviceObject: any): Promise<Device> {
    const device = await AzureSDK.getDeviceInformation(deviceObject, registry);
    if (!device) {
        console.log('Device not registerd yet. Registering device...');
        return AzureSDK.register(device, registry);
    }
    return device;
}



/**
 * Schedule Jobs
 * https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-node-node-schedule-jobs
 *
 * Update/Conifg Device Twin
 * https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-node-node-twin-how-to-configure
 * https://blog.angularindepth.com/rxjs-understanding-lettable-operators-fe74dda186d3
 */

// Create a message and send it to the IoT Hub

