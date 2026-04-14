
async function test() {
    const query = "balıkesir altıeylül gaziosmanpaşa 149 sokak";
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;

    console.log('Testing Photon URL:', url);

    const res = await fetch(url);
    const data = await res.json();
    console.log('Results:', JSON.stringify(data.features.map(f => ({
        name: f.properties.name,
        street: f.properties.street,
        city: f.properties.city,
        district: f.properties.district,
        osm_key: f.properties.osm_key,
        osm_value: f.properties.osm_value
    })), null, 2));
}

test();
