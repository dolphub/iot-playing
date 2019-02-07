import { EventEmitter } from 'events';
import { Twin } from 'azure-iot-device';

const DEFAULT_TELEMETRY_FREQUENCY_MS = parseInt(process.env.IOT_MESSAGE_INTERVAL_MS || '10000', 10);

interface IPropertyBase  {
    status: 'done' | 'pending' | 'fail';
    pending: {} | null;
    id: string;
}

export interface IRecordTelemetryState extends IPropertyBase {
    enabled: boolean;
    frequencyMS: number;
}

export interface IDebugModeState extends IPropertyBase {
    enabled: boolean;
}

export interface IVideoSettingState extends IPropertyBase {
    enabled: boolean;
    durationMS: number;
}

export interface IMotionDetectionState extends IPropertyBase {
    enabled: boolean;
}

export interface IStatePatch {
    recordTelemetry?: IRecordTelemetryState;
    motionDetection?: IMotionDetectionState;
    debugMode?: IDebugModeState;
    videoSettings?: IVideoSettingState;
}


export interface IDeviceState extends EventEmitter {
    $version: number;
    
    recordTelemetry: IRecordTelemetryState;
    motionDetection: IMotionDetectionState;
    debugMode: IDebugModeState;
    videoSettings: IVideoSettingState;

    init: () => Promise<void>;
    update: (desired: any, reported?: any) => void;
    getPatch: () => IStatePatch;
}

type TwinProperties = { desired: any, reported: any };

/**
 * @TODO: Pull initial device state from sensors when required
 * @NOTE: Nothing yet requires initial state, all in memory flags
 */
export class DeviceState extends EventEmitter implements IDeviceState {    
    public $version: number = 0;

    public recordTelemetry!: IRecordTelemetryState;
    public debugMode!: IDebugModeState;
    public videoSettings!: IVideoSettingState;
    public motionDetection!: IMotionDetectionState;

    constructor() {
        super();
    }

    public async init(): Promise<void> {
        /**
         * @TODO: Async Pull current state from hard configuration / sensor state if required
         */
        this.recordTelemetry = {
            enabled: false,
            status: 'done',
            frequencyMS: DEFAULT_TELEMETRY_FREQUENCY_MS,
            id: '',
            pending: null
        };
        // this.debugMode = {
        //     enabled: false,
        //     status: 'done',
        //     id: '',
        // };
        // this.videoSettings = {
        //     enabled: false,
        //     durationMS: 10000,
        //     status: 'done',
        //     id: '',
        // };
        // this.motionDetection = {
        //     enabled: false,
        //     status: 'done',
        //     id: '',
        // };
    }

    public getPatch(): IStatePatch {
        return {
            recordTelemetry: this.recordTelemetry,
            // the rest
        }
    }

    public update(desired: any, reported: any): void {
        // We are most up to date
        if (desired.$version === this.$version) {
            return;
        }

        this.updateRecordTelemetry(desired.recordTelemetry, reported);
        this.$version = desired.$version;
    }
    
    private updateRecordTelemetry(desired: IRecordTelemetryState, reported: any): void {
        if (!desired) {
            return;
        }

        if (this.recordTelemetry.id === desired.id) {
            return;
        }

        if (reported && reported.recordTelemetry) {
            this.recordTelemetry = Object.assign({}, this.recordTelemetry, reported.recordTelemetry);
        }

        if (this.recordTelemetry.id !== desired.id) {
            // Assign desired state to pending
            this.recordTelemetry = Object.assign({}, this.recordTelemetry, {
                pending: { ...desired },
                status: 'pending'
            });
            this.emit('recordtelemetry.changed');
            return;
        }
    }
}
