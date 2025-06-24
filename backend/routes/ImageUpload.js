import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import express, { Router } from 'express';

const router = Router();
const s3 = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})
router.get('/', async (req, res) => {
    try {
        const fileName = `image-${Date.now()}.jpg`
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: fileName,
            ContentType: 'image/jpeg',
        })
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 400 })
        console.log('UploadURL', uploadUrl)
        const fileUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`
        console.log('File url', fileUrl)
        res.json({ uploadUrl, fileUrl })
    } catch (error) {
        console.log('Error while putting into bucket', error)
    }
})
export default router;