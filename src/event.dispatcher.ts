export interface Event { name: string; }
export type EventType = string | Event;
export type EventDispatcherCallback<E extends EventType> = ( $e: Event, ...args ) => void;

interface EventDispatcherHandler<E extends EventType> {
    cb: EventDispatcherCallback<E>;
    once: boolean;
    ctx: any;
}

interface EventDispatcherRegistry<E extends EventType> {
    [ name: string ]: Array<EventDispatcherHandler<E>>;
}

export class EventDispatcher<E extends EventType = Event> {
    private handlers: EventDispatcherRegistry<E> = {};

    public emit(event: E, ...args): this {
        const e = ( typeof event == "string" ? { name : event as string } : event ) as Event;

        const forRemove = [];

        this.handlers[e.name].forEach((h) => {
            h.cb.call(h.ctx, e, ...args);
            if ( h.once ) { forRemove.push(h); }
        });

        this.handlers[e.name] = this.handlers[e.name].filter((h) => forRemove.indexOf(h) == -1);

        return this;
    }

    public on(name: string, cb: EventDispatcherCallback<E>, ctx ?: any): this {
        this.handlers[name] = this.handlers[name] || [];
        this.handlers[name].push({ cb, ctx : ctx || window, once : false });
        return this;
    }

    public once(name: string, cb: EventDispatcherCallback<E>, ctx ?: any): this {
        this.handlers[name] = this.handlers[name] || [];
        this.handlers[name].push({ cb, ctx : ctx || window, once : true });
        return this;
    }

    public off(name?: string, cb?: EventDispatcherCallback<E>, ctx ?: any): this {
        if( name ) {
            if( !cb && !ctx ){
                this.handlers[name] = [];
            } else if( cb && !ctx ){
                this.handlers[name] = this.handlers[name].filter((h)=>h.cb !== cb);
            } else if( !cb && ctx ){
                this.handlers[name] = this.handlers[name].filter((h)=>h.ctx !== ctx);
            } else if( cb && ctx ){
                this.handlers[name] = this.handlers[name].filter((h)=>h.ctx !== ctx && h.cb !== cb);
            }
        } else if( cb ){
            if( ctx ){
                Object.keys(this.handlers).forEach((name)=>{
                    this.handlers[name] = this.handlers[name].filter((h)=>h.ctx !== ctx && h.cb !== cb);
                });
            } else {
                Object.keys(this.handlers).forEach((name)=>{
                    this.handlers[name] = this.handlers[name].filter((h)=>h.cb !== cb);
                });
            }
        } else if( ctx ){
            Object.keys(this.handlers).forEach((name)=>{
                this.handlers[name] = this.handlers[name].filter((h)=>h.ctx !== ctx);
            });
        } else {
            this.handlers = {};
        }
        return this;
    }
}
