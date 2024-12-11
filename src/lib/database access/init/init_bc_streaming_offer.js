import fs from 'fs';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function insertStreamingOffers(filePath) {    const offers = [];

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            offers.push({
                game_id: parseInt(row.game_id),
                streaming_package_id: parseInt(row.streaming_package_id),
                live: parseInt(row.live),
                highlights: parseInt(row.highlights),
            });
        })
        .on('end', async () => {
            console.log('CSV file processed, inserting data...');

            // Inserting data into the database
            let length = offers.length
            let i = 0
            for (const offer of offers) {
                await prisma.bc_streaming_offer.create({
                    data: offer
                });
                i++;
                console.log('Processing: ' + Math.round(i / length * 100) + "%");
            }
            console.log('Inserted streaming offers');
        });
};

await insertStreamingOffers('../../../../public/csv/bc_streaming_offer.csv');
