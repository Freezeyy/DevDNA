import sequelize from '../config/db.js';
import defineUserProfile from './UserProfile.js';
import defineRepository from './Repository.js';
import defineAnalysis from './Analysis.js';

const UserProfile = defineUserProfile(sequelize);
const Repository = defineRepository(sequelize);
const Analysis = defineAnalysis(sequelize);

// ─── Associations ────────────────────────────────────────────
UserProfile.hasMany(Repository, {
  foreignKey: { name: 'userProfileId', allowNull: false },
  as: 'repositories',
  onDelete: 'CASCADE',
});
Repository.belongsTo(UserProfile, { foreignKey: 'userProfileId', as: 'owner' });

UserProfile.hasMany(Analysis, {
  foreignKey: { name: 'userProfileId', allowNull: false },
  as: 'analyses',
  onDelete: 'CASCADE',
});
Analysis.belongsTo(UserProfile, { foreignKey: 'userProfileId', as: 'owner' });

/**
 * Sync all models with the database. In production prefer migrations,
 * but sync keeps local development friction-free.
 */
export async function syncModels() {
  await sequelize.sync();
}

export { sequelize, UserProfile, Repository, Analysis };
