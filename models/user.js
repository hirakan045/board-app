'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "利用者は必須です。"
        }
      }
    },
    pass: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "パスワードは必須です。"
        }
      }
    },
    mail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "メールアドレスを入力してください"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "整数を入力してください。"
        },
        min: {
          args:[0],
          msg: "ゼロ以上の値が必要です。"
        }
      }
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Board);
  };
  return User;
};
