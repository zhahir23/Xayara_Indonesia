// Generate easy-to-remember 5-character booking ID
// Format: 1 consonant + 1 vowel + 2 numbers + 1 consonant
// Example: A1K24, E7B12, O9M35
// Easy to remember because it follows phonetic patterns

const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'; // 20 consonants (no confusing letters like I, O)
const vowels = 'AEIOU'; // 5 vowels
const numbers = '0123456789'; // 10 digits

function generateBookingId() {
  const consonant1 = consonants[Math.floor(Math.random() * consonants.length)];
  const vowel = vowels[Math.floor(Math.random() * vowels.length)];
  const num1 = numbers[Math.floor(Math.random() * numbers.length)];
  const num2 = numbers[Math.floor(Math.random() * numbers.length)];
  const consonant2 = consonants[Math.floor(Math.random() * consonants.length)];
  
  return `${consonant1}${vowel}${num1}${num2}${consonant2}`;
}

// Alternative: Word-like patterns (easier to remember)
// Format: 2 letters + 3 numbers
// Example: AB123, XY789
function generateBookingIdWordLike() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // No I, O to avoid confusion
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const num1 = numbers[Math.floor(Math.random() * numbers.length)];
  const num2 = numbers[Math.floor(Math.random() * numbers.length)];
  const num3 = numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${letter1}${letter2}${num1}${num2}${num3}`;
}

// Check if booking ID already exists in database
async function isBookingIdUnique(pool, bookingId) {
  const result = await pool.query(
    'SELECT booking_id FROM reservations WHERE booking_id = $1',
    [bookingId]
  );
  return result.rows.length === 0;
}

// Generate unique booking ID (with collision check)
async function generateUniqueBookingId(pool, maxAttempts = 100) {
  let attempts = 0;
  let bookingId;
  
  while (attempts < maxAttempts) {
    bookingId = generateBookingIdWordLike(); // Using word-like pattern for easier memory
    
    if (await isBookingIdUnique(pool, bookingId)) {
      return bookingId;
    }
    
    attempts++;
  }
  
  throw new Error('Failed to generate unique booking ID after maximum attempts');
}

module.exports = {
  generateBookingId,
  generateBookingIdWordLike,
  generateUniqueBookingId
};
