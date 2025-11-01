const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize to use SQLite
// This will create a file named 'database.sqlite'
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false 
});

// Define the 'Quote' model 
const Quote = sequelize.define('Quote', {
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    buy_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sell_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
    
});

// Function to connect and sync the database
async function setupDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Export the setup function and the Quote model
module.exports = {
    setupDatabase,
    Quote
};