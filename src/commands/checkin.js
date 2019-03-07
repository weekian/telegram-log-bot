import moment from "moment";
import Promise from "bluebird";

export default {
    name: "checkin",
    process: async ({ message, from, Person, Session, telegram }) => {
        // finds person or creates new if doesn't exist
        const [person, created] = await Person.findOrCreate({
            where: {
                id: from.id,
            },
        });

        // Check for ongoing sessions
        if (!created) {
            const hasPendingCheckouts =
                (await Session.count({
                    where: {
                        checkoutTimestamp: {
                            $eq: null,
                        },
                        id: {
                            $eq: person.id
                        },
                    },
                })) !== 0;

            if (hasPendingCheckouts) {
                return `Hi ${
                    from.first_name
                }, you have an ongoing session. Do you mean /checkout?`;
            }
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

        // broadcast to registered group chats
        if (!created) {
            const broadcastPromises = [];
            const groupChats = await person.getGroupChats();
            for (let i = 0; i < groupChats.length; i += 1) {
                broadcastPromises.push(
                    telegram.sendMessage(
                        groupChats[i].id,
                        `Hi everyone, ${from.first_name} ` +
                            `has checked in at ${displayLocalTime}`
                    )
                );
            }
            await Promise.all(broadcastPromises);
        }

        return `Hi ${
            from.first_name
        }, you have checked in at ${displayLocalTime}`;
    },
};
