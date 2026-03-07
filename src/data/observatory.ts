export type CosmicCategory = 'all' | 'nebulae' | 'galaxies' | 'black holes' | 'supernovae' | 'star clusters' | 'aurora' | 'solar system' | 'general' | 'test' | 'nebula' | 'galaxy' | 'blackhole' | 'supernova' | 'cluster' | 'pulsar';

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
        id: 'pillars-of-creation',
        title: 'Pillars of Creation',
        classification: 'STAR-FORMING REGION',
        category: 'nebula',
        fact: 'The pillars are being slowly evaporated by radiation from nearby young stars — they will be gone in 100,000 years.',
        distance: '6,500 light years',
        imageUrl: '/cosmos/pillars of creation.jpg',
        credit: 'NASA, ESA, CSA, STScI',
        glowColor: '#8B4A6B',
    },
    {
        id: 'crab-nebula',
        title: 'Crab Nebula',
        classification: 'SUPERNOVA REMNANT & PULSAR',
        category: 'supernova',
        fact: 'At its center, a neutron star spins 30 times per second, sweeping beams of radiation across the Earth like a cosmic lighthouse.',
        distance: '6,500 light years',
        imageUrl: 'https://stsci-opo.org/STScI-01HBBMDH3RGX60SJPTTMGEM3AS.png',
        credit: 'NASA, ESA, CSA, STScI',
        glowColor: '#C4A35A',
    },
    {
        id: 'andromeda',
        title: 'Andromeda Galaxy',
        classification: 'SPIRAL GALAXY',
        category: 'galaxy',
        fact: 'Andromeda is heading directly toward us at 110 kilometers per second. In 4.5 billion years, it will merge with the Milky Way.',
        distance: '2.5 million light years',
        imageUrl: 'https://noirlab.edu/public/media/archives/images/screen/noao-m31.jpg',
        credit: 'T.A.Rector & B.A.Wolpa / NOIRLab / NSF / AURA',
        glowColor: '#4A6FA5',
    },
    {
        id: 'galactic-hug',
        title: 'NGC 2207 & IC 2163',
        classification: 'COLLIDING GALAXIES',
        category: 'galaxy',
        fact: 'These two galaxies grazed each other millions of years ago and are destined to merge into one single galaxy billions of years from now.',
        distance: '114 million light years',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Crab_Nebula.jpg',
        credit: 'X-ray: NASA/CXC/SAO; Infrared: NASA/ESA/CSA/STScI/Webb',
        glowColor: '#3D6B8C',
    },
    {
        id: 'black-hole-circinus',
        title: 'Circinus Galaxy Black Hole',
        classification: 'SUPERMASSIVE BLACK HOLE',
        category: 'blackhole',
        fact: 'This is the sharpest view ever captured of a black hole\'s accretion disk — a swirling ring of superheated matter moments before being consumed forever.',
        distance: '14 million light years',
        procedural: true,
        glowColor: '#FF6B35',
        credit: 'Procedural Generation',
    },
    {
        id: 'carina-nebula',
        title: 'Carina Nebula — Cosmic Cliffs',
        classification: 'EMISSION NEBULA',
        category: 'nebula',
        fact: 'What looks like mountains and valleys is actually the edge of a star nursery — the peaks are 7 light years tall.',
        distance: '7,600 light years',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Carina_Nebula_by_Webb_%28NIRCam%29.jpg',
        credit: 'NASA, ESA, CSA, STScI',
        glowColor: '#4A8FA5',
    },
    {
        id: 'southern-ring-nebula',
        title: 'Southern Ring Nebula',
        classification: 'PLANETARY NEBULA',
        category: 'nebula',
        fact: 'A dying star has been shedding its outer layers for thousands of years — this ring of gas is the star\'s own atmosphere, cast off into space.',
        distance: '2,500 light years',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Southern_Ring_Nebula_Captured_by_Webb_Telescope.jpg',
        credit: 'NASA, ESA, CSA, STScI',
        glowColor: '#7B5EA7',
    },
    {
        id: 'stephan-quintet',
        title: "Stephan's Quintet",
        classification: 'GALAXY GROUP',
        category: 'galaxy',
        fact: 'Four of these five galaxies are locked in a gravitational dance, colliding and merging over hundreds of millions of years.',
        distance: '290 million light years',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Stephan%27s_Quintet_Webb.jpg',
        credit: 'NASA, ESA, CSA, STScI',
        glowColor: '#5A7FA5',
    },
    {
        id: 'cg-4-large',
        title: 'CG 4 (Large)',
        classification: 'TEST IMAGE',
        category: 'test',
        fact: 'Testing the performance of a large resolution texture mapping onto the inner hemisphere.',
        distance: 'Local',
        imageUrl: '/cosmos/CG 4 large.jpg',
        credit: 'User Upload',
        glowColor: '#ffffff',
    },
    {
        id: 'cg-4-extra-large',
        title: 'CG 4 (Extra Large)',
        classification: 'TEST IMAGE MAX',
        category: 'test',
        fact: 'Testing the performance of an extremely large resolution texture to evaluate WebGL context limits and frame drops.',
        distance: 'Local',
        imageUrl: '/cosmos/CG 4 Extra large.jpg',
        credit: 'User Upload',
        glowColor: '#ffffff',
    },
    {
        id: 'pillars-extra-large',
        title: 'Pillars of Creation (Max)',
        classification: 'TEST IMAGE SUPER',
        category: 'test',
        fact: 'Testing the performance of the full resolution PNG version of the Pillars of Creation.',
        distance: 'Local',
        imageUrl: '/cosmos/pillars of creation._Extra Large.png',
        credit: 'User Upload',
        glowColor: '#8B4A6B',
    },
    {
        id: 'night-sky-extra-large',
        title: 'Night Sky (Extra Large Resized)',
        classification: 'TEST IMAGE ULTRA',
        category: 'test',
        fact: 'Testing the performance of an extra large night sky photograph.',
        distance: 'Local',
        imageUrl: '/cosmos/sky photo of the night sky EXTRA LARGE-resized.jpg',
        credit: 'User Upload',
        glowColor: '#ffffff',
    },
    {
        id: 'ngc-6357',
        title: 'NGC 6357',
        classification: 'TEST IMAGE LOW',
        category: 'test',
        fact: 'Testing the performance of the NGC 6357 image.',
        distance: 'Local',
        imageUrl: '/cosmos/NGC 6357.jpg',
        credit: 'User Upload',
        glowColor: '#e05b5b',
    },
    {
        id: 'noirlab2515a',
        title: 'NOIRLab 2515a',
        classification: 'TEST IMAGE HIGH',
        category: 'test',
        fact: 'Testing the performance of the NOIRLab 2515a image.',
        distance: 'Local',
        imageUrl: '/cosmos/noirlab2515a-resized.jpg',
        credit: 'User Upload',
        glowColor: '#ffffff',
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
