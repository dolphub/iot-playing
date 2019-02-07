import * as mongoose from 'mongoose';
import { Registry } from 'azure-iothub';

const IOTHUB_CONNECTION_STRING = process.env.IOTHUB_CONNECTION_STRING;

import { Component, Get } from '@nestjs/common';

@Component()
export class IotHubProvider {
    private readonly registry: Registry;
    constructor(){
        if (!IOTHUB_CONNECTION_STRING) {
            throw new Error('No Connection String Found in Environment.\Exit 1');
        }
        this.registry = Registry.fromConnectionString(IOTHUB_CONNECTION_STRING);
    }

    getRegistry() {
        return this.registry;
    }
}
