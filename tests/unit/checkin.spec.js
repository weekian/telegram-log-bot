import { describe, it, beforeEach, afterEach } from "mocha";
import moment from "moment";
import sinon from "sinon";
import expect, { Person, Session } from "../utility";
import checkinCommand from "../../src/commands/checkin";

describe("/checkin command", () => {
    let personFindOrCreateStub;
    let sessionCountStub;
    let findOrCreateSpy;
    const from = {
        id: 12345,
        first_name: "Bob",
    };
    const message = {
        date: 1551609588,
    };
    const findOrCreateReturnedPerson = {
        id: from.id,
        createSession: async () => {
            return {
                personId: from.id,
                checkinTimestamp: moment
                    .unix(message.date)
                    .utc()
                    .utcOffset("+08:00"),
            };
        },
    };

    beforeEach(() => {
        findOrCreateSpy = sinon.spy(
            findOrCreateReturnedPerson,
            "createSession"
        );
        sessionCountStub = sinon.stub(Session, "count");
        personFindOrCreateStub = sinon
            .stub(Person, "findOrCreate")
            .resolves([findOrCreateReturnedPerson, false]);
    });

    afterEach(() => {
        findOrCreateSpy.restore();
        sessionCountStub.restore();
        personFindOrCreateStub.restore();
    });

    it("should be triggered when /checkin command is sent", () => {
        expect(checkinCommand.name).to.equal("checkin");
    });

    it("should return a message informing user that he/she has checked in at the time command was triggered", async () => {
        sessionCountStub.resolves(0);

        const result = await checkinCommand.process({
            message,
            from,
            database: {},
            Person,
            GroupChat: {},
            Session,
        });

        expect(typeof result).to.equal("string");
        expect(result).to.equal(
            "Hi Bob, you have checked in at 6:39PM on Sunday, 3rd March 2019"
        );
    });

    it("should retrieve/create user and add a started session", async () => {
        sessionCountStub.resolves(0);

        await checkinCommand.process({
            message,
            from,
            database: {},
            Person,
            GroupChat: {},
            Session,
        });
        expect(personFindOrCreateStub.calledOnce).to.be.true;
        expect(findOrCreateSpy.calledOnce).to.be.true;
    });

    it("should return an error message to user if there is an ongoing session", async () => {
        sessionCountStub.resolves(1);
        const result = await checkinCommand.process({
            message,
            from,
            database: {},
            Person,
            GroupChat: {},
            Session,
        });

        expect(result).to.equal(
            "Hi Bob, you have an ongoing session. Do you mean /checkout?"
        );
        expect(findOrCreateSpy.calledOnce).to.be.false;
    });
});
