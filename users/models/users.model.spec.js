const mongoose = require('../../common/services/mongoose.service').mongoose;
import {afterEach, describe, expect, it} from "vitest";
import {addFriend, createUser, exportedForTesting, findById} from './users.model';

const {User} = exportedForTesting;

describe('users.model', () => {
    afterEach(() => {
        mongoose.connection.dropDatabase();
    });

    it('should be able to successfully add a friend for user', async () => {
        // Arrange
        const user1Data = {
            firstName: 'firstName1',
            lastName: 'lastName1',
            email: '1@example.com',
            password: 'securePassword',
            permissionLevel: 1,
            friends: [],
        };

        const user2Data = {
            firstName: 'firstName2',
            lastName: 'lastName2',
            email: '2@example.com',
            password: 'securePassword',
            permissionLevel: 1,
            friends: [],
        };

        // Act

        // Save the user to the database
        const user1 = await createUser(user1Data);
        const user2 = await createUser(user2Data);
        await addFriend(user1._id, user2._id);

        const result = await findById(user1._id);

        // Assert
        expect(result.friends.length).toEqual(1);
        expect(result.friends[0]).toEqual(user2._id);
    });
});
