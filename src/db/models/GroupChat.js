export default (sequelize, DataTypes) => {
    return sequelize.define("chat", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    });
};
