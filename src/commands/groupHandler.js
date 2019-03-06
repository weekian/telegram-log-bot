export default {
    process: async ({ chat, GroupChat }) => {
        const [groupChat, created] = await GroupChat.findOrCreate({
            where: {
                id: chat.id,
            },
        });

        if (created) {
            return "Hi guys, thanks for the add. /register to allow me to broadcast your check-ins and check-outs here.";
        }
        return "Hi guys, thanks for adding me back!. /register again to allow me to broadcast your check-ins and check-outs here.";
    },
};
