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
                if (this.isPrivateChat(ctx.chat)) {
                    ctx.reply(
                        await command.process({
                            message: ctx.message,
                            from: ctx.from,
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
                if (!this.isPrivateChat(ctx.chat)) {
                    ctx.reply(
                        await command.process({
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

    isAddedToGroupChat(message) {
        return (
            !!message &&
            (message.group_chat_created ||
                (!!message.new_chat_members &&
                    message.new_chat_members.some(
                        (e) => e.id === this.bot.options.id
                    )))
        );
    }

    isPrivateChat(chat) {
        return !!chat && chat.type === "private";
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
