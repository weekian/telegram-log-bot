import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import expect, { GroupChat } from "../utility";
import groupHandler from "../../src/commands/groupHandler";

describe("Added to group chat handler", () => {
    let findOrCreateGroupChatStub;

    beforeEach(() => {
        findOrCreateGroupChatStub = sinon.stub(GroupChat, "findOrCreate");
    });

    afterEach(() => {
        findOrCreateGroupChatStub.restore();
    });

    it("should create return a welcome message upon adding to new group chat", async () => {
        findOrCreateGroupChatStub.resolves([{ id: 123 }, true]);

        const result = await groupHandler.process({
            chat: { id: 4 },
            GroupChat,
        });
        expect(result).to.equal(
            "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here."
        );
    });

    it("should create return a welcome message upon adding to previously added group chat", async () => {
        findOrCreateGroupChatStub.resolves([{ id: 123 }, false]);
        const result = await groupHandler.process({
            chat: { id: 4 },
            GroupChat,
        });
        expect(result).to.equal(
            "Hi guys, thanks for adding me back!. /register again to allow me to broadcast your check-ins and check-outs here."
        );
    });
});
