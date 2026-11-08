export interface GlossaryEntry {
    id: string;
    term: string;
    definition: string;
    category?: string;
    imageUrl?: string;
    youtubeUrl?: string;
    createdAt: string;
}