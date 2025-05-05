export default async function handler(req, res) {
    // Your Basic Authentication credentials
    const username = process.env.BLUEBOX_USERNAME;
    const password = process.env.BLUEBOX_PASSWORD;

    // Encode credentials in Base64
    const credentials = Buffer.from(`${username}:${password}`).toString("base64");

    try {
        const response = await fetch("https://portal.x-connect.io/api/vessels-gps-positions?ids=1", {
            method: "GET",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data); // Return the fetched data to the client
        } else {
            res.status(response.status).json({ error: `Failed to fetch data: ${response.statusText}` });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}