# 🗄️ Database — AgroDoc

Documentação das tabelas do banco de dados local (SQLite via Drizzle ORM) e das tabelas sincronizadas com a nuvem para usuários premium.

---

## 📋 Tabelas

### `users`
Armazena os dados de cadastro do agricultor.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | Chave primária |
| name | VARCHAR | Nome do agricultor |
| email | VARCHAR | E-mail (único) |
| password_hash | VARCHAR | Senha criptografada |
| phone | VARCHAR | Telefone de contato |
| municipality | VARCHAR | Município (ex: Moju) |
| plan | ENUM (free/premium) | Plano do usuário |
| created_at | TIMESTAMP | Data de cadastro |
| updated_at | TIMESTAMP | Data da última atualização |

---

### `properties`
Cada agricultor pode ter uma ou mais propriedades cadastradas.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | Chave primária |
| user_id | UUID | FK → users |
| name | VARCHAR | Nome da propriedade |
| area_hectares | DECIMAL | Área em hectares |
| location | VARCHAR | Endereço ou comunidade |
| created_at | TIMESTAMP | Data de cadastro |
| updated_at | TIMESTAMP | Data da última atualização |

---

### `documents`
Documentos do agricultor (vinculados ao usuário ou à propriedade, dependendo do tipo).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | Chave primária |
| user_id | UUID | FK → users |
| property_id | UUID | FK → properties (nullable) |
| type | ENUM | Tipo do documento (ex: CAR, DAP, CRLV) |
| number | VARCHAR | Número do documento |
| issue_date | DATE | Data de emissão |
| expiration_date | DATE | Data de vencimento |
| file_url | VARCHAR | Caminho local do arquivo salvo |
| status | ENUM (active/expiring_soon/expired) | Status calculado com base na data de vencimento |
| created_at | TIMESTAMP | Data de cadastro |
| updated_at | TIMESTAMP | Data da última atualização |

---

### `buyers`
Compradores cadastrados pelo agricultor, reutilizáveis em vendas futuras.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | Chave primária |
| type | ENUM (pf/pj) | Pessoa física ou jurídica |
| name | VARCHAR | Nome do comprador |
| trading_name | VARCHAR | Razão social (apenas PJ) |
| cpf | VARCHAR | CPF (apenas PF) |
| cnpj | VARCHAR | CNPJ (apenas PJ) |
| phone | VARCHAR | Telefone |
| address | VARCHAR | Endereço |
| created_at | TIMESTAMP | Data de cadastro |
| updated_at | TIMESTAMP | Data da última atualização |

---

### `sales`
Registro de vendas realizadas pelo agricultor.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | Chave primária |
| user_id | UUID | FK → users |
| buyer_id | UUID | FK → buyers |
| product_name | VARCHAR | Nome do produto vendido |
| quantity | DECIMAL | Quantidade vendida |
| unit | VARCHAR | Unidade (kg, sacas, caixas...) |
| unit_price | DECIMAL | Valor unitário |
| total_price | DECIMAL | Valor total da venda |
| sale_date | DATE | Data da transação |
| receipt_url | VARCHAR | Caminho local do PDF do recibo |
| created_at | TIMESTAMP | Data de cadastro |
| updated_at | TIMESTAMP | Data da última atualização |

---

### `educational_contents`
Conteúdos educativos em texto, lidos pelo TTS nativo do Android.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | Chave primária |
| title | VARCHAR | Título do conteúdo |
| body | TEXT | Texto que será lido pelo TTS |
| category | VARCHAR | Categoria (ex: documentos, vendas) |
| created_at | TIMESTAMP | Data de cadastro |
| updated_at | TIMESTAMP | Data da última atualização |

---

### `user_content_progress`
Controla quais conteúdos educativos o agricultor já marcou como lido.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | Chave primária |
| user_id | UUID | FK → users |
| content_id | UUID | FK → educational_contents |
| read_at | TIMESTAMP | Data em que foi marcado como lido |
| created_at | TIMESTAMP | Data de cadastro |
| updated_at | TIMESTAMP | Data da última atualização |

---

## 🔗 Relacionamentos

```
users
  ├── properties
  │     └── documents (property_id)
  ├── documents (user_id)
  ├── sales
  │     └── buyers
  └── user_content_progress
        └── educational_contents
```

---

## ☁️ Sincronização com a Nuvem

Apenas usuários com plano **premium** sincronizam dados com a nuvem. As tabelas sincronizadas são:

| Tabela | Sincroniza |
|---|---|
| users | ✅ |
| properties | ✅ |
| documents | ✅ |
| buyers | ✅ |
| sales | ✅ |
| user_content_progress | ✅ |
| educational_contents | ❌ (conteúdo fixo, igual pra todos) |

---

## 🛠️ Stack

- **ORM:** Drizzle ORM
- **Banco local:** SQLite (via `expo-sqlite`)
- **Banco na nuvem:** Supabase ou Firebase (apenas premium)
- **Migrações:** geradas automaticamente pelo Drizzle (não versionadas no repositório)
