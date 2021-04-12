import {MigrationInterface, QueryRunner} from "typeorm";

export class init1564422712721 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `refresh_tokens` (`id` varchar(255) NOT NULL, `createdOn` datetime NOT NULL, `modifiedOn` datetime NULL, `value` varchar(255) NOT NULL, `expirionIn` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `period_dates` (`id` varchar(255) NOT NULL, `createdOn` datetime NOT NULL, `modifiedOn` datetime NULL, `distance` varchar(255) NOT NULL, `calories` varchar(255) NOT NULL, `averageSpeed` varchar(255) NOT NULL, `calendarDateId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `calendar_dates` (`id` varchar(255) NOT NULL, `createdOn` datetime NOT NULL, `modifiedOn` datetime NULL, `date` varchar(255) NOT NULL, `distanceTotal` varchar(255) NOT NULL DEFAULT '0', `caloriesTotal` varchar(255) NOT NULL DEFAULT '0', `averageSpeedTotal` varchar(255) NOT NULL DEFAULT '0', `star` tinyint NOT NULL DEFAULT 0, `userId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `friends` (`id` varchar(255) NOT NULL, `createdOn` datetime NOT NULL, `modifiedOn` datetime NULL, `email` varchar(255) NOT NULL, `canConfirm` tinyint NOT NULL, `accepted` tinyint NOT NULL, `userId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `quests` (`id` varchar(255) NOT NULL, `createdOn` datetime NOT NULL, `modifiedOn` datetime NULL, `questDate` varchar(255) NOT NULL, `distance` varchar(255) NOT NULL, `done` tinyint NOT NULL, `userId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `challenges` (`id` varchar(255) NOT NULL, `createdOn` datetime NOT NULL, `modifiedOn` datetime NULL, `fromWho` varchar(255) NOT NULL, `challengeDate` varchar(255) NOT NULL, `distance` varchar(255) NOT NULL, `done` tinyint NOT NULL, `userId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(255) NOT NULL, `createdOn` datetime NOT NULL, `modifiedOn` datetime NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `birthDate` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `sex` int NOT NULL, `weight` varchar(255) NOT NULL, `height` varchar(255) NOT NULL, `bmi` varchar(255) NOT NULL, `treningPlan` int NOT NULL, `bmr` varchar(255) NOT NULL, `cpm` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `resetCode` varchar(255) NULL, `firstLogin` tinyint NOT NULL, `refreshTokenId` varchar(255) NULL, UNIQUE INDEX `REL_19be66e444b5c2b9af008d321a` (`refreshTokenId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `achievements` (`id` varchar(255) NOT NULL, `createdOn` datetime NOT NULL, `modifiedOn` datetime NULL, `titleEN` varchar(255) NOT NULL, `descriptionEN` varchar(255) NOT NULL, `titlePL` varchar(255) NOT NULL, `descriptionPL` varchar(255) NOT NULL, `achieved` tinyint NOT NULL, `userId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `period_dates` ADD CONSTRAINT `FK_97da8580ce23201c6b7ffe042b3` FOREIGN KEY (`calendarDateId`) REFERENCES `calendar_dates`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `calendar_dates` ADD CONSTRAINT `FK_255e62722b303f12620095689e6` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `friends` ADD CONSTRAINT `FK_0c4c4b18d8a52c580213a40c084` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `quests` ADD CONSTRAINT `FK_112b40abd7030bb790319efd265` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `challenges` ADD CONSTRAINT `FK_71457d92a08a52ceaa85edb01c4` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_19be66e444b5c2b9af008d321a0` FOREIGN KEY (`refreshTokenId`) REFERENCES `refresh_tokens`(`id`)");
        await queryRunner.query("ALTER TABLE `achievements` ADD CONSTRAINT `FK_a4c9761e826d07a1f4c51ca1d2b` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `achievements` DROP FOREIGN KEY `FK_a4c9761e826d07a1f4c51ca1d2b`");
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_19be66e444b5c2b9af008d321a0`");
        await queryRunner.query("ALTER TABLE `challenges` DROP FOREIGN KEY `FK_71457d92a08a52ceaa85edb01c4`");
        await queryRunner.query("ALTER TABLE `quests` DROP FOREIGN KEY `FK_112b40abd7030bb790319efd265`");
        await queryRunner.query("ALTER TABLE `friends` DROP FOREIGN KEY `FK_0c4c4b18d8a52c580213a40c084`");
        await queryRunner.query("ALTER TABLE `calendar_dates` DROP FOREIGN KEY `FK_255e62722b303f12620095689e6`");
        await queryRunner.query("ALTER TABLE `period_dates` DROP FOREIGN KEY `FK_97da8580ce23201c6b7ffe042b3`");
        await queryRunner.query("DROP TABLE `achievements`");
        await queryRunner.query("DROP INDEX `REL_19be66e444b5c2b9af008d321a` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `challenges`");
        await queryRunner.query("DROP TABLE `quests`");
        await queryRunner.query("DROP TABLE `friends`");
        await queryRunner.query("DROP TABLE `calendar_dates`");
        await queryRunner.query("DROP TABLE `period_dates`");
        await queryRunner.query("DROP TABLE `refresh_tokens`");
    }

}
