export default {
    name: "checkin",
    process: async ({
        message,
        from,
        database,
        Person,
        GroupChat,
        Session,
    }) => {
        return "checkin";
    },
};
