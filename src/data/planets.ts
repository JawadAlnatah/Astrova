export const planets = [
  {
    id: 'mercury',
    name: 'Mercury',
    classification: 'Terrestrial Planet',
    stats: {
      diameter: '4,880 km',
      mass: '3.30 × 10²³ kg',
      distanceFromSun: '57.9 million km',
      moons: 0,
      surfaceTemp: '167°C average',
      orbitalPeriod: '88 Earth days'
    },
    facts: [
      'Mercury is the fastest planet, zipping around the Sun at 47 kilometers per second.',
      'Despite being closest to the Sun, it is not the hottest planet — Venus is.',
      'Mercury has a huge metallic core that takes up about 85% of the planet\'s radius.'
    ],
    missions: [
      {
        name: 'MESSENGER',
        agency: 'NASA',
        launchYear: 2004,
        status: 'Complete',
        description: 'First spacecraft to orbit Mercury, mapping its entire surface.',
        facts: ['Discovered water ice in permanently shadowed craters at the poles.']
      }
    ],
    textureUrl: '/textures/8k_mercury.jpg',
    mapTextureUrl: '/textures/2k_mercury.jpg',
    atmosphereColor: '#a8a8a8',
    orbitRadius: 100,
    orbitSpeed: 0.235,
    orbitTilt: 0.02,
    orbitOffset: Math.PI * 0.1,
    mapSize: 10,
    size: 0.38,
  },
  {
    id: 'venus',
    name: 'Venus',
    classification: 'Terrestrial Planet',
    stats: {
      diameter: '12,104 km',
      mass: '4.87 × 10²⁴ kg',
      distanceFromSun: '108.2 million km',
      moons: 0,
      surfaceTemp: '464°C average',
      orbitalPeriod: '225 Earth days'
    },
    facts: [
      'Venus rotates backwards compared to most other planets.',
      'Its thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet.',
      'The surface pressure on Venus is 92 times that of Earth — like being 900 meters underwater.'
    ],
    missions: [
      {
        name: 'Magellan',
        agency: 'NASA',
        launchYear: 1989,
        status: 'Complete',
        description: 'Mapped the surface of Venus using synthetic aperture radar.',
        facts: ['Revealed a surface covered in volcanoes and vast lava plains.']
      }
    ],
    textureUrl: '/textures/8k_venus_surface.jpg',
    mapTextureUrl: '/textures/2k_venus_surface.jpg',
    atmosphereColor: '#e3bb76',
    orbitRadius: 145,
    orbitSpeed: 0.09,
    orbitTilt: 0.06,
    orbitOffset: Math.PI * 0.8,
    mapSize: 16,
    size: 0.95,
  },
  {
    id: 'earth',
    name: 'Earth',
    classification: 'Terrestrial Planet',
    stats: {
      diameter: '12,742 km',
      mass: '5.97 × 10²⁴ kg',
      distanceFromSun: '149.6 million km',
      moons: 1,
      surfaceTemp: '15°C average',
      orbitalPeriod: '365.25 Earth days'
    },
    facts: [
      'Earth is the only known planet to harbor life.',
      'About 71% of the Earth\'s surface is water-covered.',
      'Earth\'s atmosphere protects us from meteoroids, most of which burn up before striking the surface.'
    ],
    missions: [
      {
        name: 'ISS',
        agency: 'Multi-Agency',
        launchYear: 1998,
        status: 'Active',
        description: 'A modular space station in low Earth orbit.',
        facts: ['Continuously occupied for over 20 years.']
      }
    ],
    textureUrl: '/textures/8k_earth_daymap.jpg',
    cloudsUrl: '/textures/8k_earth_clouds.jpg',
    mapTextureUrl: '/textures/2k_earth_daymap.jpg',
    mapCloudsUrl: '/textures/2k_earth_clouds.jpg',
    atmosphereColor: '#4b90ff',
    orbitRadius: 200,
    orbitSpeed: 0.055,
    orbitTilt: 0.0,
    orbitOffset: 0,
    mapSize: 18,
    size: 1,
  },
  {
    id: 'mars',
    name: 'Mars',
    classification: 'Terrestrial Planet',
    stats: {
      diameter: '6,779 km',
      mass: '6.39 × 10²³ kg',
      distanceFromSun: '227.9 million km',
      moons: 2,
      surfaceTemp: '-63°C average',
      orbitalPeriod: '687 Earth days'
    },
    facts: [
      'Mars has the largest volcano in the solar system — Olympus Mons, three times the height of Everest.',
      'A day on Mars is 24 hours and 37 minutes — almost identical to Earth.',
      'Mars has two tiny moons, Phobos and Deimos, which may be captured asteroids.'
    ],
    missions: [
      {
        name: 'Perseverance',
        agency: 'NASA',
        launchYear: 2020,
        status: 'Active',
        description: 'Searching for signs of ancient microbial life and collecting rock samples.',
        facts: ['Carried the Ingenuity helicopter — the first powered flight on another planet.']
      }
    ],
    textureUrl: '/textures/8k_mars.jpg',
    mapTextureUrl: '/textures/2k_mars.jpg',
    atmosphereColor: '#c1440e',
    orbitRadius: 255,
    orbitSpeed: 0.03,
    orbitTilt: 0.03,
    orbitOffset: Math.PI * 1.5,
    mapSize: 14,
    size: 0.53,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    classification: 'Gas Giant',
    stats: {
      diameter: '139,820 km',
      mass: '1.90 × 10²⁷ kg',
      distanceFromSun: '778.5 million km',
      moons: 95,
      surfaceTemp: '-110°C average',
      orbitalPeriod: '11.9 Earth years'
    },
    facts: [
      'Jupiter is more than twice as massive as all the other planets combined.',
      'The Great Red Spot is a giant storm that has been raging for hundreds of years.',
      'Jupiter has the shortest day in the solar system, taking only 10 hours to rotate once.'
    ],
    missions: [
      {
        name: 'Juno',
        agency: 'NASA',
        launchYear: 2011,
        status: 'Active',
        description: 'Studying Jupiter\'s composition, gravity field, magnetic field, and polar magnetosphere.',
        facts: ['Provided the first clear views of Jupiter\'s poles.']
      }
    ],
    textureUrl: '/textures/8k_jupiter.jpg',
    mapTextureUrl: '/textures/2k_jupiter.jpg',
    atmosphereColor: '#d39c7e',
    orbitRadius: 380,
    orbitSpeed: 0.0045,
    orbitTilt: 0.02,
    orbitOffset: Math.PI * 0.4,
    mapSize: 52,
    size: 5,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    classification: 'Gas Giant',
    stats: {
      diameter: '116,460 km',
      mass: '5.68 × 10²⁶ kg',
      distanceFromSun: '1.43 billion km',
      moons: 146,
      surfaceTemp: '-140°C average',
      orbitalPeriod: '29.5 Earth years'
    },
    facts: [
      'Saturn\'s rings are made mostly of chunks of ice and small amounts of carbonaceous dust.',
      'Saturn is the only planet in our solar system that is less dense than water.',
      'It has a hexagonal-shaped storm at its north pole.'
    ],
    missions: [
      {
        name: 'Cassini-Huygens',
        agency: 'NASA/ESA/ASI',
        launchYear: 1997,
        status: 'Complete',
        description: 'Studied the planet and its many natural satellites.',
        facts: ['Dropped the Huygens probe onto Saturn\'s moon Titan.']
      }
    ],
    textureUrl: '/textures/8k_saturn.jpg',
    mapTextureUrl: '/textures/2k_saturn.jpg',
    ringTextureUrl: '/textures/8k_saturn_ring_alpha.png',
    atmosphereColor: '#ead6b8',
    orbitRadius: 570,
    orbitSpeed: 0.0019,
    orbitTilt: 0.04,
    orbitOffset: Math.PI * 1.2,
    mapSize: 44,
    size: 4.2,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    classification: 'Ice Giant',
    stats: {
      diameter: '50,724 km',
      mass: '8.68 × 10²⁵ kg',
      distanceFromSun: '2.87 billion km',
      moons: 28,
      surfaceTemp: '-195°C average',
      orbitalPeriod: '84 Earth years'
    },
    facts: [
      'Uranus rotates on its side, likely due to a massive collision in its past.',
      'It is the coldest planet in the solar system, with temperatures dropping to -224°C.',
      'Uranus has faint rings made of dark, dust-sized particles.'
    ],
    missions: [
      {
        name: 'Voyager 2',
        agency: 'NASA',
        launchYear: 1977,
        status: 'Complete',
        description: 'The only spacecraft to have visited Uranus.',
        facts: ['Discovered 10 new moons and two new rings.']
      }
    ],
    textureUrl: '/textures/2k_uranus.jpg',
    mapTextureUrl: '/textures/2k_uranus.jpg',
    atmosphereColor: '#4b70dd',
    orbitRadius: 730,
    orbitSpeed: 0.000675,
    orbitTilt: 0.01,
    orbitOffset: Math.PI * 1.8,
    mapSize: 28,
    size: 2.5,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    classification: 'Ice Giant',
    stats: {
      diameter: '49,244 km',
      mass: '1.02 × 10²⁶ kg',
      distanceFromSun: '4.50 billion km',
      moons: 16,
      surfaceTemp: '-200°C average',
      orbitalPeriod: '165 Earth years'
    },
    facts: [
      'Neptune has the strongest winds in the solar system, reaching speeds of 2,100 km/h.',
      'It was the first planet located through mathematical calculations rather than observation.',
      'Neptune\'s moon Triton orbits in the opposite direction to the planet\'s rotation.'
    ],
    missions: [
      {
        name: 'Voyager 2',
        agency: 'NASA',
        launchYear: 1977,
        status: 'Complete',
        description: 'The only spacecraft to have visited Neptune.',
        facts: ['Observed the Great Dark Spot, a massive storm system.']
      }
    ],
    textureUrl: '/textures/2k_neptune.jpg',
    mapTextureUrl: '/textures/2k_neptune.jpg',
    atmosphereColor: '#274687',
    orbitRadius: 900,
    orbitSpeed: 0.00034,
    orbitTilt: 0.03,
    orbitOffset: Math.PI * 0.9,
    mapSize: 26,
    size: 2.4,
  }
];
