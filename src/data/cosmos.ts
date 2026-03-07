export interface CosmosItem {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    credit: string;
    aspectRatio?: 'landscape' | 'portrait' | 'square';
}

export const cosmosData: CosmosItem[] = [
    {
        id: 'pillars-of-creation',
        title: 'Pillars of Creation',
        category: 'Nebula',
        description: 'Majestic spires of interstellar gas and dust bathed in the intense radiation of young stars. These dense columns are active star-forming regions where new stars are born from the collapse of cosmic material. This iconic view captures the chaotic beauty of stellar creation.',
        image: '/cosmos/pillars of creation.jpg',
        credit: 'NASA/ESA/Webb'
    },
    {
        id: 'phantom-galaxy',
        title: 'Phantom Galaxy',
        category: 'Spiral Galaxy',
        description: 'The Phantom Galaxy (M74) reveals its delicate lace-work of dust swirling within its grand spiral arms. Looking down the barrel of this face-on spiral galaxy provides a mesmerizing view of star clusters, glowing gas, and dark dust spiraling toward the brilliant galactic core.',
        image: '/cosmos/Phantom Galaxy.jpg',
        credit: 'NASA/ESA/Webb'
    },
    {
        id: 'cosmic-lighthouse',
        title: 'A Cosmic Lighthouse',
        category: 'Stellar Remnant',
        description: 'A fiercely spinning stellar remnant acting as a cosmic lighthouse illuminates the surrounding debris of its exploded progenitor star. Its intense magnetic fields whip particle winds into a glowing frenzy, painting across the darkness with spectacular sweeping beams.',
        image: '/cosmos/A cosmic lighthouse.jpg',
        credit: 'NASA/ESA'
    },
    {
        id: 'galactic-hug',
        title: 'Galactic Hug',
        category: 'Interacting Galaxies',
        description: 'Bound by the relentless pull of gravity, these two galaxies are caught in a slow-motion cosmic embrace. Instead of a violent collision, they wrap around each other, distorting their shapes while triggering massive waves of new star formation in the process.',
        image: '/cosmos/galactic hug.jpg',
        credit: 'NASA/ESA'
    },
    {
        id: 'galactic-dance',
        title: 'Galactic Dance',
        category: 'Interacting Galaxies',
        description: 'A spectacular gravitational dance between interacting galaxies. Tidal forces stretch out long tails of stars, gas, and dust as the immense structures pass beautifully close to one another, reshaping each other over hundreds of millions of years.',
        image: '/cosmos/Galactic Dance.jpg',
        credit: 'NASA/ESA'
    }
];
