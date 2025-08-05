import { db } from './index';
import { 
  createUser, 
  createGenre, 
  createType, 
  createYear, 
  createTag, 
  createSystemSetting 
} from './index';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Create default admin user
    const adminUser = await createUser({
      email: 'admin@cinehub.com',
      username: 'admin',
      fullName: 'Administrator',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    });

    if (adminUser.success) {
      console.log('✅ Admin user created');
    } else {
      console.log('⚠️ Admin user already exists or failed to create');
    }

    // Create default movie types
    const movieTypes = [
      { name: 'Movie', slug: 'movie' },
      { name: 'TV Series', slug: 'tv-series' },
      { name: 'Documentary', slug: 'documentary' },
      { name: 'Anime', slug: 'anime' }
    ];

    for (const type of movieTypes) {
      const result = await createType(type);
      if (result.success) {
        console.log(`✅ Type "${type.name}" created`);
      } else {
        console.log(`⚠️ Type "${type.name}" already exists or failed to create`);
      }
    }

    // Create default genres
    const defaultGenres = [
      { name: 'Action', slug: 'action', description: 'Action movies and series' },
      { name: 'Comedy', slug: 'comedy', description: 'Comedy movies and series' },
      { name: 'Drama', slug: 'drama', description: 'Drama movies and series' },
      { name: 'Horror', slug: 'horror', description: 'Horror movies and series' },
      { name: 'Sci-Fi', slug: 'sci-fi', description: 'Science fiction movies and series' },
      { name: 'Thriller', slug: 'thriller', description: 'Thriller movies and series' },
      { name: 'Romance', slug: 'romance', description: 'Romance movies and series' },
      { name: 'Adventure', slug: 'adventure', description: 'Adventure movies and series' }
    ];

    for (const genre of defaultGenres) {
      const result = await createGenre(genre);
      if (result.success) {
        console.log(`✅ Genre "${genre.name}" created`);
      } else {
        console.log(`⚠️ Genre "${genre.name}" already exists or failed to create`);
      }
    }

    // Create years (2020-2024)
    for (let year = 2020; year <= 2024; year++) {
      const result = await createYear({ year });
      if (result.success) {
        console.log(`✅ Year ${year} created`);
      } else {
        console.log(`⚠️ Year ${year} already exists or failed to create`);
      }
    }

    // Create default tags
    const defaultTags = [
      { name: 'New Release', slug: 'new-release' },
      { name: 'Popular', slug: 'popular' },
      { name: 'Trending', slug: 'trending' },
      { name: 'Award Winner', slug: 'award-winner' },
      { name: 'Critically Acclaimed', slug: 'critically-acclaimed' }
    ];

    for (const tag of defaultTags) {
      const result = await createTag(tag);
      if (result.success) {
        console.log(`✅ Tag "${tag.name}" created`);
      } else {
        console.log(`⚠️ Tag "${tag.name}" already exists or failed to create`);
      }
    }

    // Create default system settings
    const defaultSettings = [
      { key: 'site_name', value: 'CineHub', description: 'Site name' },
      { key: 'site_description', value: 'Your ultimate movie and TV series platform', description: 'Site description' },
      { key: 'site_url', value: 'https://cinehub.com', description: 'Site URL' },
      { key: 'admin_email', value: 'admin@cinehub.com', description: 'Admin email' },
      { key: 'max_upload_size', value: '10MB', description: 'Maximum file upload size' },
      { key: 'allow_registration', value: 'true', description: 'Allow user registration' },
      { key: 'require_email_verification', value: 'false', description: 'Require email verification' },
      { key: 'default_user_role', value: 'user', description: 'Default role for new users' }
    ];

    for (const setting of defaultSettings) {
      const result = await createSystemSetting(setting);
      if (result.success) {
        console.log(`✅ Setting "${setting.key}" created`);
      } else {
        console.log(`⚠️ Setting "${setting.key}" already exists or failed to create`);
      }
    }

    console.log('✅ Database initialization completed!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization script failed:', error);
      process.exit(1);
    });
} 