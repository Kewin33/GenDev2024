import fs from 'fs';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function insertStreamingPackages(filePath) {
    const packages = [];

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            const monthly_price_cents = row.monthly_price_cents ? parseInt(row.monthly_price_cents) : null;
            const monthly_price_yearly_subscription_in_cents = row.monthly_price_yearly_subscription_in_cents
                ? parseInt(row.monthly_price_yearly_subscription_in_cents)
                : null;

            packages.push({
                id: parseInt(row.id),
                name: row.name,
                monthly_price_cents,
                monthly_price_yearly_subscription_in_cents,
            });
        })
        .on('end', async () => {
            console.log('CSV file processed, inserting data...');

            // Inserting data into the database
            let length = packages.length
            let i = 0
            for (const pack of packages) {
                await prisma.bc_streaming_package.create({
                    data: pack
                });
                i++;
                console.log('Processing: ' + Math.round(i / length * 100) + "%");
            }
            console.log('Inserted streaming packages');
        });
};

await insertStreamingPackages('../../../../public/csv/bc_streaming_package.csv');
