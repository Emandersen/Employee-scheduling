const { calculateOverwork } = require('../functions/dateHandler'); // Adjust the path as needed

describe('calculateOverwork', () => {
  test('should calculate overwork for today', async () => {
    // Mock data
    const MockSchedule = [
      {
        email: "example@example.com",
        date: "2024-05-10",
        startTime: "09:00",
        endTime: "17:00"
      }
    ];
    const timeStamp = { email: "example@example.com", verified: true, startTime: "08:00", endTime: "17:00" };
    const req = { session: { user: { email: "example@example.com" } } };
    const res = { redirect: jest.fn() };
    const result = calculateOverwork(req, res, timeStamp, MockSchedule);
    
    // Assert the result
    expect(result).toBe(1); // Expected overwork hours
  });
});
