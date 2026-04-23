import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST', 'localhost'),
        port: Number(configService.get<string>('MYSQL_PORT', '3306')),
        username: configService.get<string>('MYSQL_USER', 'root'),
        password: configService.get<string>('MYSQL_PASSWORD', ''),
        database: configService.get<string>('MYSQL_DATABASE', 'app'),
        entities: [Product],
        synchronize: true,
      }),
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
