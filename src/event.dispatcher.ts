import {Event} from "./event";

export type EventType = string | Event;
export type EventDispatcherCallback<E extends EventType> = ( $e:E, ...args )=>void;

type EventDispatcherHandler<E extends EventType> = {
    cb   : EventDispatcherCallback<E>;
    once : boolean;
    ctx  : any;
}

type EventDispatcherRegistry<E extends EventType> = {
    [ name : string ] : EventDispatcherHandler<E>[]
}

export class EventDispatcher<E extends EventType = string>{
    private handlers: EventDispatcherRegistry<E> = {};

    emit(event : E, ...args) : this{

        return this;
    }

    on(name : string, cb : EventDispatcherCallback<E>, ctx ?: any) : this {

        return this;
    }

    once(name : string, cb : EventDispatcherCallback<E>, ctx ?: any) : this {

        return this;
    }

    off(selector : string | Function | any) : this {

        return this;
    }
}
