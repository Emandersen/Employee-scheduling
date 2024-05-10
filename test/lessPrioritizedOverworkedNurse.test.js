const { lessPrioritizedOverworkedNurse } = require('../functions/softConstraints');

describe('lessPrioritizedOverworkedNurse', () => {
    test('should return 0.1 if the worker works 12 hours each day', () => {
        const schedule = [
            {
                _id: "6613cd8a18faa7a586616243",
                email: "user@user.com",
                date: new Date("2024-04-08T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "00:00",
                endTime: "12:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616244",
                email: "user@user.com",
                date: new Date("2024-04-09T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "12:00",
                endTime: "24:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616245",
                email: "user@user.com",
                date: new Date("2024-04-10T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "00:00",
                endTime: "12:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616246",
                email: "user@user.com",
                date: new Date("2024-04-11T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "12:00",
                endTime: "24:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616247",
                email: "user@user.com",
                date: new Date("2024-04-12T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "00:00",
                endTime: "12:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616248",
                email: "user@user.com",
                date: new Date("2024-04-13T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "12:00",
                endTime: "24:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            },
            {
                _id: "6613cd8a18faa7a586616249",
                email: "user@user.com",
                date: new Date("2024-04-14T00:00:00.000+00:00"),
                workHours: 12,
                startTime: "12:00",
                endTime: "24:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            }
        ];
        const user = { firstName: 'user', lastName: 'user', email: 'user@user.com' };
        expect(lessPrioritizedOverworkedNurse(schedule, user)).toBe(0.1);
    })
})