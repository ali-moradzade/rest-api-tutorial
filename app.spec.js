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
    describe('POST /users/:userId/friends', () => {
        it('should add a friend for the user', async () => {
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
                .post(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2Id
                });

            const user = result.body;

            // Assert
            expect(user.friends.length).toEqual(1);
        });
    });

    describe('GET /users/:userId/friends', () => {
        it('should get a list of user friends, expanded=false/undefined', async () => {
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
            const user3Data = {
                firstName: "3-first",
                lastName: "3-last",
                email: "3@gmail.com",
                password: "12345"
            };

            const user1Id = await createUser(user1Data);
            const user2Id = await createUser(user2Data);
            const user3Id = await createUser(user3Data);

            const token = await getToken(user1Data.email, user1Data.password);

            // Act
            await request(app)
                .post(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2Id
                });
            await request(app)
                .post(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user3Id
                });

            const result = await request(app)
                .get(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)

            const friendsList = result.body;

            // Assert
            expect(friendsList.length).toEqual(2);
        });

        it('should get a list of user friends, expanded=true', async () => {
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
            const user3Data = {
                firstName: "3-first",
                lastName: "3-last",
                email: "3@gmail.com",
                password: "12345"
            };

            const user1Id = await createUser(user1Data);
            const user2Id = await createUser(user2Data);
            const user3Id = await createUser(user3Data);

            const token = await getToken(user1Data.email, user1Data.password);

            // Act
            await request(app)
                .post(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2Id
                });
            await request(app)
                .post(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user3Id
                });

            const result = await request(app)
                .get(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .query({'expand': true})

            const friends = result.body;

            // Assert
            console.log(friends);
            // expect(friendsList.length).toEqual(2);
        });
    });

    describe('DELETE /users/:userId/friends/:friendId', () => {
        it('should remove specified friend from user friends', async () => {
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
            await request(app)
                .post(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2Id
                });

            const result = await request(app)
                .get(`/users/${user1Id}/friends`)
                .set('Authorization', `Bearer ${token}`)

            const friendsList = result.body;

            // Assert
            expect(friendsList.length).toEqual(1);
        });
    });
});
