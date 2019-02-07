import { config } from 'dotenv';
config();

import { IotDevice } from './device';

const device = {
    deviceId: process.env.UNIQUE_DEVICE_ID || 'testDevice',
};

(async () => {
    try {
        const iotdevice = new IotDevice();
        await iotdevice.init(device);
    } catch (error) {
        console.error(error);
    }
})();