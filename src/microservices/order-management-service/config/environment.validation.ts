/* eslint-disable prettier/prettier */
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

//Defines what should be included in the .env.test file
class TestEnvironmentVariables {
    @IsNumber()
    OMS_DATABASE_PORT: number

    @IsNumber()
    OMS_APP_PORT: number

    @IsString()
    OMS_DATABASE_CONTAINER_NAME: string;

    @IsString()
    OMS_DATABASE_ROOT_PASSWORD: string;

    @IsString()
    OMS_DATABASE_NAME: string;

    @IsString()
    OMS_DATABASE_USER: string;

    @IsString()
    OMS_DATABASE_PASSWORD: string;

    @IsString()
    OMS_DATABASE_URL: string;

    @IsString()
    OMS_NODE_ENV: string;
}

//Defines what should be included in the .env.production file
class ProductionEnvironmentVariables{
    @IsNumber()
    OMS_DATABASE_PORT: number

    @IsNumber()
    OMS_APP_PORT: number

    @IsString()
    OMS_DATABASE_CONTAINER_NAME: string;

    @IsString()
    OMS_APP_CONTAINER_NAME: string;

    @IsNumber()
    OMS_DATABASE_CONN_RETRY_DELAY: number

    @IsString()
    OMS_DATABASE_ROOT_PASSWORD: string;

    @IsString()
    OMS_DATABASE_NAME: string;

    @IsString()
    OMS_DATABASE_USER: string;

    @IsString()
    OMS_DATABASE_PASSWORD: string;

    @IsString()
    OMS_DATABASE_URL: string;

    @IsString()
    OMS_NODE_ENV: string;

}

export function validateTestEnvFile(config: Record<string,unknown>){
    const validatedTestConfig = plainToInstance(
            TestEnvironmentVariables, 
            config, 
            {enableImplicitConversion: true},
    );

    const errors = validateSync(validatedTestConfig, {skipMissingProperties: false});

    if(errors.length > 0){
        throw new Error(errors.toString());
    }

    return validatedTestConfig;

}

export function validateProductionEnvFile(config: Record<string,unknown>){
    const validatedProductionConfig = plainToInstance(
        ProductionEnvironmentVariables, 
        config, 
        {enableImplicitConversion: true},
    );

    const errors = validateSync(validatedProductionConfig, {skipMissingProperties: false});

    if(errors.length > 0){
        throw new Error(errors.toString());
    }

    return validatedProductionConfig;

}