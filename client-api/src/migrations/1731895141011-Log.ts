import { MigrationInterface, QueryRunner } from "typeorm";

export class Log1731895141011 implements MigrationInterface {
    name = 'Log1731895141011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "route" character varying NOT NULL, "method" character varying NOT NULL, "params" json, "query" json, "body" json, "userId" character varying, "statusCode" integer NOT NULL, "response" json, "timestamp" TIMESTAMP NOT NULL, "duration" integer NOT NULL, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "logs"`);
    }

}
