import {NextResponse} from "next/server";
import {PrismaClient} from '@prisma/client'
export async function POST(req){
    let name = await req.json();
    //console.log(streamingPackageName);
    console.log(name);
    //name = name.service
    //console.log(name);
    let prisma = new PrismaClient()
    const price = await prisma.bc_streaming_package.findMany({
        where:{
            name: name
        },
        select: {
            name: true,
            monthly_price_cents:true,
            monthly_price_yearly_subscription_in_cents: true,
        }
    });
    console.log(price);
    return NextResponse.json({data:price[0]}, { status: 200 })
}