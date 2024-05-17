const { vacationRegistration } = require('../functions/dateHandler');

describe('vacationRegistration', () => {
    let User;

    beforeEach(() => {
        User = {
            find: jest.fn()
        };
    });

    it('should return a message if there are no vacation day requests from the user', async () => {
        User.find.mockResolvedValueOnce({ vacationDays: [] });

        const req = { body: { user: 'testUser' } };
        const result = await vacationRegistration(req, User);

        expect(result).toEqual({ message: 'There are no vacation day requests from this user.' });
    });

    it('should return the number of vacation days left if there are true verified vacation days', async () => {
        User.find.mockResolvedValueOnce({ vacationDays: [[true], [false], [true]] });

        const req = { body: { user: 'testUser' } };
        const result = await vacationRegistration(req, User);

        expect(result).toBe(23); // 25 - 2 true verified vacation days //
    });

    it('should handle errors and return an appropriate message', async () => {
        User.find.mockRejectedValueOnce(new Error('Database error'));

        const req = { body: { user: 'testUser' } };
        const result = await vacationRegistration(req, User);

        expect(result).toEqual({ message: 'An error occured during vacation registration.', error: 'Database error' });
    });
});