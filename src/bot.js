import Telegraf from "telegraf";

export default class Bot {
    constructor(token, cache, db) {
        // Register token
        this.bot = new Telegraf(token);
        this.db = db;

        // Add cache object to middleware
        this.bot.use(cache.middleware);

        // Start handlers for handling adding into chat and leaving chat
        this.registerChatAddHandler();
        this.registerGroupChatLeaveHandler();
    }

    start() {
        this.bot.launch();
    }

    registerChatAddHandler() {
        // Saves to redis and db
        // distinguishes between private and non-private chats
    }

    registerChatLeaveHandler() {
        // Applies to non-private chat, deletes group-related information stored in db
    }

    registerPrivateChatCommandHandler(command, handler) {
        this.bot.command(command, (ctx) => {
            // check against cache if chat is private. If not private, reply error message
            ctx.reply(handler.process());
        });
    }
}
