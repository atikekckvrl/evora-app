
async function test() {
    const query = "gaziosmanpaşa 149 sokak, Balıkesir";
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`;

    const res = await fetch(url, { headers: { 'User-Agent': 'EvoraApp/1.0' } });
    const data = await res.json();

    console.log(`Total results: ${data.length}`);
    for (const item of data) {
        console.log(`- ${item.display_name} (Class: ${item.class}, Type: ${item.type})`);
    }
}

test();
