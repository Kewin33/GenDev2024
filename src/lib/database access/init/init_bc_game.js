import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function addGamesFromCSV(filePath) {
    const games = [];

    // Reading CSV data
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Parsing the row data and mapping to the correct Prisma model
            games.push({
                team_home: row.team_home,
                team_away: row.team_away,
                starts_at: new Date(row.starts_at), // Ensure it's parsed as a Date object
                tournament_name: row.tournament_name
            });
        })
        .on('end', async () => {
            console.log('CSV file processed, inserting data...');

            // Inserting data into the database
            let length = games.length
            let i = 0
            for (const game of games) {
                await prisma.bc_game.create({
                    data: game
                });
                i++;
                console.log('Processing: ' + Math.round(i / length * 100) + "%");
            }
            console.log('Data inserted successfully');
        });
}

await addGamesFromCSV('../../../../public/csv/bc_game.csv');
