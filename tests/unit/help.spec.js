import { describe, it } from "mocha";
import expect from "../utility";
import helpCommand from "../../src/commands/help";

describe("/help command", () => {
    it("should be triggered when '/help' command is sent", () => {
        expect(helpCommand.name).to.equal("help");
    });

    it("should return a message to help users", async () => {
        const result = await helpCommand.process();
        expect(result).to.equal(
            "In a private chat, /checkin to start a session. When you are done, /checkout to end that session.\n\n/manual to log a session if you forgot to start or end a session.\n\n/all to list all your logged sessions and /skip to use your free monthly cheat day.\n\nAdd me to a group chat to track the rest of the members and see how many sessions they have logged.\n\nGood luck!"
        );
    });
});
