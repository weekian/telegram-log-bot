export default (sequelize, DataTypes) => {
    return sequelize.define("person", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    });
};
