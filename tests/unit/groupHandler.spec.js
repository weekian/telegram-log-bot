import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import expect, { GroupChat, Person, logger } from "../utility";
import groupHandler from "../../src/commands/groupHandler";

describe("Added to group chat handler", () => {
    let findOrCreateGroupChatStub;
    let findOrCreatePersonStub;

    beforeEach(() => {
        findOrCreateGroupChatStub = sinon.stub(GroupChat, "findOrCreate");
        findOrCreatePersonStub = sinon.stub(Person, "findOrCreate");
    });

    afterEach(() => {
        findOrCreateGroupChatStub.restore();
        findOrCreatePersonStub.restore();
    });

    describe("handling new group chat creation", () => {
        it("should create return a welcome message upon adding to new group chat", async () => {
            findOrCreateGroupChatStub.resolves([{ id: 123 }, true]);

            const result = await groupHandler.addNewGroupChat({
                chat: { id: 4 },
                GroupChat,
            });
            expect(result).to.equal(
                "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here."
            );
        });

        it("should create return a welcome message upon adding to previously added group chat", async () => {
            findOrCreateGroupChatStub.resolves([{ id: 123 }, false]);
            const result = await groupHandler.addNewGroupChat({
                chat: { id: 4 },
                GroupChat,
            });
            expect(result).to.equal(
                "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here."
            );
        });
    });

    describe("handling add after group chat creation", () => {
        it("should create GroupChat and return message when added to group chat alone", async () => {
            findOrCreateGroupChatStub.resolves([{ id: 123 }, true]);
            const botId = 1234;
            const newMembers = [{ id: botId }];
            const chat = { id: -123 };

            const result = await groupHandler.addUsersToGroupChat({
                botId,
                newMembers,
                chat,
                GroupChat,
                Person,
                logger,
            });

            expect(result).to.equal(
                "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here."
            );
        });

        it("should create GroupChat, add also new members and return message when added to group chat with others", async () => {
            const botId = 1234;
            const newMembers = [
                { id: botId },
                { id: 111, first_name: "A" },
                { id: 222, first_name: "B" },
            ];
            findOrCreateGroupChatStub.resolves([
                {
                    id: 123,
                    hasPerson: async () => {
                        return true;
                    },
                    addPerson: async () => {},
                },
                true,
            ]);
            findOrCreatePersonStub
                .onFirstCall()
                .resolves([{ id: newMembers[1].id }, true])
                .onSecondCall()
                .resolves([{ id: newMembers[2].id }, false]);

            const chat = { id: -123 };

            const result = await groupHandler.addUsersToGroupChat({
                botId,
                newMembers,
                chat,
                GroupChat,
                Person,
                logger,
            });

            expect(result).to.equal(
                "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here.\n\n@A is automatically registered\n@B is already registered"
            );
        });

        it("should add new members to the group when new members are added to the group chat", async () => {
            const botId = 1234;
            const newMembers = [
                { id: 111, first_name: "A" },
                { id: 222, first_name: "B" },
            ];
            findOrCreateGroupChatStub.resolves([
                {
                    id: 123,
                    hasPerson: async () => {
                        return true;
                    },
                    addPerson: async () => {},
                },
                true,
            ]);
            findOrCreatePersonStub
                .onFirstCall()
                .resolves([{ id: newMembers[0].id }, true])
                .onSecondCall()
                .resolves([{ id: newMembers[1].id }, false]);

            const chat = { id: -123 };

            const result = await groupHandler.addUsersToGroupChat({
                botId,
                newMembers,
                chat,
                GroupChat,
                Person,
                logger,
            });

            expect(result).to.equal(
                "Hello new joiners,\n\n@A is automatically registered\n@B is already registered"
            );
        });
    });
});
