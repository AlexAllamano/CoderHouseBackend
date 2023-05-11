import dotenv from 'dotenv';

dotenv.config();

const env = process.env


export default{
    PORT: env.PORT,
    MONGO_URL: env.MONGO_URL,
    github_client_id: env.github_client_id,
    github_secret: env.github_secret,
    github_callbacckUrl: env.github_callbacckUrl 
};