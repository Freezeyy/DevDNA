import { DataTypes } from 'sequelize';

/**
 * A single public repository belonging to a UserProfile.
 */
export default function defineRepository(sequelize) {
  return sequelize.define(
    'Repository',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      forks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      watchers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      openIssues: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Full language breakdown (bytes per language) from the GraphQL API.
      languages: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      topics: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      isFork: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      githubCreatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      githubUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      githubPushedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'repositories',
      timestamps: true,
    },
  );
}
