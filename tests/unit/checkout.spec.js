import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import expect, { Person, Session, telegram, logger } from "../utility";
import checkoutCommand from "../../src/commands/checkout";

describe("/checkout command", () => {
    let telegramSendMessageStub;
    let personFindOrCreateStub;
    const from = {
        id: 12345,
        first_name: "Bob",
    };
    const message = {
        date: 1551796500,
    };
    const findOrCreateFoundPersonWithActiveSessionButNoGroupChats = {
        id: from.id,
        getSessions: async () => {
            return [
                {
                    update: async () => {
                        return {
                            personId: from.id,
                            checkinTimestamp: new Date(
                                "2019-03-05T13:00:00.000Z"
                            ),
                            checkoutTimestamp: new Date(
                                "2019-03-05T14:35:00.000Z"
                            ),
                        };
                    },
                },
            ];
        },
        getGroupChats: async () => [],
    };
    const findOrCreateFoundPersonWithActiveSessionAndGroupChats = {
        id: from.id,
        getSessions: async () => {
            return [
                {
                    update: async () => {
                        return {
                            personId: from.id,
                            checkinTimestamp: new Date(
                                "2019-03-05T13:00:00.000Z"
                            ),
                            checkoutTimestamp: new Date(
                                "2019-03-05T14:35:00.000Z"
                            ),
                        };
                    },
                },
            ];
        },
        getGroupChats: async () => [{ id: -444 }, { id: -555 }],
    };
    const findOrCreateFoundPersonWithNoActiveSession = {
        id: from.id,
        getSessions: async () => {
            return [];
        },
    };

    beforeEach(() => {
        telegramSendMessageStub = sinon.stub(telegram, "sendMessage");
        personFindOrCreateStub = sinon.stub(Person, "findOrCreate");
    });

    afterEach(() => {
        telegramSendMessageStub.restore();
        personFindOrCreateStub.restore();
    });

    it("should be triggered when /checkout command is sent", () => {
        expect(checkoutCommand.name).to.equal("checkout");
    });

    it("should return a message informing user that he/she has checked out out at the time command was triggered and display total duration since checked in", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateFoundPersonWithActiveSessionButNoGroupChats,
            false,
        ]);

        const result = await checkoutCommand.process({
            message,
            from,
            Person,
            Session,
            logger,
        });

        expect(result).to.equal(
            "Hi Bob, you have checked out at 10:35PM on Tuesday, 5th March 2019. Total duration for this session is 1hr 35mins.\n\nWell done!"
        );
    });

    it("should return an error message informing user that he/she has no ongoing sessions and to check in instead when it is a new user", async () => {
        personFindOrCreateStub.resolves([{}, true]);

        const result = await checkoutCommand.process({
            message,
            from,
            Person,
            Session,
            logger,
        });

        expect(result).to.equal(
            "Hi Bob, you do not have any ongoing session. Do you mean to /checkin?"
        );
    });

    it("should return an error message informing user that he/she has no ongoing sessions and to check in instead when user has no ongoing sessions", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateFoundPersonWithNoActiveSession,
            false,
        ]);

        const result = await checkoutCommand.process({
            message,
            from,
            Person,
            Session,
            logger,
        });

        expect(result).to.equal(
            "Hi Bob, you do not have any ongoing session. Do you mean to /checkin?"
        );
    });

    it("should send a message to all registered group chats when checking out of a session", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateFoundPersonWithActiveSessionAndGroupChats,
            false,
        ]);
        telegramSendMessageStub.resolves({});

        await checkoutCommand.process({
            message,
            from,
            Person,
            Session,
            telegram,
            logger,
        });

        const [firstChatId, firstMessage] = telegramSendMessageStub.getCall(
            0
        ).args;
        const [secondChatId, secondMessage] = telegramSendMessageStub.getCall(
            1
        ).args;

        expect(telegramSendMessageStub.calledTwice).to.be.true;
        expect(firstChatId).to.equal(-444);
        expect(secondChatId).to.equal(-555);
        expect(firstMessage).to.equal(secondMessage);
        expect(firstMessage).to.equal(
            "Hi everyone, Bob has checked out at 10:35PM on Tuesday, 5th March 2019 and logged a duration of 1hr 35mins"
        );
    });

    it("should not crash the application when trying to broadcast a message to an unaccessible group chat", async () => {
        personFindOrCreateStub.resolves([
            findOrCreateFoundPersonWithActiveSessionAndGroupChats,
            false,
        ]);
        telegramSendMessageStub.rejects({ failed: true });

        const result = await checkoutCommand.process({
            message,
            from,
            Person,
            Session,
            telegram,
            logger,
        });

        expect(typeof result).to.equal("string");
    });
});
