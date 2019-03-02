import { describe, it, before } from "mocha";
import sinon from "sinon";
import Bot from "../../src/bot";
import expect, { Telegram } from "../utility";

describe("Bot", () => {
    let bot;

    before(() => {
        sinon.stub(Bot.prototype, "registerPrivateCommands");
        sinon.stub(Bot.prototype, "registerGroupCommands");
        sinon.stub(Bot.prototype, "registerCommands");
        sinon.stub(Bot.prototype, "handleAddedToGroup");

        bot = new Bot(Telegram, null, null, {});
    });

    describe("isPrivateChat method", () => {
        it("should return true when isPrivateChat method is invoked with private chat", () => {
            const input = {
                type: "private",
            };
            const result = bot.isPrivateChat(input);
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.true;
        });

        it("should return false when isPrivateChat method is invoked with group chat", () => {
            const input = {
                type: "group",
            };
            const result = bot.isPrivateChat(input);
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.false;
        });

        it("should return false when isPrivateChat method is invoked with undefined", () => {
            const result = bot.isPrivateChat();
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.false;
        });

        it("should return false when isPrivateChat method is invoked with null", () => {
            const result = bot.isPrivateChat(null);
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.false;
        });

        it("should return false when isPrivateChat method is invoked with empty object", () => {
            const result = bot.isPrivateChat({});
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.false;
        });
    });

    describe("isAddedToGroupChat", () => {
        it("should return true if is bot is added as group chat is created", () => {
            const input = {
                group_chat_created: true,
            };
            const result = bot.isAddedToGroupChat(input);
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.true;
        });

        it("should return true if bot is added after a group chat is created", () => {
            const input = {
                new_chat_members: [
                    {
                        id: 1141243,
                    },
                ],
            };
            const result = bot.isAddedToGroupChat(input);
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.true;
        });

        it("should return false if bot is not in new members added after a group chat is created", () => {
            const input = {
                new_chat_members: [
                    {
                        id: 1234,
                    },
                ],
            };
            const result = bot.isAddedToGroupChat(input);
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.false;
        });

        it("should return false if message is not a relevant message", () => {
            const input = {};
            const result = bot.isAddedToGroupChat(input);
            expect(typeof result).to.equal("boolean");
            expect(result).to.be.false;
        });
    });
});
