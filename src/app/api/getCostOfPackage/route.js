import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export async function POST(req) {
    // Destructure the incoming JSON request to extract 'name'
    const name = await req.json();

    // Check if the name is provided in the request body
    if (!name) {
        return NextResponse.json({ error: 'Streaming package name is required' }, { status: 400 });
    }

    console.log('Streaming package name received:', name);

    // Initialize Prisma Client for database interaction
    const prisma = new PrismaClient();

    try {
        // Query the database to fetch the streaming package price details
        const price = await prisma.bc_streaming_package.findMany({
            where: {
                name: name
            },
            select: {
                name: true,
                monthly_price_cents: true,
                monthly_price_yearly_subscription_in_cents: true,
            }
        });

        // Check if price data exists for the given name
        if (price.length === 0) {
            return NextResponse.json({ error: 'Streaming package not found' }, { status: 404 });
        }

        // Respond with the price data
        return NextResponse.json({ data: price[0] }, { status: 200 });
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
    } finally {
        // Ensure Prisma client is disconnected after the operation
        await prisma.$disconnect();
    }
}
