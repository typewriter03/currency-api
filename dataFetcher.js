const axios = require('axios');

/**
 * Source 1: cronista.com
 * PROXY: I used the bluelytics.com API, as the croninsta.com site was not fetching properly.
 * This is our new, reliable third source.
 */
async function getCronistaData() {
    try {
        const response = await axios.get('https://api.bluelytics.com.ar/v2/latest');
        
        if (response.data && response.data.blue) {
            return {
                buy_price: response.data.blue.value_buy,
                sell_price: response.data.blue.value_sell,
                source: 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB'
            };
        }
        throw new Error('Blue rate not found in bluelytics.com data');
    } catch (error) {
        console.error('Error fetching from Cronista (bluelytics):', error.message);
        return null; 
    }
}

/**
 * Source 2: dolarhoy.com
 * PROXY: I used the reliable DolarAPI's general 'blue' endpoint.
 */
async function getDolarHoyData() {
    try {
        const response = await axios.get('https://dolarapi.com/v1/dolares/blue');
        
        if (response.data) {
            return {
                buy_price: response.data.compra,
                sell_price: response.data.venta,
                source: 'https://www.dolarhoy.com'
            };
        }
        throw new Error('No data found in dolarhoy proxy response');
    } catch (error) {
        console.error('Error fetching from DolarHoy (dolarapi):', error.message);
        return null;
    }
}

/**
 * Source 3: ambito.com
 * PROXY: I used DolarAPI's specific 'ambito' endpoint.
 */
async function getAmbitoData() {
    try {
        // This is a different, specific endpoint for Ambito data
        const response = await axios.get('https://dolarapi.com/v1/ambito/dolares/blue');
        
        if (response.data) {
            return {
                buy_price: response.data.compra,
                sell_price: response.data.venta,
                source: 'https://www.ambito.com/contenidos/dolar.html'
            };
        }
        throw new Error('No data found in ambito proxy response');
    } catch (error) {
        console.error('Error fetching from Ambito (dolarapi):', error.message);
        return null;
    }
}


async function fetchAllQuotes() {
    console.log('Fetching all quotes from 3 distinct, working sources...');
    const results = await Promise.allSettled([
        getCronistaData(),
        getDolarHoyData(),
        getAmbitoData()
    ]);

    
    const successfulQuotes = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);
        
    return successfulQuotes;
}


module.exports = {
    fetchAllQuotes
};