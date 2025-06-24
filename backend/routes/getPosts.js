import express, { Router } from 'express'
import {
    DynamoDBClient,
    QueryCommand,
    ScanCommand,

} from '@aws-sdk/client-dynamodb';
const router = Router()
const client = new DynamoDBClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})
const POSTS_TABEL = 'Posts';
const LIKES_TABLE = 'Likes';
const USER_ID = 'test-user';
router.get('/', async (req, res) => {
    //get all the posts
    try {
        const result = await client.send(new ScanCommand({
            TableName: POSTS_TABEL
        }))
        const posts = result.Items || []
        const finalposts = []
        for (const post of posts) {
            const postId = post.id.S;
            // get the likes at each post
            const likesresult = await client.send(new QueryCommand({
                TableName: LIKES_TABLE,
                KeyConditionExpression: 'postId=:postId',
                ExpressionAttributeValues: {
                    ':postId': { S: postId }
                }
            }))
            const likes = likesresult.Items || []
            const likeCount = likes.length;
            const likedByUser = likes.some(
                like => like.userId.S === USER_ID
            )
            //now just simply push the entire data into finalposts
            finalposts.push({
                id: postId,
                text: post.text?.S || '',
                image: post.image?.S || null,
                timestamp: Number(post.timestamp?.N),
                likeCount,
                likedByUser
            })
        }
        res.status(200).json(finalposts)
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
})
export default router;