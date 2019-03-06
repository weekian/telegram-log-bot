import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import registerCommand from "../../src/commands/register";
import expect, { GroupChat, Person } from "../utility";

describe("/register command", () => {
    let findOneGroupChatStub;
    let findOrCreatePersonStub;
    const chat = {
        id: 456,
    };
    const from = {
        id: 123,
        first_name: "Bob",
    };

    beforeEach(() => {
        findOneGroupChatStub = sinon.stub(GroupChat, "findOne");
        findOrCreatePersonStub = sinon.stub(Person, "findOrCreate");
    });

    afterEach(() => {
        findOrCreatePersonStub.restore();
        findOneGroupChatStub.restore();
    });

    it("should be triggered when /register is sent", () => {
        expect(registerCommand.name).to.equal("register");
    });

    it("should associate the group chat with the existing user", async () => {
        findOneGroupChatStub.resolves({
            id: 111,
            hasPerson: async () => false,
            addPerson: async () => {},
        });
        findOrCreatePersonStub.resolves([{ id: 2222 }, false]);

        const result = await registerCommand.process({
            from,
            Person,
            GroupChat,
            chat,
        });

        expect(result).to.equal(
            "Hi Bob, you have been registered. Your subsequent check-ins and check-outs will be broadcasted to this chat."
        );
    });

    it("should associate the group chat with a new user", async () => {
        findOneGroupChatStub.resolves({
            id: 111,
            hasPerson: async () => false,
            addPerson: async () => {},
        });
        findOrCreatePersonStub.resolves([{ id: 2222 }, true]);

        const result = await registerCommand.process({
            from,
            Person,
            GroupChat,
            chat,
        });

        expect(result).to.equal(
            "Hi Bob, you have been registered. Your subsequent check-ins and check-outs will be broadcasted to this chat."
        );
    });

    it("should return an error message when the user is already associated with the group chat", async () => {
        findOneGroupChatStub.resolves({
            id: 111,
            hasPerson: async () => true,
        });
        findOrCreatePersonStub.resolves([{ id: 2222 }, false]);

        const result = await registerCommand.process({
            from,
            Person,
            GroupChat,
            chat,
        });

        expect(result).to.equal(
            "Hi Bob, you are already registered. Start logging your sessions!"
        );
    });
});
