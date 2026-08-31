const pool = require('../config/database');

async function insertAdmin() {
  try {
    // First, run the migration to create the admins table
    console.log('Creating admins table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

      CREATE OR REPLACE FUNCTION update_admins_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
      CREATE TRIGGER update_admins_updated_at
        BEFORE UPDATE ON admins
        FOR EACH ROW
        EXECUTE FUNCTION update_admins_updated_at_column();
    `);
    console.log('Admins table created successfully');

    // Insert admin credentials
    const email = 'admin@xayara.com';
    const passwordHash = '$2a$10$03Xa1YodTQCvAH5HkUvGKepnn4QVaYOTn9OawpX5PBHpBqxleaoPi';
    const role = 'admin';

    console.log('Inserting admin credentials...');
    const result = await pool.query(
      'INSERT INTO admins (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET password_hash = $2, updated_at = CURRENT_TIMESTAMP RETURNING *',
      [email, passwordHash, role]
    );

    console.log('Admin inserted/updated successfully:', result.rows[0]);
    console.log('\nIMPORTANT: Save this password for login:');
    console.log('Email: admin@xayara.com');
    console.log('Password: %R2xj%He');

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

insertAdmin();
