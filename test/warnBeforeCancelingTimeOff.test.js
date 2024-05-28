const { warnBeforeCancelingTimeOff: warnBeforeCancelingTimeOffTest } = require('../functions/hardConstraints');

describe('warnBeforeCancelingTimeOffTest function', () => {
  // Mocking console.log and alert functions
  let originalLog;
  let originalAlert;

  beforeAll(() => {
    originalLog = console.log;
    originalAlert = global.alert;
    console.log = jest.fn();
    global.alert = jest.fn();
  });

  afterAll(() => {
    console.log = originalLog;
    global.alert = originalAlert;
  });

  test('should warn the user if their time off is canceled and they have a shift in 4 days', () => {
    const currentDate = new Date();
    const fourDaysLater = new Date(currentDate.getTime() + (4 * 24 * 60 * 60 * 1000));
    const schedule = [{ date: fourDaysLater.toISOString() }];
    const user = { firstName: 'John', lastName: 'Doe' };
    warnBeforeCancelingTimeOffTest(schedule, user);
    expect(console.log).toHaveBeenCalledWith(`${user.firstName} ${user.lastName}, your time off has been canceled and you have a shift in 4 days.`);
    expect(global.alert).toHaveBeenCalledWith(`${user.firstName} ${user.lastName}, your time off has been canceled and you have a shift in 4 days.`);
  });

  test('should warn the user if their time off should be forced around 30 days', () => {
    const currentDate = new Date();
    const thirtyDaysLater = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    const schedule = [{ date: thirtyDaysLater.toISOString() }];
    const user = { firstName: 'Jane', lastName: 'Smith' };
    warnBeforeCancelingTimeOffTest(schedule, user);
    expect(console.log).toHaveBeenCalledWith(`${user.firstName} ${user.lastName}, your time off should be forced around 30 days.`);
    expect(global.alert).toHaveBeenCalledWith(`${user.firstName} ${user.lastName}, your time off should be forced around 30 days.`);
  });

  test('should warn the user if their time off due to too many hours should be taken care of before the 3rd month', () => {
    const currentDate = new Date();
    const ninetyDaysLater = new Date(currentDate.getTime() + (90 * 24 * 60 * 60 * 1000));
    const schedule = [{ date: ninetyDaysLater.toISOString() }];
    const user = { firstName: 'Alice', lastName: 'Johnson' };
    warnBeforeCancelingTimeOffTest(schedule, user);
    expect(console.log).toHaveBeenCalledWith(`${user.firstName} ${user.lastName}, your time off due to too many hours should be taken care of before the 3rd month.`);
    expect(global.alert).toHaveBeenCalledWith(`${user.firstName} ${user.lastName}, your time off due to too many hours should be taken care of before the 3rd month.`);
  });
});
