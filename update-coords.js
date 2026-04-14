
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const houses = await prisma.house.findMany({
        where: {
            OR: [
                { latitude: null },
                { longitude: null }
            ]
        }
    });

    console.log(`Found ${houses.length} houses without coordinates.`);

    for (const house of houses) {
        const { street, buildingNo, neighborhood, district, city } = house;
        const addressString = `${street} ${buildingNo}, ${neighborhood}, ${district}, ${city}, Turkey`;

        try {
            console.log(`Geocoding: ${addressString}`);
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=1`, {
                headers: {
                    'User-Agent': 'EvoraApp/1.0'
                }
            });
            const geoData = await geoRes.json();

            if (geoData && geoData.length > 0) {
                const latitude = parseFloat(geoData[0].lat);
                const longitude = parseFloat(geoData[0].lon);

                await prisma.house.update({
                    where: { id: house.id },
                    data: { latitude, longitude }
                });
                console.log(`Updated house ${house.id} with coords: ${latitude}, ${longitude}`);
            } else {
                console.log(`No results for ${addressString}`);
            }
            // Wait a bit to respect Nominatim usage policy (1 req/s)
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            console.error(`Error for ${house.id}:`, err);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
