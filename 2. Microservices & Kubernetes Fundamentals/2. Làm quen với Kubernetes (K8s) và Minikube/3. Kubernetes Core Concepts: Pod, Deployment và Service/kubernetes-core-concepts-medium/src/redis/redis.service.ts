import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";


@Injectable()
export class RedisService implements OnModuleDestroy {
   
  private readonly client : Redis;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<string>('REDIS_PORT', '6379'));

    this.client = new Redis({
      host,
      port,
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    });
  }

  async get(key:string): Promise<string | null> {
    return this.client.get(key);
  }


  async set(key: string , value: string , ttlSeconds?: number): Promise<void> {
    if( ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key , value , 'EX' , ttlSeconds );
      return;
    }

    await this.client.set(key , value);
  }


  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}


// import { Injectable, OnModuleDestroy } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Redis from 'ioredis';

// @Injectable()
// export class RedisService implements OnModuleDestroy {
//   // Khai báo client Redis ở dạng private để chỉ sử dụng bên trong Service này
//   private readonly client: Redis;

//   constructor(private readonly configService: ConfigService) {
//     // Lấy cấu hình từ biến môi trường thông qua ConfigService, có fallback giá trị mặc định
//     const host = this.configService.get<string>('REDIS_HOST', 'localhost');
//     const port = Number(this.configService.get<string>('REDIS_PORT', '6379'));

//     // Khởi tạo instance của Redis
//     this.client = new Redis({
//       host,
//       port,
//       maxRetriesPerRequest: 3, // Thử lại tối đa 3 lần nếu request lỗi trước khi báo fail
//       lazyConnect: false,      // Kết nối ngay lập tức khi ứng dụng khởi chạy
//     });
//   }

//   /**
//    * Lấy giá trị từ Redis dựa trên key
//    * @param key Tên khóa cần lấy
//    * @returns Chuỗi giá trị hoặc null nếu không tồn tại
//    */
//   async get(key: string): Promise<string | null> {
//     return this.client.get(key);
//   }

//   /**
//    * Lưu giá trị vào Redis kèm theo thời gian sống (TTL) tùy chọn
//    * @param key Tên khóa cần lưu
//    * @param value Giá trị cần lưu (dạng string)
//    * @param ttlSeconds Thời gian hết hạn tính bằng giây
//    */
//   async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
//     // Nếu có truyền TTL và lớn hơn 0, sử dụng option 'EX' (Expired)
//     if (ttlSeconds && ttlSeconds > 0) {
//       await this.client.set(key, value, 'EX', ttlSeconds);
//       return;
//     }
//     // Ngược lại lưu vĩnh viễn (cho đến khi đầy bộ nhớ hoặc bị xóa thủ công)
//     await this.client.set(key, value);
//   }

//   /**
//    * Xóa một hoặc nhiều khóa khỏi Redis
//    * @param key Tên khóa cần xóa
//    * @returns Số lượng khóa đã bị xóa thực tế
//    */
//   async del(key: string): Promise<number> {
//     return this.client.del(key);
//   }

//   /**
//    * Lifecycle Hook của NestJS: Gọi khi module bị hủy (ví dụ khi tắt server)
//    * Giúp đóng kết nối Redis an toàn (Graceful Shutdown)
//    */
//   async onModuleDestroy() {
//     await this.client.quit();
//   }
// }

