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



export const cosmosCollection: CosmicObject[] = [
    {
        id: 'cg-4',
        title: "CG 4",
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


