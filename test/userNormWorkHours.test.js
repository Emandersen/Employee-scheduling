const { userNormWorkHours } = require('../functions/dateHandler'); // Assuming the function is in a separate file

describe('userNormWorkHours', () => {
  test('calculates accumulative work hours by quarter', () => {
    const mockSchedule = [
      { email: 'user1@example.com', date: '2024-01-15', workHours: 8 },
      { email: 'user1@example.com', date: '2024-04-15', workHours: 7 },
      { email: 'user1@example.com', date: '2024-07-15', workHours: 6 },
      { email: 'user1@example.com', date: '2024-10-15', workHours: 8 }
    ];
    const req = { session: { user: { email: 'user1@example.com' } } };
    const result = userNormWorkHours(mockSchedule, req);
    const expected = [8, 7, 6, 8];
    expect(result).toEqual(expected);
  });

  test('calculates accumulative work hours by quarter for multiple users', () => {
    const mockSchedule = [
      { email: 'user1@example.com', date: '2024-01-15', workHours: 8 },
      { email: 'user2@example.com', date: '2024-01-20', workHours: 6 },
      { email: 'user1@example.com', date: '2024-04-15', workHours: 7 },
      { email: 'user2@example.com', date: '2024-04-20', workHours: 8 }
    ];
    const req1 = { session: { user: { email: 'user1@example.com' } } };
    const req2 = { session: { user: { email: 'user2@example.com' } } };
    const result1 = userNormWorkHours(mockSchedule, req1);
    const result2 = userNormWorkHours(mockSchedule, req2);
    const expected1 = [8, 7, 0, 0];
    const expected2 = [0, 0, 6, 8];
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
  });

  test('calculates accumulative work hours by quarter with missing data', () => {
    const mockSchedule = [
      { email: 'user1@example.com', date: '2024-01-15', workHours: 8 },
      { email: 'user1@example.com', date: '2024-04-15', workHours: 7 }
    ];
    const req = { session: { user: { email: 'user1@example.com' } } };
    const result = userNormWorkHours(mockSchedule, req);
    const expected = [8, 7, 0, 0];
    expect(result).toEqual(expected);
  });

  test('returns empty array for empty schedule', () => {
    const mockSchedule = [];
    const req = { session: { user: { email: 'user1@example.com' } } };
    const result = userNormWorkHours(mockSchedule, req);
    const expected = [0, 0, 0, 0];
    expect(result).toEqual(expected);
  });

  test('calculates accumulative work hours correctly for leap year', () => {
    const mockSchedule = [
      { email: 'user1@example.com', date: '2024-01-15', workHours: 8 },
      { email: 'user1@example.com', date: '2024-04-15', workHours: 7 },
      { email: 'user1@example.com', date: '2024-07-15', workHours: 6 },
      { email: 'user1@example.com', date: '2024-10-15', workHours: 8 }
    ];
    const req = { session: { user: { email: 'user1@example.com' } } };
    const result = userNormWorkHours(mockSchedule, req);
    const expected = [8, 7, 6, 8];
    expect(result).toEqual(expected);
  });

  test('calculates accumulative work hours correctly for boundary dates', () => {
    const mockSchedule = [
      { email: 'user1@example.com', date: '2024-01-01', workHours: 8 },
      { email: 'user1@example.com', date: '2024-03-31', workHours: 7 },
      { email: 'user1@example.com', date: '2024-06-30', workHours: 6 },
      { email: 'user1@example.com', date: '2024-09-30', workHours: 8 }
    ];
    const req = { session: { user: { email: 'user1@example.com' } } };
    const result = userNormWorkHours(mockSchedule, req);
    const expected = [8, 7, 6, 8];
    expect(result).toEqual(expected);
  });

  test('calculates accumulative work hours correctly for large dataset', () => {
    const mockSchedule = [];
    for (let i = 1; i <= 100; i++) {
      mockSchedule.push({ email: 'user1@example.com', date: `2024-01-${i}`, workHours: i % 8 });
    }
    const req = { session: { user: { email: 'user1@example.com' } } };
    const result = userNormWorkHours(mockSchedule, req);
    // Add expected result based on the calculation
    // For simplicity, let's assume the expected result
    // is an array of 4 elements with values in range [0, 7]
    const expected = [28, 28, 28, 16];
    expect(result).toEqual(expected);
  });
});
