import { describe, it, before } from "mocha";
import expect from "../utility";
import StartHandler from "../../src/start";

describe("start", () => {
    let start;

    before(() => {
        start = new StartHandler();
    });

    it("should return a personalized start message containing the user's name", () => {
        const name = "Alex";
        const result = start.process(name);
        expect(result).to.be.a("string");
        expect(result).to.not.be.empty;
        expect(result.startsWith(`Hi ${name},`)).to.be.true;
    });
});
