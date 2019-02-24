import Sequelize from "sequelize";
import Promise from "bluebird";

export default (url, env) => {
    return new Promise((resolve, reject) => {
        // ---------- Database Initialization ----------
        const db = new Sequelize(url, {
            timezone: "+08:00",
        });

        // ---------- Model Definitions ----------------
        const Person = db.import(`${__dirname}/models/person`);
        const Session = db.import(`${__dirname}/models/session`);
        const Chat = db.import(`${__dirname}/models/chat`);

        // ---------- Model Association ----------------
        Chat.belongsToMany(Person, {
            through: "member",
        });

        Person.belongsToMany(Chat, {
            through: "member",
        });

        // Defines one to many relationship for Person has many session and session belongs to one Person
        Session.hasOne(Person);
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
                    Chat,
                });
            })
            .catch((err) => {
                return reject(err);
            });
    });
};
