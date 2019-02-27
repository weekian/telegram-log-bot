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
            ? `Welcome back ${person.name},`
            : `Hi ${person.name},`;

        const introduction =
            "\n\nClick /checkin to begin a session. /checkout to end a session\n\nAdd me to a group chat and send /leaderboard to see everybody's logged sessions.\n\nGood luck!";

        return greeting.concat(introduction);
    },
};
