# Project
I've added the following routes:

Add a new list of friends for user:
```
POST /users/:userId/friends
{
   friendId
}
```

Get list of user friends:  
If you send: `expand=true`, it will show complete info of friends, otherwise it just returns their ids
```
GET /users/:userId/friends/?expand=true

```

Delete a friend from user friends:
```
DELETE /users/:userId/friends/:friendId
```
