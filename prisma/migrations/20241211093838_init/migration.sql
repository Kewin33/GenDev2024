-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bc_game" (
    "id" SERIAL NOT NULL,
    "team_home" TEXT NOT NULL,
    "team_away" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "tournament_name" TEXT NOT NULL,

    CONSTRAINT "bc_game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bc_streaming_package" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "monthly_price_cents" INTEGER NOT NULL,
    "monthly_price_yearly_subscription_in_cents" INTEGER NOT NULL,

    CONSTRAINT "bc_streaming_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bc_streaming_offer" (
    "game_id" INTEGER NOT NULL,
    "streaming_package_id" INTEGER NOT NULL,
    "live" INTEGER NOT NULL,
    "highlights" INTEGER NOT NULL,

    CONSTRAINT "bc_streaming_offer_pkey" PRIMARY KEY ("game_id","streaming_package_id")
);

-- AddForeignKey
ALTER TABLE "bc_streaming_offer" ADD CONSTRAINT "bc_streaming_offer_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "bc_game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bc_streaming_offer" ADD CONSTRAINT "bc_streaming_offer_streaming_package_id_fkey" FOREIGN KEY ("streaming_package_id") REFERENCES "bc_streaming_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
