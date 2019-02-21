export default class StartHandler {
    process(name: string): string {
        return (
            `Hi ${name}, here are some handy tips to get you started.\n\n` +
            "- /checkin starts a session and /checkout ends a session.\n\n" +
            "- If you ever miss starting a session, you can always use /manual to manually log a session\n\n" +
            "- Use /all to list all the sessions that have been logged\n\n" +
            "- To log with friends, first add me to the group chat and then use /leaderboard for me to list how many daily sessions each member missed\n\n" +
            "Have fun!"
        );
    }
}
