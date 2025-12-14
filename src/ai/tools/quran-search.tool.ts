import { tool } from '@openai/agents';
import z from 'zod';
import { getVersesByChapter, getChapters } from '@/features/quran';
import { logger } from '@/utils/logger.util';
import { toToon } from '@/utils/toon.util';

export const quranSearchTool = tool({
  name: 'search_quran_verses',
  description: `Search for Quranic verses by keywords, topics, or questions. 
    Use this when the user asks about:
    - Quran verses or chapters
    - Islamic teachings from the Quran
    - Specific topics mentioned in the Quran
    - Meanings or explanations of verses
    
    Returns relevant verses with their references (e.g., "Quran 2:255").`,
  parameters: z.object({
    query: z.string().describe('Search keywords, topic, or question about the Quran'),
    limit: z.number().optional().default(5).describe('Maximum number of verses to return'),
  }),
  execute: async ({ query, limit = 5 }) => {
    try {
      const chapters = await getChapters({ language: 'en' });
      const searchTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((term: string) => term.length > 2);
      
      if (searchTerms.length === 0) {
        return `Please provide more specific search terms (at least 3 characters each).`;
      }

      const results: Array<{
        verse_key: string;
        text: string;
        translation: string;
        chapter_name: string;
        chapter_id: number;
      }> = [];

      // Prioritize smaller, more commonly referenced chapters and limit to 10 for performance
      // Focus on chapters 1-10, 2 (Al-Baqarah), 3 (Al-Imran), 4 (An-Nisa), 5 (Al-Maidah)
      const priorityChapters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const chaptersToSearch = chapters
        .filter((ch) => priorityChapters.includes(ch.id))
        .slice(0, 10);

      // Search chapters in parallel with a concurrency limit
      const searchPromises = chaptersToSearch.map(async (chapter) => {
        try {
          const verses = await getVersesByChapter(chapter.id, {
            translations: [131], // Sahih International
            language: 'en',
            words: false,
            tafsirs: undefined,
            audio: undefined,
            page: undefined,
            offset: undefined,
            limit: undefined,
            per_page: undefined,
          });

          const chapterResults: typeof results = [];

          for (const verse of verses) {
            if (!verse.translations || verse.translations.length === 0) continue;

            const translationText = verse.translations[0].text.toLowerCase();
            const arabicText = verse.text_simple?.toLowerCase() || '';
            const chapterName = chapter.name_simple.toLowerCase();

            // Check if any search term matches
            const matches = searchTerms.some(
              (term: string) =>
                translationText.includes(term) ||
                arabicText.includes(term) ||
                chapterName.includes(term),
            );

            if (matches) {
              chapterResults.push({
                verse_key: verse.verse_key,
                text: verse.text_simple || verse.text_uthmani || '',
                translation: verse.translations[0].text,
                chapter_name: chapter.name_simple,
                chapter_id: chapter.id,
              });

              // Early stop if we have enough results from this chapter
              if (chapterResults.length >= limit) break;
            }
          }

          return chapterResults;
        } catch (error) {
          logger.error(error, `Error searching chapter ${chapter.id}`);
          return [];
        }
      });

      // Wait for all searches to complete and collect results
      const allResults = await Promise.all(searchPromises);
      
      // Flatten and limit results
      for (const chapterResults of allResults) {
        results.push(...chapterResults);
        if (results.length >= limit) {
          results.splice(limit);
          break;
        }
      }

      if (results.length === 0) {
        return `No Quranic verses found matching "${query}". Try different keywords or be more specific.`;
      }

      // Serialize to JSON first, then convert to TOON for token optimization
      const dataToSerialize = {
        count: results.length,
        query,
        verses: results.map((r) => ({
          reference: `Quran ${r.verse_key}`,
          chapter: r.chapter_name,
          chapter_id: r.chapter_id,
          arabic: r.text,
          translation: r.translation,
        })),
      };

      const toonData = toToon(dataToSerialize);
      return `Found ${results.length} relevant verse(s) in TOON format:\n\n${toonData}`;
    } catch (error) {
      logger.error(error, 'Error in quran search tool');
      return `Error searching Quran: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
});
