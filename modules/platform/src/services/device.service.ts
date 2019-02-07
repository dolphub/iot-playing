import { Inject, Component } from '@nestjs/common';

import { Twin } from 'azure-iothub';
import { Query } from 'azure-iothub/lib/query';
import { IotHubProvider } from '../providers/iothub.provider';
import { DeviceState } from '../device/DeviceState';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Component()
export class DeviceService {
    constructor(
        private readonly iothubProvider: IotHubProvider,
    ) {}

    async getAllDeviceTwins(): Promise<Twin[]> {
        let deviceQuery = 'SELECT * from devices';
        let query = this.iothubProvider.getRegistry().createQuery(deviceQuery, 100);

        let deviceList = await this.getNextTwinData(query);
        while(query.hasMoreResults) {
            deviceList.concat(await this.getNextTwinData(query));
        }
        return deviceList;
    }

    async getDeviceTwinById(deviceId: number | string): Promise<Twin> {
        let deviceQuery = `SELECT * from devices where deviceId = '${deviceId}'`;
        let query = this.iothubProvider.getRegistry().createQuery(deviceQuery, 1);

        let deviceList = await this.getNextTwinData(query);
        return deviceList[0];
    }

    async updateDeviceState(deviceId: string): Promise<DeviceState> {
        const props = {
            desired: {

            }
        };
        return;
    }

    private getNextTwinData(query: Query): Promise<Twin[]> {
        return new Promise((resolve, reject) => {
            query.nextAsTwin((error, results) => {
                if (error) return reject(error);
                if (!results) return resolve();
                resolve(results);
            });
        });
    }
}
