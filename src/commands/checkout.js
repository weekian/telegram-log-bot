import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

export default {
    name: "checkout",
    process: async ({ message, from, Person }) => {
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

        const displayLocalEndTime = moment(localEndTime).format(
            "h:mA [on] dddd, Do MMMM YYYY"
        );

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
