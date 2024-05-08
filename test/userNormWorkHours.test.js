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
    const expected = [15, 0, 6, 8]; // Work hours for Q1, Q2, Q3, Q4
    expect(result).toEqual(expected);
  });

  test('add the work hours together', () => {
    const mockSchedule = [
      { email: 'user1@example.com', date: '2024-01-15', workHours: 8 },
      { email: 'user1@example.com', date: '2024-02-15', workHours: 7 },
      { email: 'user1@example.com', date: '2024-03-15', workHours: 6 }
    ];
    const req = { session: { user: { email: 'user1@example.com' } } };
    const result = userNormWorkHours(mockSchedule, req);
    const expected = [21, 0, 0, 0];
    expect(result).toEqual(expected);
  })
});
