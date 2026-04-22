import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';

const run = async () => {
  await connectDB();
  
  const existing = await User.findOne({ email: 'admin@hireflow.com' });
  if (!existing) {
    await User.create({
      name: 'Admin',
      email: 'admin@hireflow.com',
      password: 'Admin@123',
      role: 'admin',
      isApproved: true
    });
    console.log('Admin account created successfully.');
  } else {
    console.log('Admin account already exists.');
  }
  process.exit(0);
};

run();
