const cron = require('node-cron');
const { fetchAllQuotes } = require('./dataFetcher.js');
const { Quote } = require('./database.js');

console.log('Scheduler initialized.');


const fetchAndStoreQuotes = async () => {
    console.log('CRON JOB: Running the 60-second update task...');

    try {
        const quotes = await fetchAllQuotes();

        if (quotes.length === 0) {
            console.log('CRON JOB: No quotes fetched. Skipping database insert.');
            return;
        }

        console.log(`CRON JOB: Fetched ${quotes.length} quotes. Storing in database...`);

        
        await Quote.bulkCreate(quotes);

        console.log('CRON JOB: Successfully stored new quotes.');

    } catch (error) {
        console.error('CRON JOB: Error during fetch/store:', error);
    }
};

// Schedule a task to run every 60 seconds
cron.schedule('*/60 * * * * *', fetchAndStoreQuotes);


fetchAndStoreQuotes();