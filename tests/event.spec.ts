import {Event, EventDispatcher} from "../src/event.dispatcher";
import * as m from "../src/index";

describe("event.dispatcher", () => {
    it("should emit event object with additional arguments and other context", (done) => {
        const ed = new EventDispatcher<Event>();

        ed.on("test", function($e, arg1) {
            expect($e.name).toBe("test");
            expect(this.test).toBe("42");
            expect(arg1).toBe("test arg");
            done();
        }, { test : "42" });

        ed.on("test2", () => {
            throw new Error();
        });

        ed.emit( {name : "test"}, "test arg" );
    });

    it("should emit string event with additional arguments and other context", (done) => {
        const ed = new EventDispatcher<string>();

        ed.on("test", function($e, arg1) {
            expect($e.name).toBe("test");
            expect(this.test).toBe("42");
            expect(arg1).toBe("test arg");
            done();
        }, { test : "42" });

        ed.on("test2", () => {
            throw new Error();
        });

        ed.emit( "test", "test arg" );
    });

    it("should listen some event only once", () => {
        const ed = new EventDispatcher<string>();

        let counter = 0;
        ed.once("test", () => {
            counter++;
        });

        ed.emit( "test" );
        ed.emit( "test" );
        expect(counter).toBe(1);
    });

    it("should call several listeners", () => {
        const ed = new EventDispatcher<string>();

        let counter = 0;
        ed.on("test", () => {
            counter++;
        });

        ed.on("test", () => {
            counter++;
        });

        ed.emit( "test" );
        expect(counter).toBe(2);
    });

    it("should remove listener by callback", () => {
        const ed = new EventDispatcher<string>();

        let counter = 0;
        const cb = () => {
            counter++;
        };

        ed.on("test", cb);
        ed.on("test", () => {
            counter++;
        });

        ed.off(cb);

        ed.emit( "test" );
        expect(counter).toBe(1);
    });

    it("should remove listener by context", () => {
        const ed = new EventDispatcher<string>();

        let counter = 0;
        const ctx = {};

        ed.on("test", () => {
            counter++;
        }, ctx);

        ed.off(undefined, undefined, ctx );
        ed.emit( "test" );

        expect(counter).toBe(0);
    });

});
