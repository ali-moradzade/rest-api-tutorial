const mongoose = require('../../common/services/mongoose.service').mongoose;
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {addFriend, removeFriend, createUser, findById, friendsList} from './users.model';

describe('users.model', () => {
    let user1, user2, user3;

    beforeEach(async () => {
        // Add our initial data
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

        const user3Data = {
            firstName: 'firstName3',
            lastName: 'lastName3',
            email: '3@example.com',
            password: 'securePassword',
            permissionLevel: 1,
            friends: [],
        };

        // Save the users to the database
        user1 = await createUser(user1Data);
        user2 = await createUser(user2Data);
        user3 = await createUser(user3Data);
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('should be able to successfully add a friend for user', async () => {
        // Arrange
        await addFriend(user1._id, user2._id);

        const result = await findById(user1._id);

        // Assert
        expect(result.friends.length).toEqual(1);
        expect(result.friends[0]).toEqual(user2._id);
    });

    it('should be able to successfully remove a friend for user', async () => {
        // Arrange
        await addFriend(user1._id, user2._id);
        await addFriend(user1._id, user3._id);

        // Act
        await removeFriend(user1._id, user2._id);
        const result = await findById(user1._id);

        // Assert
        expect(result.friends.length).toEqual(1);
        expect(result.friends[0]).toEqual(user3._id);
    });

    it('should be able to get list of user friends', async () => {
        // Arrange
        await addFriend(user1._id, user2._id);
        await addFriend(user1._id, user3._id);

        // Act
        const friendsIds = await friendsList(user1._id);

        expect(friendsIds.length).toEqual(2);
        expect(friendsIds[0]).toEqual(user2._id);
        expect(friendsIds[1]).toEqual(user3._id);
    });
});
