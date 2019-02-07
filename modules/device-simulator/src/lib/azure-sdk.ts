import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { results } from 'azure-iot-common';
import { Client, Message, Twin } from 'azure-iot-device';
import { Registry, Device } from 'azure-iothub';

const connectionString = process.env.IOTHUB_CONNECTION_STRING;

export function register(deviceObj: Device, registry: Registry): Promise<Device> {
    return new Promise((resolve, reject) => {
        registry.create(deviceObj, (err, deviceInfo, res) => {
            if (err) {
                return reject(`Error registering device ${err}`);
            }
            if (deviceInfo) {
                console.log('Device ID: ' + deviceInfo.deviceId);
                return resolve(deviceInfo);
            }
        });
    });
}

export function getDeviceInformation(deviceObj: Device, registry: Registry): Promise<Device> {
    return new Promise((resolve, reject) => {
        registry.get(deviceObj.deviceId, (err, device, res) => {
            if (err) {
                return reject(err);
            }
            // If this device isn't registered yet, register new device and use information
            resolve(device);
        });
    });
}

type KeyProps = Array<{ key: string, value: string }>;
export function sendMessage(client: Client, payload: {}, properties?: KeyProps) {
    const data = JSON.stringify(payload);
    const message = new Message(data);
    if (properties && properties.length > 0) {
        properties.forEach(x => message.properties.add(x.key, x.value));
    }
    console.debug(`Sending message: ${message.getData()}`);
    return client.sendEvent(message, printResultFor('send'));
}

type ClientActionCallback = (err?: Error | undefined, result?: results.MessageEnqueued | undefined) => void;
type ClinetAction = 'send' | 'completed';
export function printResultFor(op: ClinetAction): ClientActionCallback {
    return (err?: Error | undefined, result?: results.MessageEnqueued | undefined) => {
        if (err) {
            console.log(`${op} error: ${err.toString()}`);
        }
        if (result) {
            console.log(`${op} status: ${result.constructor.name}`);
        }
    };
}

export function getDeviceTwin(client: Client): Promise<Twin> {
    return new Promise((resolve, reject) => {
        client.getTwin((error, twin) => {
            if (error) {
                return reject(error);
            }
            console.debug('Received device twin');
            resolve(twin);
        });
    });
}

export function getDeviceConnectionString(deviceInfo: Device): string {
    const accessKey = getDevicePrimaryKey(deviceInfo);
    if (!accessKey) {
        throw new Error('Unable to get device connection string');
    }
    return `${connectionString};DeviceId=${deviceInfo.deviceId}`;
}

export function getDevicePrimaryKey(device: Device): string | undefined {
    if (device.authentication && device.authentication.symmetricKey) {
        return device.authentication.symmetricKey.primaryKey;
    }
    return;
}

export function openClient(client: Client): Promise<void> {
    return new Promise((resolve, reject) => {
        client.open((error) => {
            if (error) {
                return reject(error);
            }
            console.debug('Device connected to IotHub');
            resolve();
        });
    });
}
