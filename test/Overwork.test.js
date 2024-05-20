const { calculateOverwork } = require('../functions/dateHandler'); // Adjust the path to your function

describe('calculateOverwork', () => {
  let req, res, timeStampModel, PersonalSchedule;

  beforeEach(() => {
    req = { session: { user: { email: 'test@example.com' } } };
    res = { redirect: jest.fn() };
    timeStampModel = { findOne: jest.fn() };
    PersonalSchedule = { findOne: jest.fn() };
  });

  it('should return 0 if no scheduled shift is found', async () => {
    PersonalSchedule.findOne.mockResolvedValue(null);

    const result = await calculateOverwork(req, res, timeStampModel, PersonalSchedule);
    expect(result).toBe(0);
  });

  it('should throw an error if no verified stamp is found', async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const scheduledShift = { email: req.session.user.email, date: currentDate, startTime: new Date(), endTime: new Date() };

    PersonalSchedule.findOne.mockResolvedValue(scheduledShift);
    timeStampModel.findOne.mockResolvedValue(null);

    await calculateOverwork(req, res, timeStampModel, PersonalSchedule);

    expect(res.redirect).toHaveBeenCalledWith('/?error=An error occurred');
  });

  it('Should calculate overwork hours correctly when startTime is before scheduledStartTime', async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const startTime = new Date(`${currentDate}T08:00:00Z`);
    const endTime = new Date(`${currentDate}T17:00:00Z`);
    const scheduledStartTime = new Date(`${currentDate}T09:00:00Z`);
    const scheduledEndTime = new Date(`${currentDate}T17:00:00Z`);

    const scheduledShift = { email: req.session.user.email, date: currentDate, startTime: scheduledStartTime, endTime: scheduledEndTime };
    const timeStamp = { email: req.session.user.email, verified: true, startTime: startTime, endTime: endTime };

    PersonalSchedule.findOne.mockResolvedValue(scheduledShift);
    timeStampModel.findOne.mockResolvedValue(timeStamp);

    const result = await calculateOverwork(req, res, timeStampModel, PersonalSchedule);
    expect(result).toBe(1); // Overwork should be 1 hour
  });

  it('Should calculate overwork hours correctly when the endTime is after scheduledEndTime', async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const startTime = new Date(`${currentDate}T09:00:00Z`);
    const endTime = new Date(`${currentDate}T18:00:00Z`);
    const scheduledStartTime = new Date(`${currentDate}T09:00:00Z`);
    const scheduledEndTime = new Date(`${currentDate}T17:00:00Z`);

    const scheduledShift = { email: req.session.user.email, date: currentDate, startTime: scheduledStartTime, endTime: scheduledEndTime };
    const timeStamp = { email: req.session.user.email, verified: true, startTime: startTime, endTime: endTime };

    PersonalSchedule.findOne.mockResolvedValue(scheduledShift);
    timeStampModel.findOne.mockResolvedValue(timeStamp);

    const result = await calculateOverwork(req, res, timeStampModel, PersonalSchedule);
    expect(result).toBe(1); // Overwork should be 1 hour
  });

  it('should calculate overwork hours correctly when the times are the same', async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const startTime = new Date(`${currentDate}T09:00:00Z`);
    const endTime = new Date(`${currentDate}T17:00:00Z`);
    const scheduledStartTime = new Date(`${currentDate}T09:00:00Z`);
    const scheduledEndTime = new Date(`${currentDate}T17:00:00Z`);

    const scheduledShift = { email: req.session.user.email, date: currentDate, startTime: scheduledStartTime, endTime: scheduledEndTime };
    const timeStamp = { email: req.session.user.email, verified: true, startTime: startTime, endTime: endTime };

    PersonalSchedule.findOne.mockResolvedValue(scheduledShift);
    timeStampModel.findOne.mockResolvedValue(timeStamp);

    const result = await calculateOverwork(req, res, timeStampModel, PersonalSchedule);
    expect(result).toBe(0); // Overwork should be 0 hours
  });

  it('should calculate overwork hours correctly when there is less than an hour of overwork', async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const startTime = new Date(`${currentDate}T08:30:00Z`);
    const endTime = new Date(`${currentDate}T17:00:00Z`);
    const scheduledStartTime = new Date(`${currentDate}T09:00:00Z`);
    const scheduledEndTime = new Date(`${currentDate}T17:00:00Z`);

    const scheduledShift = { email: req.session.user.email, date: currentDate, startTime: scheduledStartTime, endTime: scheduledEndTime };
    const timeStamp = { email: req.session.user.email, verified: true, startTime: startTime, endTime: endTime };

    PersonalSchedule.findOne.mockResolvedValue(scheduledShift);
    timeStampModel.findOne.mockResolvedValue(timeStamp);

    const result = await calculateOverwork(req, res, timeStampModel, PersonalSchedule);
    expect(result).toBe(0.5); // Overwork should be 0.5 hours
  });

  it('should calculate overwork hours correctly when there is less time stamped than scheduled', async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const startTime = new Date(`${currentDate}T10:00:00Z`);
    const endTime = new Date(`${currentDate}T16:00:00Z`);
    const scheduledStartTime = new Date(`${currentDate}T09:00:00Z`);
    const scheduledEndTime = new Date(`${currentDate}T17:00:00Z`);

    const scheduledShift = { email: req.session.user.email, date: currentDate, startTime: scheduledStartTime, endTime: scheduledEndTime };
    const timeStamp = { email: req.session.user.email, verified: true, startTime: startTime, endTime: endTime };

    PersonalSchedule.findOne.mockResolvedValue(scheduledShift);
    timeStampModel.findOne.mockResolvedValue(timeStamp);

    const result = await calculateOverwork(req, res, timeStampModel, PersonalSchedule);
    expect(result).toBe(-2); // Overwork should be -2 hours
  });
});
