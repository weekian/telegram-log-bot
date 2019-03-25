import chai from "chai";
import chaiString from "chai-string";
import testLogger from "../src/logger";

chai.use(chaiString);

export default chai.expect;

export const Person = {
    findOrCreate: () => {},
};

export const Session = {
    count: () => {},
};

export const GroupChat = {
    findOne: () => {},
    findOrCreate: () => {},
    destroy: () => {},
};

export const telegram = {
    sendMessage: () => {},
};

export const logger = testLogger("test");

export class Telegram {
    constructor(token) {
        this.token = token;
        this.options = {
            id: 1141243,
        };
    }
}
