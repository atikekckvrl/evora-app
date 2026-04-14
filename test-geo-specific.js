
async function test() {
    const query = "balıkesir altıeylül gaziosmanpaşa 149 sokak no:6, Turkey";
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    console.log('Testing URL:', url);

    const res = await fetch(url, {
        headers: { 'User-Agent': 'EvoraApp/1.0' }
    });
    const data = await res.json();
    console.log('Results:', JSON.stringify(data, null, 2));
}

test();
