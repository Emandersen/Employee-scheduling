const { elevenHoursRest } = require('../functions/hardConstraints');

describe('elevenHoursRest', () => {
    test('should return true if the difference between the two dates is equal to or more than 11 hours', () => {
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
                _id: "6613cd8a18faa7a586616224",
                email: "user@user.com",
                date: new Date("2024-04-09T00:00:00.000+00:00"),
                workHours: 4,
                startTime: "19:00",
                endTime: "24:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            }
        ];
        const user = { firstName: 'user', lastName: 'user', email: 'user@user.com' };
        expect(elevenHoursRest(schedule, user)).toBe(true);
    });
    
    
    test('should return false if the difference between the two dates is less than 11 hours', () => {
        const schedule = [
            {
                _id: "6613cd8a18faa7a586616223",
                email: "user@user.com",
                date: new Date("2024-04-09T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "02:00",
                endTime: "12:01",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616224",
                email: "user@user.com",
                date: new Date("2024-04-09T00:00:00.000+00:00"),
                workHours: 4,
                startTime: "23:00",
                endTime: "24:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
        ];
        const user = { firstName: "user", lastName: "user", email: 'user@user.com' };
        expect(elevenHoursRest(schedule, user)).toBe(false);
    });
});