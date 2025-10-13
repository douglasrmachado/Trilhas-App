export declare const config: {
    server: {
        port: string | number;
        host: string;
        nodeEnv: string;
    };
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        connectionLimit: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    admin: {
        email: string;
        password: string;
        name: string;
        registry: string;
    };
    cors: {
        origin: string;
        credentials: boolean;
    };
};
export declare function validateConfig(): void;
//# sourceMappingURL=index.d.ts.map