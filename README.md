A simplified Twitter-like full-stack application built with:

💡 Frontend: React

🧠 Backend: Node.js + Express

⚡️ AWS Services:  DynamoDB (storage), S3 (image uploads)

✨ Features
📝 Create a text post

🖼️ Upload images via AWS S3 (presigned URLs)

❤️ Like/unlike posts (tracked per user)

📜 View all posts with images and like counts

📡 Real-time-ready architecture (supports future WebSocket/AppSync upgrade)

🛠 Tech Stack
Layer	Technology
Frontend	React (Vite), Fetch API
Backend	Node.js, Express, AWS SDK v3
Database	AWS DynamoDB
Storage	AWS S3 (presigned URL for upload)
Deployment	Local (Dev)

🧩 Architecture
vbnet
Copy
Edit
[ React App ]
     |
## [POST /posts] ----> Save post (text + image URL) to DynamoDB
     
![Screenshot 2025-06-24 172002](https://github.com/user-attachments/assets/f5fd6df7-c0a9-477f-bcdf-ef7515686412)

## [GET /posts] ----> Fetch all posts with like counts
     ![Screenshot 2025-06-24 172512](https://github.com/user-attachments/assets/5b7179a3-6b23-4b60-93ab-c153d2c50ae8)

## [POST /post/{postId}/like] ----> Toggle like
     ![Screenshot 2025-06-24 172838](https://github.com/user-attachments/assets/340bb180-b9bb-4703-a80d-0b0319647856)
|
## [GET /upload-url] ----> Get pre-signed S3 URL for image upload
     
## Backend by default runs on 8000 PORT and frontend on 5173
🖼️ Image Upload Flow
React requests /upload-url to get a presigned S3 PUT URL.

User-selected image is uploaded directly to S3 using the presigned URL.

Final public S3 image URL is stored with the post data in DynamoDB.

Public access is configured via bucket policy + CORS.

⚙️ Environment Variables (.env)
Create a .env file in the backend with the following:

env
Copy
Edit
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
S3_BUCKET=sellou-twitter
## DynamoDB Tables
Posts

id (string, PK)

text (string)

image (string, optional)

timestamp (number)

Likes

postId (string, PK)

userId (string, SK)

## S3 Bucket Setup
Enable public access on the bucket.

CORS Configuration:

json
Copy
Edit
## [
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["http://localhost:5173"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
Bucket Policy for public image access:

json
Copy
Edit
## {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sellou-twitter/*"
    }
  ]
}
🚀 Getting Started (Local Dev)
Start Backend

bash
Copy
Edit
cd backend
npm install
npm run dev
Start Frontend

bash
Copy
Edit
cd frontend
npm install
npm run dev
App will be accessible at: http://localhost:5173

✅ Future Scope
Add user authentication with Cognito or JWT
Real-time updates via AWS AppSync or WebSocket
Deployment to AWS Lambda via Serverless Framework

🧠## Credits
Built for Sellou AWS + React Coding Challenge!
