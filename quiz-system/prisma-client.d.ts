declare module '@prisma/client' {
  // Simple fallback type to satisfy TypeScript while Prisma Client
  // is not yet generated or when using newer Prisma config styles.
  export class PrismaClient {
    constructor(...args: any[]);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $on(eventType: any, callback: (...args: any[]) => void): void;
    [key: string]: any;
  }
}


