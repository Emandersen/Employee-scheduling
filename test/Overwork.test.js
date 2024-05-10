const { calculateOverwork } = require('../functions/dateHandler');

// Test suite for calculateOverwork function
describe('calculateOverwork', () => {
  // Test case for calculating overwork with 37 work hours
  test('should return 0 when the nurse works exactly 37 hours', () => {
    const workHours = 37;
    const overwork = calculateOverwork(workHours);
    expect(overwork).toBe(0);
  });

  // Test case for calculating overwork when the nurse works more than 37 hours
  test('should return the correct overwork hours when the nurse works more than 37 hours', () => {
    const workHours = 40; // Example: Nurse worked 3 hours over 37
    const expectedOverwork = 3;
    const overwork = calculateOverwork(workHours);
    expect(overwork).toBe(expectedOverwork);
  });

  // Add more test cases for edge cases, negative scenarios, etc.
});
