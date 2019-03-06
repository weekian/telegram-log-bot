export default (sequelize, DataTypes) => {
    return sequelize.define("groupChat", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    });
};
