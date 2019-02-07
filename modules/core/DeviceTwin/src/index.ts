import { config } from 'dotenv';
config();

import { Registry, Twin } from 'azure-iothub';
import { v4 } from 'uuid';

const connectionString = process.env.IOTHUB_CONNECTION_STRING;
if (!connectionString) {
    throw new Error('No Connection String Found in Environment.\nExiting 1.');
}

const registry = Registry.fromConnectionString(connectionString);

const patch = {
    tags: {
        location: {
            'region': 'Canada',
            'office': 'London'
        },
        type: 'SimulatedSensor'
    },
    properties: {
        desired: {
            recordTelemetry: {
                enabled: true,
                frequencyMS: 10000,
                id: v4()
            },
            // motionDetection: {
            //     enabled: false,
            //     id: v4()
            // }
        }
    }
};

registry.getTwin('testDevice', (error, twin) => {
    if (error) {
        throw new Error(`${error.constructor.name}: ${error.message}`);
    }

    twin.update(patch, (error: Error) => {
        if (error) {
            console.error(`Could not update twin: ${error.constructor.name}: ${error.message}`);
            return;
        }
        console.log(`${twin.deviceId} twin updated successfully`);
        queryTwins();
    });
});

function queryTwins() {
    let query = registry.createQuery(`SELECT * FROM devices WHERE tags.location.office = 'London'`, 100);
    query.nextAsTwin((error, results) => {
        if (error) {
            return console.error(`Failed to fetch results: ${error.message}`);
        }
        if (!results) {
            return console.log('No results fetched');
        }
        results.forEach(twin => {
            console.log(twin.properties.desired);
        });
    });
}
