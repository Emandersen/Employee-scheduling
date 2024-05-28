const { noOverlappingShifts } = require('../functions/hardConstraints');

describe('noOverlappingShifts', () => {
    test('No Overlapping Shifts', () => {
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
                date: new Date("2024-04-08T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "09:00",
                endTime: "11:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            }
            /* Add more shifts here if needed */
        ];
        const user = { firstName: 'user', lastName: 'user', email: 'user@user.com' };
        expect(noOverlappingShifts(schedule, user)).toBe(true);
        // Assert that schedule remains unchanged
        expect(schedule).toEqual([
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
                date: new Date("2024-04-08T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "09:00",
                endTime: "11:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            }
        ]);
    });

    test('Overlapping Shifts', () => {
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
                date: new Date("2024-04-08T00:00:00.000+00:00"),
                workHours: 2,
                startTime: "07:00",
                endTime: "09:00",
                role: "Nurse",
                department: "Emergency",
                location: "Hvidovre",
                released: false,
                __v: 0
            }
        ];
        const user = { firstName: 'user', lastName: 'user', email: 'user@user.com' };
        expect(noOverlappingShifts(schedule, user)).toBe(true);
        // Assert that overlapping shifts are removed
        // and schedule is as expected
        expect(schedule).toEqual([
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
        ]);
    });

    // Add more test cases as described above
});