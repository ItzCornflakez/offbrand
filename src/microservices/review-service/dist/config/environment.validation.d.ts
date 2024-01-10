declare class TestEnvironmentVariables {
    DATABASE_PORT: number;
    APP_PORT: number;
    DATABASE_CONTAINER_NAME: string;
    DATABASE_ROOT_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_URL: string;
    NODE_ENV: string;
}
declare class ProductionEnvironmentVariables {
    DATABASE_PORT: number;
    APP_PORT: number;
    DATABASE_CONTAINER_NAME: string;
    APP_CONTAINER_NAME: string;
    DATABASE_CONN_RETRY_DELAY: number;
    DATABASE_ROOT_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_URL: string;
    NODE_ENV: string;
}
export declare function validateTestEnvFile(config: Record<string, unknown>): TestEnvironmentVariables;
export declare function validateProductionEnvFile(config: Record<string, unknown>): ProductionEnvironmentVariables;
export {};
