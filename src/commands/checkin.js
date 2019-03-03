import moment from "moment";

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
        // finds person or creates new if doesn't exist
        const [person] = await Person.findOrCreate({
            where: {
                id: from.id,
            },
            defaults: {
                name: from.first_name,
            },
        });

        const hasPendingCheckouts =
            (await Session.count({
                where: {
                    checkoutTimestamp: {
                        $eq: null,
                    },
                },
            })) !== 0;

        if (hasPendingCheckouts) {
            return `Hi ${
                person.name
            }, you have an ongoing session. Do you mean /checkout?`;
        }
        // Converts Unix (utc) timestamp to SG time
        const localTime = moment
            .unix(message.date)
            .utc()
            .utcOffset("+08:00");

        // Creates Session associated to person
        const session = await person.createSession({
            checkinTimestamp: localTime.toDate(),
        });

        const displayLocalTime = moment(session.checkinTimestamp).format(
            "h:mA [on] dddd, Do MMMM YYYY"
        );

        return `Hi ${person.name}, you have checked in at ${displayLocalTime}`;
    },
};
