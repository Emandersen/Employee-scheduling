const { restAfterSixDays } = require('../functions/hardConstraints');

describe('restAfterSixDays', () => {
    test('should return true if there is not six or more consecutive work days', () => {
        const schedule = [
            {
                _id: "6613cd8a18faa7a586616223",
                email: "user@user.com",
                date: new Date("2024-04-08T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "12:00",
                endTime: "14:00",
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
                startTime: "10:00",
                endTime: "14:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616225",
                email: "user@user.com",
                date: new Date("2024-04-10T00:00:00.000+00:00"),
                workHours: 6,
                startTime: "12:00",
                endTime: "18:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616226",
                email: "user@user.com",
                date: new Date("2024-04-11T00:00:00.000+00:00"),
                workHours: 8,
                startTime: "08:00",
                endTime: "16:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616227",
                email: "user@user.com",
                date: new Date("2024-04-12T00:00:00.000+00:00"),
                workHours: 10,
                startTime: "10:00",
                endTime: "20:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616228",
                email: "user@user.com",
                date: new Date("2024-04-14T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "08:00",
                endTime: "20:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616229",
                email: "user@user.com",
                date: new Date("2024-04-15T00:00:00.000+00:00"),
                workHours: 14,
                startTime: "06:00",
                endTime: "20:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
        ];
        const user = { firstName: 'user', lastName: 'user', email: 'user@user.com' };
        expect(restAfterSixDays(schedule, user)).toBe(true);
    });
    test('should return false if there is six or more consecutive work days', () => {
        const schedule = [
            {
                _id: "6613cd8a18faa7a586616223",
                email: "user@user.com",
                date: new Date("2024-04-08T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "12:00",
                endTime: "14:00",
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
                startTime: "10:00",
                endTime: "14:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616225",
                email: "user@user.com",
                date: new Date("2024-04-10T00:00:00.000+00:00"),
                workHours: 6,
                startTime: "12:00",
                endTime: "18:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616226",
                email: "user@user.com",
                date: new Date("2024-04-11T00:00:00.000+00:00"),
                workHours: 8,
                startTime: "08:00",
                endTime: "16:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616227",
                email: "user@user.com",
                date: new Date("2024-04-12T00:00:00.000+00:00"),
                workHours: 10,
                startTime: "10:00",
                endTime: "20:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616228",
                email: "user@user.com",
                date: new Date("2024-04-13T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "08:00",
                endTime: "20:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616229",
                email: "user@user.com",
                date: new Date("2024-04-15T00:00:00.000+00:00"),
                workHours: 14,
                startTime: "06:00",
                endTime: "20:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
        ];
        const user = { firstName: 'user', lastName: 'user', email: 'user@user.com' };
        expect(restAfterSixDays(schedule, user)).toBe(false);
    });
});