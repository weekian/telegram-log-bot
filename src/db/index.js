import Sequelize from "sequelize";
import Promise from "bluebird";

export default (url, env) => {
    return new Promise((resolve, reject) => {
        // ---------- Database Initialization ----------
        const db = new Sequelize(url, {
            timezone: "+08:00",
            dialectOptions: {
                useUTC: false,
            },
        });

        // ---------- Model Definitions ----------------
        const Person = db.import(`${__dirname}/models/person`);
        const Session = db.import(`${__dirname}/models/session`);
        const GroupChat = db.import(`${__dirname}/models/groupChat`);

        // ---------- Model Association ----------------
        GroupChat.belongsToMany(Person, {
            through: "members",
            onDelete: "cascade",
            hooks: true,
        });

        Person.belongsToMany(GroupChat, {
            through: "members",
        });

        // Defines one to many relationship for Person has many session and session belongs to one Person
        Session.belongsTo(Person); // personId added to Session
        Person.hasMany(Session);

        // ---------- (Optional) Creation of tables ----
        const forceDrop = env !== "production";
        db.sync({
            force: forceDrop,
        })
            .then(() => {
                resolve({
                    db,
                    Person,
                    Session,
                    GroupChat,
                });
            })
            .catch((err) => {
                return reject(err);
            });
    });
};
