
async function test() {
    const queries = [
        "balıkesir altıeylül gaziosmanpaşa 149 sokak no:6, Turkey",
        "149. Sokak, Gaziosmanpaşa, Altıeylül, Balıkesir, Turkey",
        "Gaziosmanpaşa, Altıeylül, Balıkesir, Turkey"
    ];

    for (const query of queries) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const res = await fetch(url, { headers: { 'User-Agent': 'EvoraApp/1.0' } });
        const data = await res.json();
        console.log(`Query: ${query} -> Found: ${data.length > 0}`);
    }
}

test();
