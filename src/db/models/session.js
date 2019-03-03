export default (sequelize, DataTypes) => {
    return sequelize.define("session", {
        personId: {
            type: DataTypes.INTEGER,
            model: "persons",
            key: "id",
            deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE,
            primaryKey: true,
        },
        checkinTimestamp: {
            type: DataTypes.DATE,
            primaryKey: true,
        },
        checkoutTimestamp: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
};

// Todo: Implement check for checkout not before checkin
