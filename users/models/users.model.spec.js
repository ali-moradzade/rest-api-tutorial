import {expect, it} from "vitest";
import {exportedForTesting} from './users.model';

const {User} = exportedForTesting;

it('should work', async () => {
    // Arrange
    const user1 = new User({
        firstName: 'firstName1',
        lastName: 'lastName1',
        email: '1@example.com',
        password: 'securePassword',
        permissionLevel: 1,
        friends: [],
    });

    const user2 = new User({
        firstName: 'firstName2',
        lastName: 'lastName2',
        email: '2@example.com',
        password: 'securePassword',
        permissionLevel: 1,
        friends: [],
    });

    // Act

    // Save the user to the database
    await user1.save();
    await user2.save();

    await User.findOneAndUpdate({
        _id: user1._id,
    }, {
        $push: {
            friends: [user2._id]
        }
    });

    const result = await User.findById(user1._id.toString());

    // Assert
    expect(result.friends.length).toEqual(1);
    expect(result.friends[0]).toEqual(user2._id);
});
