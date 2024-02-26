import { Module } from '@nestjs/common';
import { IngredientsModule } from './ingredients/ingredients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
          port: 3307,
          username: 'root',
          password: 'B04s10aB71#',
          database: 'paninodb',
          entities: [
              __dirname + '/**/*.entity{.ts,.js}',
          ],
          synchronize: true,
    }),
    ProductModule,
    IngredientsModule,
    ClientModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
