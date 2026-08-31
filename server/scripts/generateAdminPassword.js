const bcrypt = require('bcryptjs');

// Generate random 8-character password
const generatePassword = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const password = generatePassword(8);
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  
  console.log('Generated password:', password);
  console.log('Password hash:', hash);
  console.log('\nSQL to insert admin:');
  console.log(`INSERT INTO admins (email, password_hash, role) VALUES ('admin@xayara.com', '${hash}', 'admin');`);
});
