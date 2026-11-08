import fs from 'fs';
import path from 'path';
import { GlossaryEntry } from './types';

const DATA_FILE = path.join(__dirname, '..', 'data', 'entries.json');

export function readEntries(): GlossaryEntry[] {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as GlossaryEntry[];
}

export function writeEntries(entries: GlossaryEntry[]): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
}