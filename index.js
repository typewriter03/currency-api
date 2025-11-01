const express = require('express');

const { setupDatabase, Quote } = require('./database.js');
const { Op } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.set('json spaces', 2);

app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Currency API is running!</h1>
            <p>Welcome to the ARS Currency Exchange API. Here are the available endpoints:</p>
            <ul>
                <li><a href="/quotes">GET /quotes</a></li>
                <li><a href="/average">GET /average</a></li>
                <li><a href="/slippage">GET /slippage</a></li>
            </ul>
        </div>
    `);
});

/**
 Helper function to get the latest quotes from the DB.
 It finds the most recent 'createdAt' timestamp and fetches allquotes from that exact batch.
 */
async function getLatestQuotes() {
    // Find the timestamp of the last successful job
    const lastQuote = await Quote.findOne({
        order: [['createdAt', 'DESC']]
    });

    if (!lastQuote) {
        return [];
    }

    const latestTimestamp = lastQuote.createdAt;

    // Fetch all quotes that match that exact timestamp
    const latestQuotes = await Quote.findAll({
        where: {
            createdAt: latestTimestamp
        }
    });

    return latestQuotes;
}


// API Endpoints

/**
 * 1.a GET /quotes
  Returns an array of the most recent quotes.
 */
app.get('/quotes', async (req, res) => {
    try {
        const quotes = await getLatestQuotes();
        if (quotes.length === 0) {
            return res.status(404).json({ error: 'No data available' });
        }

       
        const lastUpdate = quotes[0].createdAt;

        
        const formattedQuotes = quotes.map(q => ({
            buy_price: q.buy_price,
            sell_price: q.sell_price,
            spread: parseFloat((q.sell_price - q.buy_price).toFixed(2)), // 
            source: q.source
        }));

        
        res.json({
            last_update_utc: lastUpdate,
            quotes: formattedQuotes
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }
});

/**
 * 1.b GET /average
 * Returns the average of the most recent quotes.
 */
app.get('/average', async (req, res) => {
    try {
        const quotes = await getLatestQuotes();
        if (quotes.length === 0) {
            return res.status(404).json({ error: 'No data available' });
        }

        let totalBuy = 0;
        let totalSell = 0;
        let totalSpread = 0; // 
        const source_count = quotes.length; // 
        const lastUpdate = quotes[0].createdAt; // 

        quotes.forEach(q => {
            totalBuy += q.buy_price;
            totalSell += q.sell_price;
            totalSpread += (q.sell_price - q.buy_price); // 
        });

        const average_buy_price = totalBuy / source_count;
        const average_sell_price = totalSell / source_count;
        const average_spread = totalSpread / source_count; // 

        res.json({
            last_update_utc: lastUpdate, // 
            source_count: source_count, // 
            average_buy_price: parseFloat(average_buy_price.toFixed(2)),
            average_sell_price: parseFloat(average_sell_price.toFixed(2)),
            average_spread: parseFloat(average_spread.toFixed(2)) // 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate average' });
    }
});

/**
 * 1.c GET /slippage
 * Returns the slippage percentage between each source and the average.
 */
app.get('/slippage', async (req, res) => {
    try {
        const quotes = await getLatestQuotes();
        if (quotes.length === 0) {
            return res.status(404).json({ error: 'No data available' });
        }

        const lastUpdate = quotes[0].createdAt; // 

        //  Calculate Averages
        let totalBuy = 0;
        let totalSell = 0;
        quotes.forEach(q => {
            totalBuy += q.buy_price;
            totalSell += q.sell_price;
        });
        const avgBuy = totalBuy / quotes.length;
        const avgSell = totalSell / quotes.length;

        // Calculate Slippage for each source
        const slippageResults = quotes.map(q => {
            const buy_price_slippage = (q.buy_price - avgBuy) / avgBuy;
            const sell_price_slippage = (q.sell_price - avgSell) / avgSell;

            return {
                buy_price_slippage: parseFloat(buy_price_slippage.toFixed(4)),
                sell_price_slippage: parseFloat(sell_price_slippage.toFixed(4)),
                source: q.source
            };
        });

        // Respond with a wrapper object
        res.json({
            last_update_utc: lastUpdate,
            slippage_analysis: slippageResults
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate slippage' });
    }
});



async function startServer() {
   
    await setupDatabase();

    
    require('./scheduler.js');

    
    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`);
    });
}


startServer();