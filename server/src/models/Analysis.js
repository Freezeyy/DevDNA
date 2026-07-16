import { DataTypes } from 'sequelize';

/**
 * A computed analytics run for a UserProfile. The most recent row also
 * serves as the cache record (freshness is derived from `generatedAt`).
 */
export default function defineAnalysis(sequelize) {
  return sequelize.define(
    'Analysis',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      // Aggregated metrics: totals, most active repos, timelines, categories.
      metrics: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      // Language name -> percentage / bytes breakdown.
      languageStats: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      // AI-generated (or rule-based fallback) narrative insights.
      insights: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      generatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'analyses',
      timestamps: true,
    },
  );
}
