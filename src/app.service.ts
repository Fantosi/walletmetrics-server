import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  unixTimestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000); // Unix 타임스탬프는 초 단위이므로 1000을 곱해 밀리초로 변환
  }

  getHello(): string {
    return "Hello World!";
  }
}
