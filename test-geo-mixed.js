
async function test() {
    const searchQuery = "gaziosmanpaşa 149 sokak";
    const city = "Balıkesir";

    const url = `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(city)}&limit=1`;

    console.log('Testing Mixed Structured URL:', url);

    const res = await fetch(url, { headers: { 'User-Agent': 'EvoraApp/1.0' } });
    const data = await res.json();
    console.log('Results:', JSON.stringify(data, null, 2));
}

test();
