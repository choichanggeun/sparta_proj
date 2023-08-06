'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Posts 모델이 다른 모델과 어떻게 연결되는지 정의 하는 부분 belongsTo로
      //Users에 UserId를 외래키로 등록 즉 Posts는 Users에 속한다.
      this.belongsTo(models.Users, {
        targetKey: 'userId', //해당 모델(Users)의 기본 키
        foreignKey: 'UserId', // Posts에서 외래 키로 설정 될 키 외래키는 대문자를 사용
      });

      this.hasMany(models.Comments, {
        //comments 모델에게 1:N관계를 맺음
        sourceKey: 'postId',
        foreignKey: 'PostId',
      });

      this.hasMany(models.Likes, {
        //likes 모델에게 1:N관계를 맺음
        sourceKey: 'postId',
        foreignKey: 'PostId',
      });
    }
  }

  Posts.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      content: {
        type: DataTypes.STRING,
      },

      title: {
        type: DataTypes.STRING,
      },
      like: {
        defaultValue: 0,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Posts', // Posts 모델 클래스를 반환하며 이 모델은 다른 파일에서 가져와 데이터베이스 작업을 수행하는 데 사용된다.
    }
  );
  return Posts;
};
