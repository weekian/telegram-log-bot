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
        logger,
        addedToGroupHandler,
        commands = [],
        privateCommands = [],
        groupCommands = []
    ) {
        // Initialize Telegram Bot
        this.bot = new Telegram(token);

        // Store logger
        this.logger = logger;

        // Store database object and related Models
        this.database = database.db;
        this.Person = database.Person;
        this.GroupChat = database.GroupChat;
        this.Session = database.Session;

        // Registering of telegram commands
        this.registerPrivateCommands(privateCommands);
        this.registerGroupCommands(groupCommands);
        this.registerCommands(commands);
        this.handleGroupMembership(addedToGroupHandler);
    }

    // command handlers for group membership
    handleGroupMembership({
        addNewGroupChat,
        addUsersToGroupChat,
        removeUserFromGroupChat,
        deleteGroupChat,
    }) {
        this.bot.on("message", async (ctx) => {
            if (this.isChatOfType("group", ctx.chat)) {
                this.logger.info("Message received belonging to group chat");
                if (this.isBotAddedWithGroupChatCreation(ctx.message)) {
                    this.logger.info(
                        "Message on bot added with group chat creation"
                    );
                    // Added to new chat or again into chat, asks members to /register
                    ctx.reply(
                        await addNewGroupChat({
                            GroupChat: this.GroupChat,
                            chat: ctx.chat,
                        })
                    );
                } else if (this.isAddAfterGroupChatCreation(ctx.message)) {
                    this.logger.info(
                        "Message for added members after group chat creation"
                    );
                    // if bot, add group chat and ask to /register
                    // if bot and others, add bot, add others and ask rest to /register
                    // and that the following users have already been added
                    ctx.reply(
                        await addUsersToGroupChat({
                            newMembers: ctx.message.new_chat_members,
                            botId: this.bot.options.id,
                            GroupChat: this.GroupChat,
                            chat: ctx.chat,
                            logger: this.logger,
                            Person: this.Person,
                        })
                    );
                } else if (this.isDeletionFromGroupChat(ctx.message)) {
                    this.logger.info(
                        "Message is regarding deletion from group chat"
                    );
                    // if non-bot, delete user from group chat if present
                    // if bot, delete the group chat and all related sessions, cascading
                    if (
                        ctx.message.left_chat_member.id === this.bot.options.id
                    ) {
                        await deleteGroupChat({
                            chat: ctx.chat,
                            GroupChat: this.GroupChat,
                            logger: this.logger,
                        });
                    } else {
                        const message = await removeUserFromGroupChat({
                            leftMember: ctx.message.left_chat_member,
                            chat: ctx.chat,
                            GroupChat: this.GroupChat,
                            logger: this.logger,
                        });
                        // No message sent if removed user never registered
                        if (message !== null || message !== undefined) {
                            ctx.reply(message);
                        }
                    }
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
                        logger: this.logger,
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
                            logger: this.logger,
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
                            logger: this.logger,
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
