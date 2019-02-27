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

        this.bot.on("message", (ctx) => {
            console.log("Unknown command received");
            console.log(JSON.stringify(ctx.message, null, 4));
            console.log(JSON.stringify(ctx.chat, null, 4));
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
            this.bot.command(command.name, (ctx) => {
                if (this.isPrivateChat(ctx.chat)) {
                    ctx.reply(
                        command.process({
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
                        "Oops, this command is reserved for private chats only. Send /help unsure"
                    );
                }
            });
        }, this);
    }

    // Command handlers for group chats
    registerGroupCommands(groupCommands) {
        groupCommands.forEach((command) => {
            this.bot.command(command.name, (ctx) => {
                if (!this.isPrivateChat(ctx.chat)) {
                    ctx.reply(
                        command.process({
                            database: this.database,
                            Person: this.Person,
                            GroupChat: this.GroupChat,
                            Session: this.Session,
                        })
                    );
                } else {
                    ctx.reply(
                        "Oops, this command is reserved for group chats only. Send /help if unsure"
                    );
                }
            });
        }, this);
    }

    // Command handlers for add to group
    handleAddedToGroup(handler) {
        // logic here
    }

    isPrivateChat(chat) {
        return chat && chat.type && chat.type === "private";
    }

    async start() {
        // Configure to group chat commands that contain bot username
        const botInfo = await this.bot.telegram.getMe();
        this.bot.options.username = botInfo.username;

        // Starts listening for messages
        this.bot.startPolling();
    }
}
