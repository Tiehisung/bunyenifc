import { ITeam } from "@/types/match.interface";




export const teamBnfc: ITeam & { url: string, officialSignature: string } = {
    _id: 'teamBnfc',
    url: 'https://bunyenifc.vercel.app',
    name: 'BunyeniFC',
    alias: 'yenFC',
    community: "Wa-Konjiehi",
    logo: 'https://res.cloudinary.com/dgp4vzn3m/image/upload/v1763109780/assets-storage/android-chrome-512x512_ii3dpc.png',
    officialSignature: 'https://res.cloudinary.com/dgp4vzn3m/image/upload/v1766906326/assets-storage/signature_alypm1.png',
    currentPlayers: [],
    contact: "0241508430",
    contactName: "Adam Wahid",
    createdAt: "2023-11-28T10:30:00Z",
    updatedAt: "2023-11-28T10:30:00Z",
};

// data/team.ts
export const TEAM = {
    // Basic Info
    id: "bnfc",
    name: "bunyenifc",
    displayName: "Wa Bunyeni FC",
    shortName: "BNFC",
    tagline: "The Pride of Wa",
    description: "Bunyeni Football Club is a professional football club based in Konjiehi, Ghana. Founded in 2020, the club has quickly established itself as a competitive force in regional football.",
    logo: 'https://res.cloudinary.com/dgp4vzn3m/image/upload/v1763109780/assets-storage/android-chrome-512x512_ii3dpc.png',

    // History
    founded: 2020,
    firstMatch: "2020-08-15",
    history: "Bunyeni FC was established by community leaders with the vision of developing local talent and promoting football in the Upper West region, Ghana.",

    // Branding
    colors: {
        primary: "#FF0000",
        secondary: "#FFFFFF",
        accent: "#000000",
        gradient: "linear-gradient(135deg, #FF0000 0%, #FFFFFF 50%, #000000 100%)",
    },

    logos: {
        default: teamBnfc.logo,
        light: teamBnfc.logo,
        dark: teamBnfc.logo,
        favicon: "/favicon.ico",
        icon: teamBnfc.logo,
    },

    // Venue
    stadium: {
        name: "Bunyeni Stadium",
        capacity: 5000,
        address: "Bunyeni, Sierra Leone",
        coordinates: {
            lat: "8.4833° N",
            lng: "13.2333° W",
        },
        image: "/stadium.jpg",
    },

    // Contact
    contact: {
        general: {
            email: "info@bunyenifc.com",
            phone: "+233559708485",
        },
        media: {
            email: "media@bunyenifc.com",
            phone: "+233559708485",
        },
        sponsorship: {
            email: "sponsorship@bunyenifc.com",
            phone: "+233559708485",
        },
        address: "Bunyeni Football Club, P.O. Box 15, Konjiehi, UWR, Ghana",
    },

    // Social Media
    social: {
        facebook: {
            url: "https://facebook.com/bunyenifc",
            handle: "@bunyenifc",
            followers: "10K",
        },
        instagram: {
            url: "https://instagram.com/bunyenifc",
            handle: "@bunyenifc",
            followers: "15K",
        },
        twitter: {
            url: "https://twitter.com/bunyenifc",
            handle: "@bunyenifc",
            followers: "8K",
        },
        youtube: {
            url: "https://youtube.com/bunyenifc",
            handle: "@bunyenifc",
            subscribers: "5K",
        },
        whatsapp: {
            url: "https://wa.me/233559708485",
            number: "+232 XXX XXX XXX",
        },
        tiktok: {
            url: "https://tiktok.com/@bunyenifc",
            handle: "@bunyenifc",
        },
    },

    // Digital Presence
    website: {
        url: "https://bunyenifc.vercel.app",
        api: "https://bunyeni-fc-api.vercel.app",
        // cdn: "https://cdn.bunyenifc.vercel.app",
    },

    // Metadata for SEO
    seo: {
        title: "bunyenifc - Official Website",
        description: "Official website of Bunyeni Football Club. Get the latest news, fixtures, results, and updates about your favorite team.",
        keywords: ["bunyenifc", "Bunyeni FC", "football", "African football"],
        ogImage: "/og-image.jpg",
    },

    // Achievements
    achievements: {
        leagueTitles: 0,
        cupTitles: 0,
        regionalTitles: 1,
        seasons: [
            { year: "2023", position: "3rd", notes: "Promotion season" },
        ],
    },

    // Current Season
    currentSeason: {
        year: "2025/26",
        league: "Regional League",
        position: "N/A",
        topScorer: null,
        captain: null,
    },

    // Technical Staff
    staff: {
        headCoach: null,
        assistantCoach: null,
        goalkeeperCoach: null,
        fitnessCoach: null,
        teamDoctor: null,
        physio: null,
    },

    // Default Images
    images: {
        default: {
            player: "/default-player.jpg",
            coach: "/default-coach.jpg",
            stadium: "/default-stadium.jpg",
            logo: "/bnfc-logo.png",
            banner: "/banner.jpg",
            avatar: "/default-avatar.jpg",
        },
        placeholders: {
            player: "https://via.placeholder.com/300x300?text=bunyenifc",
            team: "https://via.placeholder.com/600x400?text=bunyenifc",
        },
    },

    // Features
    features: {
        comments: true,
        sharing: true,
        likes: true,
        darkMode: true,
        multilingual: false,
    },

    // Localization
    locale: {
        default: "en",
        supported: ["en"],
        timezone: "Africa/Freetown",
        currency: "SLL",
    },
} as const;

// Type for the team data
export type Team = typeof TEAM;