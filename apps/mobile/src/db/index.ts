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


    // educational_contents: o esquema antigo (com `body` plano, sem hero/resumo/position)
    // é recriado. O conteúdo é estático e repovoado pelo seed, então recriar é seguro.
    const eduCols = await agricultoresDb.getAllAsync<{ name: string }>(
        `PRAGMA table_info(educational_contents)`
    );
    if (eduCols.length > 0 && !eduCols.some((c) => c.name === 'audio_id')) {
        await agricultoresDb.execAsync(`DROP TABLE IF EXISTS educational_contents`);
    }

    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS educational_contents(
        id TEXT PRIMARY KEY,
        title TEXT,
        category TEXT,
        hero TEXT,
        resumo TEXT,
        chapter INTEGER,
        position INTEGER,
        audio_id TEXT,
        created_at TEXT,
        updated_at TEXT)
    `);

    // Seções de um conteúdo (relação 1→N com educational_contents).
    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS content_sections(
        id TEXT PRIMARY KEY,
        content_id TEXT,
        icon TEXT,
        title TEXT,
        body TEXT,
        position INTEGER,
        created_at TEXT,
        updated_at TEXT)
    `);

    // Áudios narrados, referenciados por educational_contents.audio_id (FK nullable).
    // file_key é a chave do registro estático de require() (ver src/data/audioRegistry.ts).
    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS audios(
        id TEXT PRIMARY KEY,
        name TEXT,
        file_key TEXT,
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

    // Tabela antiga de rascunhos de NFA-e — substituída por notas_fiscais.
    await agricultoresDb.execAsync(`DROP TABLE IF EXISTS nfae_rascunhos`);

    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS notas_fiscais(
        id TEXT PRIMARY KEY,
        produtor_cnpj TEXT,
        produtor_endereco TEXT,
        comprador_nome TEXT,
        comprador_doc TEXT,
        descricao TEXT,
        valor TEXT,
        natureza TEXT,
        status TEXT,
        numero_nota TEXT,
        chave_acesso TEXT,
        emitida_at TEXT,
        created_at TEXT,
        updated_at TEXT)
    `);

    // Certificado Digital A1 do agricultor. Guarda no máximo um por vez.
    // A senha do .pfx não fica aqui — vai para o expo-secure-store (ver src/db/certificado.ts).
    await agricultoresDb.execAsync(`
        CREATE TABLE IF NOT EXISTS certificado_digital(
        id TEXT PRIMARY KEY,
        arquivo_nome TEXT,
        validade TEXT,
        enviado_at TEXT,
        created_at TEXT,
        updated_at TEXT)
    `);

}

export {agricultoresDb, initDb};
