import { Injectable, Logger } from '@nestjs/common';
import { map, prop } from 'rambda';
import { Prisma, Show } from '@prisma/client';
import { ShowDetailsInterface } from '../../tmdb';
import { PrismaService } from '../../prisma';

@Injectable()
export class SyncHelper {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private prismaService: PrismaService) {
    this.syncRelatedEntities = this.syncRelatedEntities.bind(this);
  }

  async findShowIds(where: Prisma.ShowWhereInput): Promise<number[]> {
    return this.findShows(where).then(map(prop('id')));
  }

  async findShowExternalIds(where: Prisma.ShowWhereInput): Promise<number[]> {
    return this.findShows(where).then(map(prop('externalId')));
  }

  async syncRelatedEntities(shows: ShowDetailsInterface[]) {
    await Promise.all([
      this.addStatuses(shows),
      this.addKeywords(shows),
      this.addGenres(shows),
      this.addProductionCompanies(shows),
    ]);
  }

  private async findShows(where: Prisma.ShowWhereInput): Promise<Show[]> {
    return this.prismaService.show.findMany({ where });
  }

  private addedKeywords = [];
  private async addKeywords(shows: ShowDetailsInterface[]) {
    const keywords = shows
      .map(prop('keywords'))
      .flat()
      .filter(({ externalId }) => !this.addedKeywords.includes(externalId));

    const { count } = await this.prismaService.keyword.createMany({
      data: keywords,
      skipDuplicates: true,
    });
    this.logger.log(`Added ${count} keywords`);

    this.addedKeywords.push(...keywords.map(prop('externalId')));
  }

  private addedStatuses = [];
  private async addStatuses(shows: ShowDetailsInterface[]) {
    const statuses = shows
      .map(prop('status'))
      .filter(({ name }) => !this.addedStatuses.includes(name));

    const { count } = await this.prismaService.status.createMany({
      data: statuses,
      skipDuplicates: true,
    });
    this.logger.log(`Added ${count} statuses`);

    this.addedKeywords.push(...statuses.map(prop('name')));
  }

  private addedGenres = [];
  private async addGenres(shows: ShowDetailsInterface[]) {
    const genres = shows
      .map(prop('genres'))
      .flat()
      .filter(({ externalId }) => !this.addedGenres.includes(externalId));

    const { count } = await this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });
    this.logger.log(`Added ${count} genres`);

    this.addedKeywords.push(...genres.map(prop('externalId')));
  }

  private addedProductionCompanies = [];
  private async addProductionCompanies(shows: ShowDetailsInterface[]) {
    const productionCompanies = shows
      .map(prop('productionCompanies'))
      .flat()
      .filter(
        ({ externalId }) => !this.addedProductionCompanies.includes(externalId),
      );

    const { count } = await this.prismaService.productionCompany.createMany({
      data: productionCompanies,
      skipDuplicates: true,
    });
    this.logger.log(`Added ${count} production companies`);

    this.addedProductionCompanies.push(
      ...productionCompanies.map(prop('externalId')),
    );
  }
}
