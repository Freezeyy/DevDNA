import { DataTypes } from 'sequelize';

/**
 * A GitHub user's public profile snapshot.
 */
export default function defineUserProfile(sequelize) {
  return sequelize.define(
    'UserProfile',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      githubId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      blog: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      followers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      following: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      publicRepos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      githubCreatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'user_profiles',
      timestamps: true,
    },
  );
}
