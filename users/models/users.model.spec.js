const mongoose = require('../../common/services/mongoose.service').mongoose;
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {addFriend, addListOfFriends, createUser, listFriends, removeFriend} from './users.model';

async function generateFakeUser(number) {
    const userData = {
        firstName: `firstName-${number}`,
        lastName: `lastName-${number}`,
        email: `${number}@example.com`,
        password: 'securePassword',
        permissionLevel: 1,
        friends: [],
    };

    return await createUser(userData);
}

describe('users.model', () => {
    let user1, user2, user3;

    beforeEach(async () => {
        // Add our initial data
        user1 = await generateFakeUser(1);
        user2 = await generateFakeUser(2);
        user3 = await generateFakeUser(3);
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('addFriend', async () => {
        // Arrange && Act
        const result = await addFriend(user1._id, user2._id);

        // Assert
        expect(result.friends.length).toEqual(1);
        expect(result.friends[0]).toEqual(user2._id);
    });

    it('addListOfFriends', async () => {
        // Arrange && Act
        const result = await addListOfFriends(user1._id, [user2._id, user3._id]);

        // Assert
        expect(result.friends.length).toEqual(2);
        expect(result.friends[0]).toEqual(user2._id);
        expect(result.friends[1]).toEqual(user3._id);
    });


    it('removeFriend', async () => {
        // Arrange
        await addListOfFriends(user1._id, [user2._id, user3._id]);

        // Act
        const result = await removeFriend(user1._id, user2._id);

        // Assert
        expect(result.friends.length).toEqual(1);
        expect(result.friends[0]).toEqual(user3._id);
    });

    describe('listFriends', () => {
        it('expand=undefined/false', async () => {
            // Arrange
            await addListOfFriends(user1._id, [user2._id, user3._id]);

            // Act
            const friendsIds = await listFriends(user1._id);

            expect(friendsIds.length).toEqual(2);
            expect(friendsIds[0]).toEqual(user2._id);
            expect(friendsIds[1]).toEqual(user3._id);
        });

        it('expand=true', async () => {
            // Arrange
            await addListOfFriends(user1._id, [user2._id, user3._id]);

            // Act
            const friends = await listFriends(user1._id, true);

            expect(friends.length).toEqual(2);
            expect(friends[0]._id).toEqual(user2._id);
            expect(friends[1]._id).toEqual(user3._id);
        });
    });
});
