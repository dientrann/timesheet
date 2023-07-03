import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  Server: {
    Host: process.env.HOST || 'localhost',
    Port: parseInt(process.env.PORT) || 9001,
  },
  MongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Timesheet',
  Salt: parseInt(process.env.SALT) || '15',
  KeyToken: process.env.KEY_TOKEN || 'abcdef@',
  PageSize: parseInt(process.env.PAGESIZE) || 5,
}));
