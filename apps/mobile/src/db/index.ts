import {SQLiteDatabase, openDatabaseAsync} from 'expo-sqlite'

let agricultoresDb: SQLiteDatabase | null = null;

async function initDb() {

    agricultoresDb = await openDatabaseAsync("agricultores.db")

    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY, 
        name TEXT, 
        phone TEXT UNIQUE, 
        municipality TEXT, 
        consentimento_lgpd INTEGER, 
        onboarding_concluido INTEGER, 
        created_at TEXT, 
        updated_at TEXT)
    `);

    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS properties(
        id TEXT PRIMARY KEY, 
        user_id TEXT, 
        name TEXT, 
        area_hectares DECIMAL, 
        location TEXT, 
        created_at TEXT, 
        updated_at TEXT)
    `);

    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS documents(
        id TEXT PRIMARY KEY, 
        user_id TEXT,
        property_id TEXT,
        type TEXT,
        number INTEGER, 
        issue_date TEXT, 
        expiration_date TEXT, 
        file_url TEXT,
        storage_url TEXT,
        status TEXT,
        sincronizado INTEGER,
        created_at TEXT, 
        updated_at TEXT)
    `);


    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS educational_contents(
        id TEXT PRIMARY KEY, 
        title TEXT, 
        body TEXT, 
        category TEXT,  
        created_at TEXT, 
        updated_at TEXT)
    `);

    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS user_content_progress(
        id TEXT PRIMARY KEY, 
        user_id TEXT, 
        content_id TEXT, 
        read_at TEXT, 
        created_at TEXT, 
        updated_at TEXT)
    `);

    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS sync_queue(
        id TEXT PRIMARY KEY,
        tabela TEXT,
        operacao TEXT,
        payload TEXT,
        created_at TEXT)
    `);

    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS nfae_rascunhos(
        id TEXT PRIMARY KEY,
        produtor_cnpj TEXT,
        produtor_endereco TEXT,
        comprador_nome TEXT,
        comprador_doc TEXT,
        descricao TEXT,
        valor TEXT,
        natureza TEXT,
        created_at TEXT,
        updated_at TEXT)
    `);

}

export {agricultoresDb, initDb};
