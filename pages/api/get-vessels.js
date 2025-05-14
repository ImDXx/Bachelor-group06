// pages/api/get-positions.js
import snowflake from "snowflake-sdk";

export default async function handler(req, res) {
  // Snowflake connection configuration
  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT, // Set your account in .env.local
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
  });

  // Connect to Snowflake
  connection.connect((err, conn) => {
    if (err) {
      res.status(500).json({ error: `Unable to connect: ${err.message}` });
      return;
    }
    console.log("Successfully connected to Snowflake");

    // Use the configured database and schema
    connection.execute({
      sqlText: `USE DATABASE ULSTEINGROUP_DEV_DB; USE SCHEMA featuriz`,
      complete: (err) => {
        if (err) {
          res
            .status(500)
            .json({ error: `Error running USE commands: ${err.message}` });
        } else {
          // Now run your main query
          const query = "SELECT * FROM FEATURIZ_VESSEL_WEATHER_FEATURES LIMIT 10";
          connection.execute({
            sqlText: query,
            complete: (err, stmt, rows) => {
              if (err) {
                res
                  .status(500)
                  .json({ error: `Error executing query: ${err.message}` });
              } else {
                res.status(200).json(rows);
              }
            },
          });
        }
      },
    });
  });
  console.log("Testing Snowflake connection...");
}
