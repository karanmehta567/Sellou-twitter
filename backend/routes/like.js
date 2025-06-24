import express, { Router } from 'express'
import {
    DynamoDBClient,
    GetItemCommand,
    DeleteItemCommand,
    PutItemCommand,
} from '@aws-sdk/client-dynamodb';
const router = Router()
const client = new DynamoDBClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})
const TABLE_NAME = 'Likes'
const USER_ID = 'test-user';

router.post('/:postId/like', async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res.status(401).json({ error: 'PostId is requirdd in URL' })
    }
    const key = {
        postId: { S: postId },
        userId: { S: USER_ID }
    }
    // we need to check if the like already exists or not
    try {
        const CheckCommand = new GetItemCommand({
            TableName: TABLE_NAME,
            Key: key
        })
        const result = await client.send(CheckCommand)
        if (result.Item) {
            // if it does exists,simply unlike it
            await client.send(
                new DeleteItemCommand({ TableName: TABLE_NAME, Key: key })
            )
            return res.status(200).json({ liked: false, message: 'Disliked the post' })
        } else {
            //now like the post simply
            await client.send(
                new PutItemCommand({ TableName: TABLE_NAME, Item: key })
            )
            return res.status(200).json({ liked: true, message: 'Liked the post' })
        }
    } catch (error) {
        console.error('Error toggling like:', err);
        return res.status(500).json({ error: 'Failed to toggle like' });
    }
})
export default router;