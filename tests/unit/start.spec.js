import { describe, it, afterEach, beforeEach } from "mocha";
import sinon from "sinon";
import expect, { Person } from "../utility";
import startCommand from "../../src/commands/start";

/*
1. trigger on start command
2. Return message with user's first_name
3. Save user to 
 */
describe("/start command", () => {
    let findOrCreateStub;

    beforeEach(() => {
        findOrCreateStub = sinon.stub(Person, "findOrCreate");
    });

    afterEach(() => {
        findOrCreateStub.restore();
    });

    it("should be triggered when '/start' command is sent", () => {
        expect(startCommand.name).to.equal("start");
    });

    it("should create a new User and greet beginning with 'Hi'", async () => {
        const from = {
            first_name: "Bob",
            id: 556612,
        };

        findOrCreateStub.resolves([
            { id: from.id, name: from.first_name },
            false,
        ]);

        const result = await startCommand.process({
            Person,
            from,
        });

        expect(findOrCreateStub.calledOnce).to.be.true;
        expect(
            findOrCreateStub.calledWithExactly({
                where: {
                    id: from.id,
                    name: from.first_name,
                },
            })
        ).to.be.true;

        expect(result).to.equal(
            "Hi Bob,\n\nClick /checkin to begin a session. /checkout to end a session\n\nAdd me to a group chat and send /leaderboard to see everybody's logged sessions.\n\nGood luck!"
        );
    });

    it("should retrieve an existing user and greet beginning with 'Welcome back'", async () => {
        const from = {
            first_name: "Bob",
            id: 556612,
        };

        findOrCreateStub.resolves([
            { id: from.id, name: from.first_name },
            true,
        ]);

        const result = await startCommand.process({
            Person,
            from,
        });

        expect(findOrCreateStub.calledOnce).to.be.true;
        expect(
            findOrCreateStub.calledWithExactly({
                where: {
                    id: from.id,
                    name: from.first_name,
                },
            })
        ).to.be.true;

        expect(result).to.equal(
            "Welcome back Bob,\n\nClick /checkin to begin a session. /checkout to end a session\n\nAdd me to a group chat and send /leaderboard to see everybody's logged sessions.\n\nGood luck!"
        );
    });
});
