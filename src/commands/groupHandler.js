import Promise from "bluebird";

const partition = (array, botId) =>
    array.reduce(
        ([bot, others], member) => {
            return member.id === botId
                ? [[...bot, member], others]
                : [bot, [...others, member]];
        },
        [[], []]
    );

const addNewMember = async ({ groupChat, member, Person }) => {
    // create or retrieve the user
    const [person, created] = await Person.findOrCreate({
        where: {
            id: member.id,
        },
    });

    // Add if new person or hasPerson
    if (created || !(await groupChat.hasPerson(member.id))) {
        await groupChat.addPerson(person.id);
        return {
            first_name: member.first_name,
            isAdded: true,
        };
    }
    return {
        first_name: member.first_name,
        isAdded: false,
    };
};

export default {
    addNewGroupChat: async ({ chatId, GroupChat }) => {
        const [groupChat, created] = await GroupChat.findOrCreate({
            where: {
                id: chatId,
            },
        });

        return "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here.";
    },
    addUsersToGroupChat: async ({
        newMembers,
        botId,
        GroupChat,
        chat,
        Person,
        logger,
    }) => {
        // Split the new members into 2 arrays, the first being the bot, second being the rest
        let message = "";
        const [groupChat] = await GroupChat.findOrCreate({
            where: {
                id: chat.id,
            },
        });
        const [botArr, otherMembersArr] = partition(newMembers, botId);

        // If bot is in the first array
        if (botArr.length > 0) {
            message =
                "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here.";
        }

        if (otherMembersArr.length > 0) {
            if (message.length !== 0) {
                message += "\n";
            } else {
                message = "Hello new joiners,\n";
            }

            const handleNewMemberPromises = [];
            for (let i = 0; i < otherMembersArr.length; i += 1) {
                handleNewMemberPromises.push(
                    addNewMember({
                        groupChat,
                        member: otherMembersArr[i],
                        Person,
                    })
                );
            }
            const addMemberResults = await Promise.all(handleNewMemberPromises);

            for (let i = 0; i < addMemberResults.length; i += 1) {
                const processedAddNewMember = addMemberResults[i];
                if (processedAddNewMember.isAdded) {
                    message += `\n@${
                        processedAddNewMember.first_name
                    } is automatically registered`;
                } else {
                    message += `\n@${
                        processedAddNewMember.first_name
                    } is already registered`;
                }
            }
        }
        return message;
    },
    removeUserFromGroupChat: async ({ leftMember, botId }) => {},
};
