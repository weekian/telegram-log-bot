import chai from "chai";
import chaiString from "chai-string";

chai.use(chaiString);

export default chai.expect;

export const Person = {
    findOrCreate: () => {},
};

export class Telegram {
    constructor(token) {
        this.token = token;
        this.options = {
            id: 1141243,
        };
    }
}
