const { noShiftDuringLeave } = require('../functions/constraints');

describe('noShiftDuringLeave', () => {
    test('should return false if there is a vacation day and a work day overlap', () => {
        const schedule = [
            {
                _id: "6613cd8a18faa7a586616223",
                email: "user@user.com",
                date: new Date("2024-04-08T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "00:00",
                endTime: "08:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            }
        ];
        const user = { firstName: 'user', lastName: 'user', email: 'user@user.com', vacationDays: [new Date("2024-04-08T00:00:00.000+00:00")] };
        expect(noShiftDuringLeave(schedule, user)).toBe(false);
    })
    test('should return true if there is no vacation day and a work day overlap', () => {
        const schedule = [
            {
                _id: "6613cd8a18faa7a586616223",
                email: "user@user.com",
                date: new Date("2024-04-08T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "00:00",
                endTime: "08:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616223",
                email: "user@user.com",
                date: new Date("2024-04-10T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "00:00",
                endTime: "08:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            }
        ];
        const user = { firstName: 'user', lastName: 'user', email: 'user@user.com', vacationDays: [new Date("2024-04-09T00:00:00.000+00:00")] };
        expect(noShiftDuringLeave(schedule, user)).toBe(true);
    })
})