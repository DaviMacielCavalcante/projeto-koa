import {SQLiteDatabase, openDatabaseAsync} from 'expo-sqlite'

let agricultoresDb: SQLiteDatabase | null = null;

async function initDb() {

    agricultoresDb = await openDatabaseAsync("agricultores.db")

    await agricultoresDb.execAsync(`
        "CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY, 
        name TEXT, 
        phone TEXT, 
        municipality TEXT, 
        consentimento_lgpd INTEGER, 
        onboarding_concluido INTEGER, 
        created_at TEXT, 
        updated_at TEXT)"
    `);

    await agricultoresDb.execAsync(`
        "CREATE TABLE IF NOT EXISTS properties(
        id TEXT PRIMARY KEY, 
        user_id TEXT, 
        name TEXT, 
        area_hectores DECIMAL, 
        location TEXT, 
        created_at TEXT, 
        updated_at TEXT)"
    `);

    await agricultoresDb.execAsync(`
        "CREATE TABLE IF NOT EXISTS documents(
        id TEXT PRIMARY KEY, 
        
        name TEXT, 
        phone TEXT, 
        municipality TEXT, 
        consentimento_lgpd INTEGER, 
        onboarding_concluido INTEGER, 
        created_at TEXT, 
        updated_at TEXT)"
    `);


    await agricultoresDb.execAsync(`
        "CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY, 
        name TEXT, 
        phone TEXT, 
        municipality TEXT, 
        consentimento_lgpd INTEGER, 
        onboarding_concluido INTEGER, 
        created_at TEXT, 
        updated_at TEXT)"
    `);

    await agricultoresDb.execAsync(`
        "CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY, 
        name TEXT, 
        phone TEXT, 
        municipality TEXT, 
        consentimento_lgpd INTEGER, 
        onboarding_concluido INTEGER, 
        created_at TEXT, 
        updated_at TEXT)"
    `);

    await agricultoresDb.execAsync(`
        "CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY, 
        name TEXT, 
        phone TEXT, 
        municipality TEXT, 
        consentimento_lgpd INTEGER, 
        onboarding_concluido INTEGER, 
        created_at TEXT, 
        updated_at TEXT)"
    `);

    await agricultoresDb.execAsync(`
        "CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY, 
        name TEXT, 
        phone TEXT, 
        municipality TEXT, 
        consentimento_lgpd INTEGER, 
        onboarding_concluido INTEGER, 
        created_at TEXT, 
        updated_at TEXT)"
    `);



}

export {agricultoresDb, initDb};
