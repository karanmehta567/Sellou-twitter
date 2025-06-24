import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})
import express, { Router } from 'express'
import { ValidatePost } from '../models/post.js'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { uuid } from 'uuidv4';
const router = Router()
const client = new DynamoDBClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})
const TABLE_NAME = 'Posts'
router.post('/', async (req, res) => {
    const { valid, error } = ValidatePost(req.body)
    if (!valid) {
        return res.status(400).json({ error });
    }
    const { text, image } = req.body;
    const id = uuid()
    const timestamp = Date.now()

    const item = {
        id: { S: id },
        text: { S: text },
        timestamp: { N: timestamp.toString() }
    }
    if (image) {
        item["image"] = { S: image }
    }
    try {
        await client.send(new PutItemCommand({ TableName: TABLE_NAME, Item: item }));
        res.status(201).json({ id, text, image: image || null, timestamp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create post" });
    }
})
export default router