
async function test() {
    const city = "Balıkesir";
    const district = "Altıeylül";
    const neighborhood = "Bahçelievler";
    const street = "Atatürk Caddesi";
    const buildingNo = "10";

    const addressString = `${street} No:${buildingNo}, ${neighborhood}, ${district}, ${city}, Turkey`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=1`;

    console.log('Testing URL:', url);

    const res = await fetch(url, {
        headers: {
            'User-Agent': 'EvoraApp/1.0'
        }
    });
    const data = await res.json();
    console.log('Results:', JSON.stringify(data, null, 2));
}

test();
