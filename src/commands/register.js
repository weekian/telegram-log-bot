export default {
    name: "register",
    process: async ({
        message,
        from,
        chat,
        database,
        Person,
        GroupChat,
        Session,
    }) => {
        const [person] = await Person.findOrCreate({
            where: {
                id: from.id,
            },
        });

        const groupChat = await GroupChat.findOne({
            where: {
                id: chat.id,
            },
        });

        const isPersonAlreadyRegistered = await groupChat.hasPerson(person.id);

        if (isPersonAlreadyRegistered) {
            return (
                `Hi ${from.first_name}, you are already registered. ` +
                `Start logging your sessions!`
            );
        }
        await groupChat.addPerson(person.id);
        return (
            `Hi ${from.first_name}, you have been registered. ` +
            `Your subsequent check-ins and check-outs will be broadcasted to this chat.`
        );
    },
};
