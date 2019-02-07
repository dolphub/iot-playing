import { EventEmitter } from "events";

// import { Observable } from 'rxjs';
// import { throttle, debounce } from 'rxjs/operators';
// import { timer } from "rxjs/observable/timer";?

const patch = {};
const emitter = new EventEmitter();

// Observable.fromEvent(emitter as any, 'updatePatch')
// .map(x => Object.assign(patch, { ...x }))
// .pipe(debounce(() => timer(1000)))
// .subscribe(x => console.log(patch));

function updatePatch(x: {}) {
    return ;
}

emitter.emit('updatePatch', { moardata: 1337 });
emitter.emit('updatePatch', { someOtherData: true });
emitter.emit('updatePatch', { someData: false });
emitter.emit('updatePatch', { someData: 'fart' });
