// Assuming you have a function called calculateOverwork(startTime, endTime, scheduledShift)
const calculateOverwork = require('../controllers/personalscheduleController');

describe('calculateOverwork', () => {
  it('should return the correct overwork for each day', () => {
    // Mock data
    const scheduledShift = {
      day: 'Monday',
      startTime: new Date('2024-05-13T09:00:00'),
      endTime: new Date('2024-05-13T17:00:00')
    };

    // Test cases
    const testCases = [
      {
        startTime: new Date('2024-05-13T08:00:00'), // Earlier start time
        endTime: new Date('2024-05-13T18:00:00'), // Later end time
        expectedOverwork: 1 // Expected overwork in hours
      },
      {
        startTime: new Date('2024-05-13T09:00:00'), // Scheduled start time
        endTime: new Date('2024-05-13T17:00:00'), // Scheduled end time
        expectedOverwork: 0 // No overwork
      },
      {
        startTime: new Date('2024-05-13T09:00:00'), // Scheduled start time
        endTime: new Date('2024-05-13T16:00:00'), // Earlier end time
        expectedOverwork: -1 // Expected negative value indicating less work than scheduled
      },
    ];

    // Run tests
    testCases.forEach((testCase, index) => {
      const { timeStamp, expectedOverwork } = testCase;
      const overwork = calculateOverwork(timeStamp, scheduledShift);
      expect(overwork).toEqual(expectedOverwork, `Test case ${index + 1} failed`);
    });
  });
});
