# Currency Exchange API

This is a Node.js, Express, and Sequelize backend project built for an assignment. It provides a robust, real-time API for USD to ARS (Argentine Peso) exchange rates by aggregating data from three distinct, reliable sources.

The API is designed to be fault-tolerant, meaning it will continue to serve data even if one or two of the external sources fail.

Live URL: https://currency-api-b0ra.onrender.com

---

## Assignment Requirements

This project successfully fulfills all "Must-have" requirements from the assignment:

* **HTTP Server**: An Express.js server exposes all required endpoints.
* **3 Endpoints**: `GET /quotes`, `GET /average`, and `GET /slippage` are all implemented.
* **3 Sources**: The app aggregates data from three distinct external sources.
* **Fresh Information**: A `node-cron` job updates the data every 60 seconds[cite: 50].
* **GitHub Deployment**: The project is deployed on GitHub[cite: 52].
* **Public URL**: The project is deployed to a live public URL[cite: 51].

---

## Enhanced Features

As encouraged by the assignment, several useful attributes and insights have been added to the endpoints for a richer, more professional API:

* **`last_update_utc`**: Added to all endpoints to prove data freshness and provide a clear timestamp for the data batch.
* **`source_count`**: Added to the `/average` endpoint to show how many sources were successfully used for that calculation (a key reliability metric).
* **`spread`**: Added to the `/quotes` endpoint for each source, showing the difference between the buy and sell price.
* **`average_spread`**: Added to the `/average` endpoint.
* **Fault-Tolerant Design**: The service will not crash if an external API fails. It will continue to serve averages and quotes from the sources that *did* succeed.
* **Pretty-Printed JSON**: All JSON responses are formatted with indentation for easy readability.

---

## Endpoints

### 1. `GET /quotes`

Returns the latest available quotes from all successful sources.

-   **`last_update_utc`**: The timestamp of the last data refresh.
-   **`quotes`**: An array of quote objects.
    -   **`buy_price`**: The buy price.
    -   **`sell_price`**: The sell price.
    -   **`spread`**: The difference between sell and buy.
    -   **`source`**: The original URL of the data source.

### 2. `GET /average`

Returns the calculated average of all available quotes.

-   **`last_update_utc`**: The timestamp of the last data refresh.
-   **`source_count`**: The number of sources successfully fetched for this average (e.g., 3).
-   **`average_buy_price`**: The average buy price.
-   **`average_sell_price`**: The average sell price.
-   **`average_spread`**: The average spread.

### 3. `GET /slippage`

Returns a slippage analysis showing how much each source deviates from the average.

-   **`last_update_utc`**: The timestamp of the last data refresh.
-   **`slippage_analysis`**: An array of slippage objects.
    -   **`buy_price_slippage`**: Percentage difference from the average buy price.
    -   **`sell_price_slippage`**: Percentage difference from the average sell price.
    -   **`source`**: The original URL of the data source.

---

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Database:** Sequelize (with SQLite for development)
-   **Data Fetching:** Axios
-   **Scheduling:** node-cron

---

## How to Run Locally

1.  Clone the repository:
    ```bash
    git clone [Your-Repo-URL]
    cd currency-api
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  The server will be available at `http://localhost:3000`.
