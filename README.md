# Project
I've added the following routes:

Add a new list of friends for user:
```
POST /users/:userId/friends
{
    [
       friendId1,
       friendId2,
       ...
    ]
}
```

Get list of user friends:
```
GET /users/:userId/friends
```

Delete a friend from user friends:
```
DELETE /users/:userId/friends/:friendId
```
