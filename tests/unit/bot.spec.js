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

    describe("isAddedToGroupChat method", () => {
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

    describe("isChatOfType method", () => {
        it("should throw an error if first argument is not a valid string", () => {
            expect(() => bot.isChatOfType()).to.throw(
                Error,
                "Missing/invalid chat type"
            );
        });

        it("should return true if chat is a group chat", () => {
            expect(
                bot.isChatOfType("group", {
                    type: "group",
                })
            ).to.be.true;
        });

        it("should return false if chat is not a group chat", () => {
            expect(
                bot.isChatOfType("group", {
                    type: "private",
                })
            ).to.be.false;
        });

        it("should return false if chat has no type", () => {
            expect(bot.isChatOfType("group", {})).to.be.false;
        });

        it("should return false if chat has no type", () => {
            expect(bot.isChatOfType("group", { type: "" })).to.be.false;
        });

        it("should return false if only 1 argument is passed in", () => {
            expect(bot.isChatOfType("group")).to.be.false;
        });

        it("should return false if null is passed as second argument", () => {
            expect(bot.isChatOfType("group", null)).to.be.false;
        });
    });
});
