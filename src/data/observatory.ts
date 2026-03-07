export type CosmicCategory = 'all' | 'nebulae' | 'galaxies' | 'black holes' | 'supernovae' | 'star clusters' | 'aurora' | 'solar system' | 'general' | 'test' | 'nebula' | 'galaxy' | 'blackhole' | 'supernova' | 'cluster' | 'pulsar' | 'starscape';

export interface CosmicObject {
    id: string;
    title: string;
    classification: string;
    category: string;
    fact: string;
    distance: string;
    imageUrl?: string;
    credit: string;
    glowColor: string;
    procedural?: boolean;
}

export function categorizeObject(apodData: any): string {
    const text = (apodData.title + ' ' + (apodData.explanation || '')).toLowerCase();

    if (text.includes('nebula') || text.includes('cloud') || text.includes('pillars'))
        return 'nebula';
    if (text.includes('galaxy') || text.includes('galax'))
        return 'galaxy';
    if (text.includes('black hole') || text.includes('singularity'))
        return 'blackhole';
    if (text.includes('supernova') || text.includes('remnant') || text.includes('explosion'))
        return 'supernova';
    if (text.includes('cluster') || text.includes('globular'))
        return 'cluster';
    if (text.includes('aurora') || text.includes('northern lights'))
        return 'aurora';
    if (text.includes('pulsar') || text.includes('neutron star'))
        return 'pulsar';

    return 'general';
}

export const cosmosCollection: CosmicObject[] = [
    {
        id: 'cg-4',
        title: "God's Hand (CG 4)",
        classification: 'COMETARY GLOBULE',
        category: 'nebula',
        fact: 'This eerie, jaw-like structure is a cometary globule located in the Puppis constellation, stretching 8 light-years across as it reaches into the cosmos.',
        distance: '1,300 light years',
        imageUrl: '/cosmos/CG 4 Extra large.jpg',
        credit: 'CTIO/NOIRLab/NSF/AURA',
        glowColor: '#8B4A6B',
    },
    {
        id: 'pillars-of-creation',
        title: 'Pillars of Creation',
        classification: 'STAR-FORMING REGION',
        category: 'nebula',
        fact: 'These massive columns of interstellar gas and dust are incubators for new stars, being slowly eroded by intense ultraviolet radiation from massive young stars nearby.',
        distance: '6,500 light years',
        imageUrl: '/cosmos/pillars of creation._Extra Large.png',
        credit: 'NASA/ESA/CSA/STScI',
        glowColor: '#C4A35A',
    },
    {
        id: 'ngc-6357',
        title: 'War and Peace Nebula',
        classification: 'EMISSION NEBULA',
        category: 'nebula',
        fact: 'Housing some of the most massive young stars in our galaxy, NGC 6357 is a turbulent region where stellar winds continuously sculpt the surrounding gas.',
        distance: '5,500 light years',
        imageUrl: '/cosmos/NGC 6357.jpg',
        credit: 'NASA, ESA, and J. Maíz Apellániz',
        glowColor: '#e05b5b',
    },
    {
        id: 'noirlab2515a',
        title: 'The Great Orion Nebula',
        classification: 'GIANT DIFFUSE NEBULA',
        category: 'nebula',
        fact: 'A spectacular tapestry of star birth and death, woven from swirling clouds of ionized gas and cosmic dust, visible even with the naked eye.',
        distance: '1,344 light years',
        imageUrl: '/cosmos/noirlab2515a-resized.jpg',
        credit: 'NOIRLab/NSF/AURA',
        glowColor: '#4A6FA5',
    },
    {
        id: 'night-sky',
        title: 'Milky Way Panorama',
        classification: 'GALACTIC PLANE',
        category: 'starscape',
        fact: 'A breathtaking view of our home galaxy from within, revealing dark dust lanes that obscure the brilliant light of billions of stars in the galactic core.',
        distance: '26,000 light years (Center)',
        imageUrl: '/cosmos/sky photo of the night sky EXTRA LARGE-resized.jpg',
        credit: 'E. Slawik',
        glowColor: '#3D6B8C',
    }
];

export async function fetchAPOD(): Promise<CosmicObject | null> {
    const CACHE_KEY = 'astrova_apod_cache_v2';
    const CACHE_DATE_KEY = 'astrova_apod_date_v2';

    const today = new Date().toISOString().split('T')[0];
    const cachedDate = sessionStorage.getItem(CACHE_DATE_KEY);
    const cachedData = sessionStorage.getItem(CACHE_KEY);

    if (cachedDate === today && cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await response.json();

        if (data.media_type === 'image') {
            // APOD images often lack CORS headers, crashing WebGL. Route through an image proxy that adds them and resizes to max 2048px to prevent GPU VRAM overflows.
            const sourceUrl = data.hdurl || data.url;
            const proxiedUrl = `https://wsrv.nl/?url=${encodeURIComponent(sourceUrl)}&output=jpg&w=2048`;

            const object: CosmicObject = {
                id: `apod-${today}`,
                title: data.title,
                classification: 'ASTRONOMY PICTURE OF THE DAY',
                category: categorizeObject(data),
                fact: data.explanation.split('.')[0] + '.', // First sentence as a fact
                distance: 'Varies',
                imageUrl: proxiedUrl,
                credit: data.copyright ? `Image: ${data.copyright}` : 'NASA APOD',
                glowColor: '#00d4d8',
            };

            sessionStorage.setItem(CACHE_KEY, JSON.stringify(object));
            sessionStorage.setItem(CACHE_DATE_KEY, today);

            return object;
        }
    } catch (e) {
        console.error("Failed to fetch APOD", e);
    }

    return null;
}
