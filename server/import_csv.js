import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const parseSalary = (salaryStr) => {
  if (!salaryStr) return { min: 0, max: 0 };
  const matches = salaryStr.match(/\$(\d+)K-\$(\d+)K/);
  if (matches) {
    return {
      min: parseInt(matches[1]) * 1000,
      max: parseInt(matches[2]) * 1000
    };
  }
  return { min: 0, max: 0 };
};

const parseJobType = (workType) => {
  const t = (workType || '').toLowerCase();
  if (t.includes('intern')) return 'internship';
  if (t.includes('part')) return 'part-time';
  if (t.includes('temp') || t.includes('contract')) return 'contract';
  return 'full-time';
};

const parseExperience = (expStr) => {
  if (!expStr) return 'entry';
  const matches = expStr.match(/(\d+)/);
  if (matches) {
    const years = parseInt(matches[1]);
    if (years < 3) return 'entry';
    if (years < 7) return 'mid';
    if (years < 10) return 'senior';
    return 'lead';
  }
  return 'entry';
};

const run = async () => {
  try {
    await connectDB();

    console.log('Finding default recruiter...');
    let recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'System Recruiter',
        email: 'system@hireflow.com',
        password: 'Password@123',
        role: 'recruiter',
        isApproved: true,
        isVerified: true,
      });
    }

    const jobs = [];
    const LIMIT = 500;
    console.log('Reading CSV...');
    
    const stream = fs.createReadStream('D:\\elipsonic\\assets\\job_descriptions.csv').pipe(csv());

    stream.on('data', (row) => {
      let description = row['Job Description'] || '';
      if (row['Responsibilities']) description += '\n\nResponsibilities:\n' + row['Responsibilities'];
      if (row['Benefits']) description += '\n\nBenefits:\n' + row['Benefits'];

      jobs.push({
        title: row['Job Title'] || 'Untitled',
        description: description,
        recruiter: recruiter._id,
        company: row['Company'] || 'Unknown Company',
        skillsRequired: (row['skills'] || '').split(',').map(s => s.trim()).filter(Boolean),
        salaryRange: parseSalary(row['Salary Range']),
        location: `${row['location']}, ${row['Country']}`,
        jobType: parseJobType(row['Work Type']),
        experienceLevel: parseExperience(row['Experience'])
      });

      if (jobs.length >= LIMIT) {
        stream.destroy();
      }
    });

    stream.on('close', async () => {
      console.log(`Parsed ${jobs.length} rows. Starting import...`);
      
      await Job.deleteMany({});
      console.log('Cleared old jobs.');
      
      const chunkSize = 100;
      for (let i = 0; i < jobs.length; i += chunkSize) {
        const chunk = jobs.slice(i, i + chunkSize);
        await Job.insertMany(chunk);
        console.log(`Inserted ${i + chunk.length} / ${jobs.length}`);
      }

      console.log('Import successful!');
      process.exit(0);
    });

  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
};

run();
