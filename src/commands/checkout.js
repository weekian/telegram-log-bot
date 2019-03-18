import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import Promise from "bluebird";

momentDurationFormatSetup(moment);

export default {
    name: "checkout",
    process: async ({ message, from, Person, telegram }) => {
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

        const groupChats = await person.getGroupChats();
        const broadcastPromises = [];
        for (let i = 0; i < groupChats.length; i += 1) {
            broadcastPromises.push(
                telegram.sendMessage(
                    groupChats[i].id,
                    `Hi everyone, ${from.first_name} has ` +
                        `checked out at ${displayLocalEndTime}` +
                        ` and logged a duration of ${formattedDuration}`
                )
            );
        }
        const broadcastResults = await Promise.all(
            broadcastPromises.map((promise) => {
                return promise
                    .then((result) => {
                        return {
                            success: true,
                            result,
                        };
                    })
                    .catch((error) => {
                        return {
                            success: false,
                            error,
                        };
                    });
            })
        );

        for (let i = 0; i < broadcastResults.length; i += 1) {
            if (!broadcastResults[i].success) {
                console.log(
                    "Error broadcasting message with error: ",
                    broadcastResults[i].error
                );
            }
        }

        return (
            `Hi ${from.first_name}, ` +
            `you have checked out at ${displayLocalEndTime}. ` +
            `Total duration for this session is ${formattedDuration}.` +
            "\n\nWell done!"
        );
    },
};
