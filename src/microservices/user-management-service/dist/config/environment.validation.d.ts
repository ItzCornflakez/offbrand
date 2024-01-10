declare class TestEnvironmentVariables {
    UMS_DATABASE_PORT: number;
    UMS_APP_PORT: number;
    UMS_DATABASE_CONTAINER_NAME: string;
    UMS_DATABASE_ROOT_PASSWORD: string;
    UMS_DATABASE_NAME: string;
    UMS_DATABASE_USER: string;
    UMS_DATABASE_PASSWORD: string;
    UMS_DATABASE_URL: string;
    UMS_NODE_ENV: string;
}
declare class ProductionEnvironmentVariables {
    UMS_DATABASE_PORT: number;
    UMS_APP_PORT: number;
    UMS_DATABASE_CONTAINER_NAME: string;
    UMS_APP_CONTAINER_NAME: string;
    UMS_DATABASE_CONN_RETRY_DELAY: number;
    UMS_DATABASE_ROOT_PASSWORD: string;
    UMS_DATABASE_NAME: string;
    UMS_DATABASE_USER: string;
    UMS_DATABASE_PASSWORD: string;
    UMS_DATABASE_URL: string;
    UMS_NODE_ENV: string;
}
export declare function validateTestEnvFile(config: Record<string, unknown>): TestEnvironmentVariables;
export declare function validateProductionEnvFile(config: Record<string, unknown>): ProductionEnvironmentVariables;
export {};
