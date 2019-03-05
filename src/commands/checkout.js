import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

export default {
    name: "checkout",
    process: async ({
        message,
        from,
        database,
        Person,
        GroupChat,
        Session,
    }) => {
        // 1. findOrCreate Person
        // 2. If created is true, return no active session error
        // 3. get array session index 0 where checkoutTimestamp is null
        // 4. if array is empty, return error
        // 5. set the checkoutTimestamp to message.date
        // 6. calculate the duration from session.checkinTimestamp to session.checkoutTimestamp and format it to human-friendly
        // 7. Return formatted success message
        const [person, created] = await Person.findOrCreate({
            where: {
                id: from.id,
            },
        });

        if (created) {
            return (
                `Hi ${from.first_name}, you do not have any ongoing session.` +
                ` Do you mean to /checkin?`
            );
        }

        // Add check to send error if retrieved sessions is > 1
        const sessions = await person.getSessions({
            where: {
                checkoutTimestamp: {
                    $eq: null,
                },
            },
        });

        if (sessions.length === 0) {
            return (
                `Hi ${from.first_name}, you do not have any ongoing session.` +
                ` Do you mean to /checkin?`
            );
        }
        // Converts Unix (utc) timestamp to SG time
        const localEndTime = moment
            .unix(message.date)
            .utc()
            .utcOffset("+08:00");

        let activeSession = sessions[0];
        activeSession = await activeSession.update({
            checkoutTimestamp: localEndTime.toDate(),
        });

        const displayLocalEndTime = moment(
            activeSession.checkoutTimestamp
        ).format("h:mA [on] dddd, Do MMMM YYYY");

        const sessionEndTime = moment(activeSession.checkoutTimestamp);
        const sessionStartTime = moment(activeSession.checkinTimestamp);

        const formattedDuration = moment
            .duration(sessionEndTime.diff(sessionStartTime))
            .format("h[hr] m[min]");

        return (
            `Hi ${from.first_name}, ` +
            `you have checked out at ${displayLocalEndTime}. ` +
            `Total duration for this session is ${formattedDuration}.` +
            "\n\nWell done!"
        );
    },
};
