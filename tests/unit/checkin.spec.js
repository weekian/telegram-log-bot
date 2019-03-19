import { describe, it, beforeEach, afterEach } from "mocha";
import moment from "moment";
import sinon from "sinon";
import expect, { Person, Session, telegram, logger } from "../utility";
import checkinCommand from "../../src/commands/checkin";

describe("/checkin command", () => {
    let personFindOrCreateStub;
    let sessionCountStub;
    let findOrCreateSpy;
    let sendMessageStub;
    const from = {
        id: 12345,
        first_name: "Bob",
    };
    const message = {
        date: 1551609588,
    };
    const findOrCreateReturnedPersonWithGroupChats = {
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
        getGroupChats: async () => [{ id: -444 }, { id: -555 }],
    };
    const findOrCreateReturnedPersonWithNoGroupChat = {
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
        getGroupChats: async () => [],
    };

    beforeEach(() => {
        sendMessageStub = sinon.stub(telegram, "sendMessage");
        findOrCreateSpy = sinon.spy(
            findOrCreateReturnedPersonWithNoGroupChat,
            "createSession"
        );
        sessionCountStub = sinon.stub(Session, "count");
        personFindOrCreateStub = sinon.stub(Person, "findOrCreate");
    });

    afterEach(() => {
        sendMessageStub.restore();
        findOrCreateSpy.restore();
        sessionCountStub.restore();
        personFindOrCreateStub.restore();
    });

    it("should be triggered when /checkin command is sent", () => {
        expect(checkinCommand.name).to.equal("checkin");
    });

    it("should return a message informing user that he/she has checked in at the time command was triggered", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateReturnedPersonWithNoGroupChat,
            false,
        ]);
        sessionCountStub.resolves(0);

        const result = await checkinCommand.process({
            message,
            from,
            Person,
            Session,
            logger,
        });
        expect(sessionCountStub.calledOnce).to.be.true;
        expect(typeof result).to.equal("string");
        expect(result).to.equal(
            "Hi Bob, you have checked in at 6:39PM on Sunday, 3rd March 2019"
        );
    });

    it("should retrieve user and add a started session", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateReturnedPersonWithNoGroupChat,
            false,
        ]);
        sessionCountStub.resolves(0);

        await checkinCommand.process({
            message,
            from,
            Person,
            Session,
            logger,
        });
        expect(sessionCountStub.calledOnce).to.be.true;
        expect(personFindOrCreateStub.calledOnce).to.be.true;
        expect(findOrCreateSpy.calledOnce).to.be.true;
    });

    it("should return an error message to user if there is an ongoing session", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateReturnedPersonWithNoGroupChat,
            false,
        ]);
        sessionCountStub.resolves(1);
        const result = await checkinCommand.process({
            message,
            from,
            Person,
            Session,
            logger,
        });

        expect(sessionCountStub.calledOnce).to.be.true;
        expect(result).to.equal(
            "Hi Bob, you have an ongoing session. Do you mean /checkout?"
        );
        expect(findOrCreateSpy.calledOnce).to.be.false;
    });

    it("should not need to check for pending sessions if user is newly created", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateReturnedPersonWithNoGroupChat,
            true,
        ]);

        const result = await checkinCommand.process({
            message,
            from,
            Person,
            Session,
            logger,
        });

        expect(sessionCountStub.called).to.be.false;
        expect(result).to.equal(
            "Hi Bob, you have checked in at 6:39PM on Sunday, 3rd March 2019"
        );
    });

    it("should broadcast message to all other groupChats for existing user", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateReturnedPersonWithGroupChats,
            false,
        ]);
        sessionCountStub.resolves(0);
        sendMessageStub.resolves({});

        await checkinCommand.process({
            message,
            from,
            Person,
            Session,
            telegram,
            logger,
        });

        expect(sendMessageStub.calledTwice).to.be.true;
        const [firstChatId, firstText] = sendMessageStub.getCall(0).args;
        const [secondChatId, secondText] = sendMessageStub.getCall(1).args;
        const expectedBroadcastMsg =
            "Hi everyone, Bob has checked in at 6:39PM on Sunday, 3rd March 2019";
        expect(firstChatId).to.equal(-444);
        expect(secondChatId).to.equal(-555);
        expect(firstText).to.equal(expectedBroadcastMsg);
        expect(secondText).to.equal(expectedBroadcastMsg);
    });

    it("should not exit the application if bot no longer has access to group chat and tries to send message to it", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateReturnedPersonWithGroupChats,
            false,
        ]);
        sessionCountStub.resolves(0);
        sendMessageStub.rejects({ failed: true });

        expect(
            typeof (await checkinCommand.process({
                message,
                from,
                Person,
                Session,
                telegram,
                logger,
            }))
        ).to.equal("string");
    });
});
