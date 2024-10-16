const { execSync } = require('child_process');

try {
  // Run Prisma generate
  console.log('Running Prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Run the build command
  console.log('Running build command...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}