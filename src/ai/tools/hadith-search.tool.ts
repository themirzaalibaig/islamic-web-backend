import { tool } from '@openai/agents';
import z from 'zod';
import { getHadithsByBook, getCollections, getBooksByCollection } from '@/features/hadith';
import { logger } from '@/utils/logger.util';
import { toToon } from '@/utils/toon.util';

export const hadithSearchTool = tool({
  name: 'search_hadiths',
  description: `Search for Hadiths (Prophet Muhammad's teachings) by keywords or topics.
    Use this when the user asks about:
    - Hadith or Sunnah
    - Prophet Muhammad's sayings or actions
    - Islamic practices and traditions
    - Specific Islamic rulings or guidance`,
  parameters: z.object({
    query: z.string().describe('Search keywords, topic, or question about Hadith'),
    limit: z.number().optional().default(5).describe('Maximum number of hadiths to return'),
  }),
  execute: async ({ query, limit = 5 }) => {
    try {
      const searchTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((term: string) => term.length > 2);
      const results: Array<{
        reference: string;
        text: string;
        collection: string;
        bookNumber: string;
        hadithNumber: string;
      }> = [];

      // Get collections
      const collections = await getCollections();

      // Search through popular collections
      const popularCollections = [
        'sahih-bukhari',
        'sahih-muslim',
        'sunan-abi-dawud',
        'sunan-at-tirmidhi',
      ];

      for (const collectionName of popularCollections) {
        try {
          const collection = collections.find((c) => c.name === collectionName);
          if (!collection) continue;

          const books = await getBooksByCollection(collectionName);

          // Search through first few books
          for (const book of books.slice(0, 3)) {
            try {
              const hadithsResponse = await getHadithsByBook(
                collectionName,
                book.bookNumber,
                1,
                50,
              );

              for (const hadith of hadithsResponse.data) {
                const hadithBody = hadith.hadith?.[0]?.body || '';
                const hadithText = hadithBody.toLowerCase();
                const matches = searchTerms.some((term: string) => hadithText.includes(term));

                if (matches) {
                  results.push({
                    reference: `${collection.name} ${book.bookNumber}:${hadith.hadithNumber}`,
                    text: hadithBody,
                    collection: collection.name,
                    bookNumber: book.bookNumber,
                    hadithNumber: hadith.hadithNumber,
                  });

                  if (results.length >= limit) break;
                }
              }

              if (results.length >= limit) break;
            } catch (error) {
              logger.error(error, `Error searching book ${book.bookNumber} in ${collectionName}`);
              continue;
            }
          }

          if (results.length >= limit) break;
        } catch (error) {
          logger.error(error, `Error searching collection ${collectionName}`);
          continue;
        }
      }

      if (results.length === 0) {
        return `No Hadiths found matching "${query}". Try different keywords or be more specific.`;
      }

      // Serialize to JSON first, then convert to TOON for token optimization
      const dataToSerialize = {
        count: results.length,
        query,
        hadiths: results.map((r) => ({
          reference: r.reference,
          collection: r.collection,
          book: r.bookNumber,
          number: r.hadithNumber,
          text: r.text.substring(0, 500), // Limit text length for token efficiency
        })),
      };

      const toonData = toToon(dataToSerialize);
      return `Found ${results.length} relevant Hadith(s) in TOON format:\n\n${toonData}`;
    } catch (error) {
      logger.error(error, 'Error in hadith search tool');
      return `Error searching Hadiths: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
});
