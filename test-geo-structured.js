
async function test() {
    const street = "149. Sokak";
    const neighborhood = "Gaziosmanpaşa";
    const district = "Altıeylül";
    const city = "Balıkesir";

    const url = `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&county=${encodeURIComponent(district)}&limit=1`;

    console.log('Testing Structured URL:', url);

    const res = await fetch(url, { headers: { 'User-Agent': 'EvoraApp/1.0' } });
    const data = await res.json();
    console.log('Results:', JSON.stringify(data, null, 2));
}

test();
