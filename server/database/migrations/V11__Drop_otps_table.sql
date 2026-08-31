-- Drop OTPs table and cleanup function (no longer used after removing admin OTP login)
DROP FUNCTION IF EXISTS cleanup_expired_otps();
DROP TABLE IF EXISTS otps;
