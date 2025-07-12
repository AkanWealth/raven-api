// Account model definition (example for Sequelize or similar ORM)
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  });
  return Account;
};

