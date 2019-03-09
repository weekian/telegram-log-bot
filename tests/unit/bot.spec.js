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

    describe("isBotAddedWithGroupChatCreation method", () => {
        it("should be a function", () => {
            expect(typeof bot.isBotAddedWithGroupChatCreation).to.equal(
                "function"
            );
        });

        it("should return false if bot is not added with group chat", () => {
            expect(
                bot.isBotAddedWithGroupChatCreation({
                    new_chat_members: [],
                })
            ).to.be.false;
        });

        it("should return false if no argument is passed into method", () => {
            expect(bot.isBotAddedWithGroupChatCreation()).to.be.false;
        });

        it("should return false if null is passed into method", () => {
            expect(bot.isBotAddedWithGroupChatCreation(null)).to.be.false;
        });

        it("should return false if empty object is passed into method", () => {
            expect(bot.isBotAddedWithGroupChatCreation({})).to.be.false;
        });

        it("should return true if bot is added with group chat creation", () => {
            expect(
                bot.isBotAddedWithGroupChatCreation({
                    group_chat_created: true,
                })
            ).to.be.true;
        });
    });

    describe("isAddAfterGroupChatCreation method", () => {
        it("should be have a function isAddAfterGroupChatCreation", () => {
            expect(typeof bot.isAddAfterGroupChatCreation).to.equal("function");
        });

        it("should return true if argument has new_chat_members property which is an array", () => {
            expect(
                bot.isAddAfterGroupChatCreation({
                    new_chat_members: [],
                })
            ).to.be.true;
        });

        it("should return false if argument has non-array new_chat_members property", () => {
            expect(
                bot.isAddAfterGroupChatCreation({
                    new_chat_members: 4,
                })
            ).to.be.false;
        });

        it("should return false if argument has undefined new_chat_members property", () => {
            expect(
                bot.isAddAfterGroupChatCreation({
                    new_chat_members: undefined,
                })
            ).to.be.false;
        });

        it("should return false if argument has null new_chat_members property", () => {
            expect(
                bot.isAddAfterGroupChatCreation({
                    new_chat_members: null,
                })
            ).to.be.false;
        });

        it("should return false if argument has no new_chat_members property", () => {
            expect(bot.isAddAfterGroupChatCreation({})).to.be.false;
        });

        it("should return false if no argument is passed into method", () => {
            expect(bot.isAddAfterGroupChatCreation()).to.be.false;
        });

        it("should return false if undefined is passed into method", () => {
            expect(bot.isAddAfterGroupChatCreation(undefined)).to.be.false;
        });

        it("should return false if null is passed into method", () => {
            expect(bot.isAddAfterGroupChatCreation(null)).to.be.false;
        });
    });

    describe("isDeletionFromGroupChat method", () => {
        it("should have a isDeletionFromGroupChat function", () => {
            expect(typeof bot.isDeletionFromGroupChat).to.equal("function");
        });

        it("should return true if it is a deletion update message", () => {
            expect(
                bot.isDeletionFromGroupChat({
                    left_chat_member: {},
                })
            ).to.be.true;
        });

        it("should return false if no argument is passed into method", () => {
            expect(bot.isDeletionFromGroupChat()).to.be.false;
        });

        it("should return false if null argument is passed into method", () => {
            expect(bot.isDeletionFromGroupChat(null)).to.be.false;
        });

        it("should return false if undefined argument is passed into method", () => {
            expect(bot.isDeletionFromGroupChat(undefined)).to.be.false;
        });

        it("should return false if object argument has no properties is passed into method", () => {
            expect(bot.isDeletionFromGroupChat({})).to.be.false;
        });

        it("should return false if left_chat_member property is not an object is passed into method", () => {
            expect(bot.isDeletionFromGroupChat({ left_chat_member: 4 })).to.be
                .false;
        });

        it("should return false if left_chat_member property is null is passed into method", () => {
            expect(bot.isDeletionFromGroupChat({ left_chat_member: null })).to
                .be.false;
        });

        it("should return false if left_chat_member property is null is passed into method", () => {
            expect(bot.isDeletionFromGroupChat({ left_chat_member: undefined }))
                .to.be.false;
        });
    });
});
