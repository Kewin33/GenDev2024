-- AlterTable
ALTER TABLE "bc_streaming_package" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "bc_streaming_package_id_seq";
