
async function test() {
    const query = "gaziosmanpaşa 149 sokak, Balıkesir";
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&featuretype=road`;

    console.log('Testing Road Feature URL:', url);

    const res = await fetch(url, { headers: { 'User-Agent': 'EvoraApp/1.0' } });
    const data = await res.json();
    console.log('Results:', JSON.stringify(data, null, 2));
}

test();
