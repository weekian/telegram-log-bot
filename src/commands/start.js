export default {
    name: "start",
    process: async ({ from, Person }) => {
        const [person, isCreated] = await Person.findOrCreate({
            where: {
                id: from.id,
                name: from.first_name,
            },
        });

        const greeting = isCreated
            ? `Hi ${person.name},`
            : `Welcome back ${person.name},`;
        const introduction =
            "\n\nIn a private chat, /checkin to begin a session. /checkout to end a session\n\nAdd me to a group chat and send /leaderboard to track everybody's logged sessions.\n\n/help to see all the other commands\n\nRemember, you are what you are willing to struggle for.\n\nGood luck!";

        return greeting.concat(introduction);
    },
};
