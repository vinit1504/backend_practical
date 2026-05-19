const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/workforce_pulse';

mongoose.connect(mongoUri)
  .then(async () => {
    const db = mongoose.connection.db;
    const count = await db.collection('activitylogs').countDocuments();
    console.log(`Total logs: ${count}`);

    if (count > 0) {
      const earliest = await db.collection('activitylogs').find().sort({ timestamp: 1 }).limit(1).toArray();
      const latest = await db.collection('activitylogs').find().sort({ timestamp: -1 }).limit(1).toArray();
      console.log(`Earliest log: ${earliest[0].timestamp}`);
      console.log(`Latest log: ${latest[0].timestamp}`);

      const recentCount = await db.collection('activitylogs').countDocuments({
        timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      console.log(`Logs in last 30 days: ${recentCount}`);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
