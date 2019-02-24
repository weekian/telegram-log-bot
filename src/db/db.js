import Sequelize from "sequelize";

export default (url) => {
    // Initialize connection to database
    const db = new Sequelize(url, {
        timezone: "+08:00",
    });

    const Person = db.import(`${__dirname}/models/person`);
    const Session = db.import(`${__dirname}/models/session`);
    const Chat = db.import(`${__dirname}/models/chat`);

    // Defines many to many relationship for Chat has many Person and Person has many chat
    Chat.belongsToMany(Person, {
        through: "member",
    });

    Person.belongsToMany(Chat, {
        through: "member",
    });

    // Defines one to many relationship for Person has many session and session belongs to one Person
    Session.hasOne(Person);
    Person.hasMany(Session);

    // Creation of tables if not already created
    Person.sync();
    Session.sync();
    Chat.sync();

    return {
        db,
        Person,
        Session,
        Chat,
    };
};
