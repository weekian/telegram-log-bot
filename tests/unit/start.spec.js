// @flow
import { describe, it, before } from "mocha";
import expect from "../utility";
import StartHandler from "../../src/start";

describe("start", () => {
    let start: StartHandler;

    before(() => {
        start = new StartHandler();
    });

    it("should return a personalized start message containing the user's name", () => {
        const name: string = "Alex";
        const result: string = start.process(name);
        expect(result).to.be.a("string");
        expect(result).to.not.be.empty;
        expect(result).to.startWith(`Hi ${name},`);
    });
});
