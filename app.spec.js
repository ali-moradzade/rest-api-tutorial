import {afterEach, describe, expect, it} from "vitest";
import {agent as request} from 'supertest';
import app from './app';
import {mongoose} from "./common/services/mongoose.service";

async function createUser(userData) {
    const result = await request(app)
        .post('/users')
        .send(userData);

    return result.body.id;
}

async function getToken(email, password) {
    const tokenRes = await request(app)
        .post('/auth')
        .send({
            email,
            password,
        });

    return tokenRes.body.accessToken;
}

describe('app', () => {
    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    /**
     * TODO: clean the response, remove _id and __v
     */
    describe('POST /users/:userId/addFriend', () => {
        it('should work', async () => {
            // Arrange
            const user1Data = {
                firstName: "2-first",
                lastName: "2-last",
                email: "2@gmail.com",
                password: "12345"
            };
            const user2Data = {
                firstName: "2-first",
                lastName: "2-last",
                email: "2@gmail.com",
                password: "12345"
            };

            const user1Id = await createUser(user1Data);
            const user2Id = await createUser(user2Data);

            const token = await getToken(user1Data.email, user1Data.password);

            // Act
            const result = await request(app)
                .post(`/users/${user1Id}/addFriend`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2Id
                });

            const user = result.body;

            // Assert
            expect(user.friends.length).toEqual(1);
        });
    });
});
