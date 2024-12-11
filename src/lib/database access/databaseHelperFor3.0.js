import {PrismaClient} from "@prisma/client";
let prisma = new PrismaClient();
console.time("prisma");
let teamName = "Schweiz"
const gamesWithTeam = await prisma.bc_game.findMany({
    where: {
        OR: [
            {team_home : teamName},
            {team_away : teamName}
        ]
    },
    select: {
        id: true, // game.id
    }
});

const gameIds = gamesWithTeam.map(game => game.id);

const result = await prisma.bc_streaming_package.findMany({
    select: {
        id: true, // streaming_package_id
        monthly_price_cents: true,
        monthly_price_yearly_subscription_in_cents: true,
        bc_streaming_offer: {
            where: {
                game_id: { in: gameIds } // Filtern nach den `game_id`-Werten
            },
            select: {
                game: {
                    select: {
                        id: true
                    }
                }
            }
        }
    }
});

// Formatiere die Ergebnisse
const formattedResult = result.map(s => ({
    streaming_package_id: s.id,
    monthly_price_cents: s.monthly_price_cents,
    monthly_price_yearly_subscription_in_cents: s.monthly_price_yearly_subscription_in_cents,
    games: s.bc_streaming_offer.map(offer => offer.game.id) // Array von game.id
}));
console.log(formattedResult.filter(f=> f.games.length !== 0));

console.timeEnd("prisma");

