# 🗄️ Database — AgroDoc

Documentação das tabelas do banco de dados local (SQLite via `expo-sqlite`) e das tabelas sincronizadas com a nuvem para usuários premium.

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
Tópicos educativos da trilha (ex: "O que é o CAR"). O corpo detalhado de cada tópico fica em `content_sections` (relação 1→N).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | TEXT | Chave primária — determinística (= category, ex: `CAR`) |
| title | TEXT | Título do tópico, exibido no nó da trilha |
| category | TEXT | Documento/chave (CAF, CAR, CCIR, ITR, NFA-e) |
| hero | TEXT | Frase de destaque no topo da tela de detalhe |
| resumo | TEXT | Frase-resumo no rodapé do conteúdo |
| chapter | INTEGER | Capítulo do tópico (front exibe "Capítulo N") |
| position | INTEGER | Ordem do tópico **dentro do capítulo** |
| created_at | TEXT | Data de cadastro |
| updated_at | TEXT | Data da última atualização |

---

### `content_sections`
Seções que compõem o corpo de um tópico. Cada seção é um bloco **ícone + título + texto**.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | TEXT | Chave primária (ex: `CAR-0`) |
| content_id | TEXT | FK → educational_contents |
| icon | TEXT | Nome do ícone (Ionicons) |
| title | TEXT | Título da seção (ex: "O que é") |
| body | TEXT | Texto da seção |
| position | INTEGER | Ordem da seção dentro do tópico |
| created_at | TEXT | Data de cadastro |
| updated_at | TEXT | Data da última atualização |

> Conteúdo estático, populado pelo seed a partir de `apps/mobile/src/data/roadmapContent.ts`. Não sincroniza com a nuvem.

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
              └── content_sections (content_id)
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
| content_sections | ❌ (conteúdo fixo, igual pra todos) |

---

## 🛠️ Stack

- **Banco local:** SQLite (via `expo-sqlite`), tabelas criadas em SQL cru em `apps/mobile/src/db/index.ts`
- **Banco na nuvem:** Firebase (Firestore, apenas premium)
