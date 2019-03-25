import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import expect, { GroupChat, Person, logger } from "../utility";
import groupHandler from "../../src/commands/groupHandler";

describe("Group chat handler", () => {
    let findOrCreateGroupChatStub;
    let findOrCreatePersonStub;
    let destroyGroupChatStub;

    beforeEach(() => {
        findOrCreateGroupChatStub = sinon.stub(GroupChat, "findOrCreate");
        findOrCreatePersonStub = sinon.stub(Person, "findOrCreate");
        destroyGroupChatStub = sinon.stub(GroupChat, "destroy");
    });

    afterEach(() => {
        findOrCreateGroupChatStub.restore();
        findOrCreatePersonStub.restore();
        destroyGroupChatStub.restore();
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
                "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here.\n\nA is automatically registered to broadcast check-ins and check-outs\nB is already registered"
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
                "A is automatically registered to broadcast check-ins and check-outs\nB is already registered"
            );
        });
    });

    describe("handling chat members removed from the group chat", () => {
        it("should remove the group chat (cascading) if bot is removed from the group chat", async () => {
            destroyGroupChatStub.resolves(1);
            const chat = { id: -123 };

            await groupHandler.deleteGroupChat({
                chat,
                GroupChat,
                logger,
            });
            expect(
                destroyGroupChatStub.withArgs({ where: { id: chat.id } })
                    .calledOnce
            ).to.be.true;
        });

        it("should remove the previously person from the group chat if registered person is removed and broadcast message", async () => {
            findOrCreateGroupChatStub.resolves([
                {
                    hasPerson: async () => true,
                    removePerson: async () => null,
                },
                false,
            ]);
            const leftMember = {
                id: 1234,
                first_name: "A",
            };
            const chat = {
                id: -123,
            };

            const result = await groupHandler.removeUserFromGroupChat({
                GroupChat,
                leftMember,
                chat,
                logger,
            });

            expect(typeof result).to.equal("string");
            expect(result).to.equal(
                `${leftMember.first_name} has been de-registered` +
                    ` from broadcasting to this group chat`
            );
        });

        it("should do nothing if person removed from group chat is not registered", async () => {
            findOrCreateGroupChatStub.resolves([
                {
                    hasPerson: async () => false,
                    removePerson: async () => null,
                },
                false,
            ]);
            const leftMember = {
                id: 1234,
                first_name: "A",
            };
            const chat = {
                id: -123,
            };

            const result = await groupHandler.removeUserFromGroupChat({
                GroupChat,
                leftMember,
                chat,
                logger,
            });

            expect(typeof result).to.equal("object");
            expect(result).to.equal(null);
        });
    });
});
