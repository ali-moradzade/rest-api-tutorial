import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {agent as request} from 'supertest';
import app from './app';
import {mongoose} from "./common/services/mongoose.service";

async function generateFakeUser(number) {
    const userData = {
        firstName: `firstName-${number}`,
        lastName: `lastName-${number}`,
        email: `${number}@example.com`,
        password: 'securePassword',
        permissionLevel: 1,
        friends: [],
    };

    const result = await request(app)
        .post('/users')
        .send(userData);

    const id = result.body.id;

    return {
        id,
        ...userData,
    };
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
    let user1, user2, user3, token;

    beforeEach(async () => {
        user1 = await generateFakeUser(1);
        user2 = await generateFakeUser(2);
        user3 = await generateFakeUser(3);
        token = await getToken(user1.email, user1.password);
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    describe('POST /users/:userId/friends', () => {
        it('should add a friend for the user', async () => {
            // Act
            const result = await request(app)
                .post(`/users/${user1.id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2.id
                });

            const user = result.body;

            // Assert
            expect(user.friends.length).toEqual(1);
        });
    });

    describe('GET /users/:userId/friends', () => {
        it('should get a list of user friends, expanded=false/undefined', async () => {
            // Arrange
            const token = await getToken(user1.email, user1.password);

            // Act
            await request(app)
                .post(`/users/${user1.id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2.id
                });
            await request(app)
                .post(`/users/${user1.id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user3.id
                });

            const result = await request(app)
                .get(`/users/${user1.id}/friends`)
                .set('Authorization', `Bearer ${token}`);

            const friendsList = result.body;

            // Assert
            expect(friendsList.length).toEqual(2);
        });

        it('should get a list of user friends, expanded=true', async () => {
            // Act
            await request(app)
                .post(`/users/${user1.id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2.id
                });
            await request(app)
                .post(`/users/${user1.id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user3.id
                });

            const result = await request(app)
                .get(`/users/${user1.id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .query({'expand': true});

            const friends = result.body;

            // Assert
            expect(friends.length).toEqual(2);
        });
    });

    describe('DELETE /users/:userId/friends/:friendId', () => {
        it('should remove specified friend from user friends', async () => {
            // Act
            await request(app)
                .post(`/users/${user1.id}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    friendId: user2.id
                });

            const result = await request(app)
                .del(`/users/${user1.id}/friends/${user2.id}`)
                .set('Authorization', `Bearer ${token}`);

            const user = result.body;

            // Assert
            expect(user?.friends?.length).toEqual(0);
        });
    });
});
