const userNormWorkHours = require('../functions/dateHandler'); // Assuming the function is in a separate file

describe('userNormWorkHours', () => {
  // Define a mock schedule data for testing
  const mockSchedule = [
    { email: 'user1@example.com', date: '2024-01-15', workHours: 8 },
    { email: 'user1@example.com', date: '2024-04-15', workHours: 7 },
    { email: 'user1@example.com', date: '2024-07-15', workHours: 6 },
    { email: 'user1@example.com', date: '2024-10-15', workHours: 8 }
    // Add more sample data for testing if needed
  ];

  test('calculates accumulative work hours by quarter', () => {
    // Mock the request session user
    const req = { session: { user: { email: 'user1@example.com' } } };
    // Call the function with the mock schedule
    const result = userNormWorkHours(mockSchedule, req);
    // Define expected result based on the mock data
    const expected = [8, 7, 6, 8]; // Expected accumulative work hours for each quarter

    // Assert that the result matches the expected values
    expect(result).toEqual(expected);
  });

  // Add more tests as needed to cover different scenarios
});
