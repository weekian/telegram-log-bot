/*
Note
If ctx.message.group_chat_created is true means create with group chat
If ctx.message.new_chat_members contains bot then is added to group chat
If ctx.message.left_chat_member is bot's id then bot is deleted
 */

export default class Bot {
    constructor(
        Telegram,
        token,
        env,
        database,
        addedToGroupHandler,
        commands = [],
        privateCommands = [],
        groupCommands = []
    ) {
        // Initialize Telegram Bot
        this.bot = new Telegram(token);

        // Store database object and related Models
        this.database = database.db;
        this.Person = database.Person;
        this.GroupChat = database.GroupChat;
        this.Session = database.Session;

        // Registering of telegram commands
        this.registerPrivateCommands(privateCommands);
        this.registerGroupCommands(groupCommands);
        this.registerCommands(commands);
        this.handleAddedToGroup(addedToGroupHandler);
    }

    // command handlers for group membership
    handleGroupMembership(handler) {
        this.bot.on("message", async (ctx) => {
            if (this.isChatOfType("group", ctx.chat)) {
                if (this.isBotAddedWithGroupChatCreation(ctx.message)) {
                    // Add Group Chat
                } else if (this.isAddAfterGroupChatCreation(ctx.message)) {
                    // (optional) Add Group Chat if bot is inside
                    // (optional) register other users if got others
                } else if (this.isDeletionFromGroupChat(ctx.message)) {
                    // handle deletion from group chat of self or user
                    // Good to have: If chat has no members left (1 for self), delete group chat
                }
            }
        });
    }

    // Command handlers for all types of chats
    registerCommands(commands) {
        commands.forEach((command) => {
            this.bot.command(command.name, async (ctx) => {
                ctx.reply(
                    await command.process({
                        message: ctx.message,
                        from: ctx.from,
                        chat: ctx.chat,
                        database: this.database,
                        Person: this.Person,
                        GroupChat: this.GroupChat,
                        Session: this.Session,
                    })
                );
            });
        }, this);
    }

    // Command handlers for private chats
    registerPrivateCommands(privateCommands) {
        privateCommands.forEach((command) => {
            this.bot.command(command.name, async (ctx) => {
                if (this.isChatOfType("private", ctx.chat)) {
                    ctx.reply(
                        await command.process({
                            message: ctx.message,
                            from: ctx.from,
                            telegram: ctx.telegram,
                            database: this.database,
                            Person: this.Person,
                            GroupChat: this.GroupChat,
                            Session: this.Session,
                        })
                    );
                } else {
                    ctx.reply(
                        "Oops, this command is reserved for private chats only. /help if unsure"
                    );
                }
            });
        }, this);
    }

    // Command handlers for group chats
    registerGroupCommands(groupCommands) {
        groupCommands.forEach((command) => {
            this.bot.command(command.name, async (ctx) => {
                if (this.isChatOfType("group", ctx.chat)) {
                    ctx.reply(
                        await command.process({
                            from: ctx.from,
                            chat: ctx.chat,
                            database: this.database,
                            Person: this.Person,
                            GroupChat: this.GroupChat,
                            Session: this.Session,
                        })
                    );
                } else {
                    ctx.reply(
                        "Oops, this command is reserved for group chats only. /help if unsure"
                    );
                }
            });
        }, this);
    }

    // Command handlers for add to group
    handleAddedToGroup(handler) {
        this.bot.on("message", async (ctx) => {
            if (this.isAddedToGroupChat(ctx.message)) {
                ctx.reply(
                    await handler.process({
                        chat: ctx.chat,
                        database: this.database,
                        Person: this.Person,
                        GroupChat: this.GroupChat,
                        Session: this.Session,
                    })
                );
            }
        });
    }

    // Checks if message is regarding deletion from group chat
    isDeletionFromGroupChat(message) {
        return (
            !!message &&
            !!message.left_chat_member &&
            typeof message.left_chat_member === "object"
        );
    }

    // Checks if message is regarding addition of members (may be bot) after group chat creation
    isAddAfterGroupChatCreation(message) {
        return !!message && Array.isArray(message.new_chat_members);
    }

    // Checks if bot is created when group chat is created
    isBotAddedWithGroupChatCreation(message) {
        return !!message && !!message.group_chat_created;
    }

    // Checks if message originates from a group or private chat
    isChatOfType(type, chat) {
        if (!type || type.length === 0) {
            throw new Error("Missing/invalid chat type");
        }
        return !!chat && chat.type === type;
    }

    async start() {
        // Configure to group chat commands that contain bot username
        const botInfo = await this.bot.telegram.getMe();
        this.bot.options.username = botInfo.username;
        this.bot.options.id = botInfo.id;

        // Starts listening for messages
        this.bot.startPolling();
    }
}
