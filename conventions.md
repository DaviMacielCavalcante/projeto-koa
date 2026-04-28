# 📌 Contribuição e Padrões do Projeto

Este documento define regras simples para manter o projeto organizado e fácil de manter.

---

## 🌿 Branching

### Modelo padrão (recomendado)

- `main` → versão estável / produção
- `feature/*` → novas funcionalidades
- `fix/*` → correção de bugs

### Modelo opcional (mais seguro)

Para equipes que quiserem mais controle:

- `develop` → branch de integração
- `story/*` → desenvolvimento de features mais estruturadas

> Use apenas se realmente fizer sentido. Simplicidade é prioridade.

---

## ✍️ Commits

Seguimos um padrão inspirado em Conventional Commits:

**Formato:**

```
tipo: descrição curta no infinitivo
```

**Exemplos:**

```
feat: adicionar autenticação com Google
fix: corrigir erro ao salvar usuário
docs: atualizar README
refactor: simplificar lógica de validação
chore: ajustar configuração do projeto
```

### Tipos mais comuns

- `feat` → nova funcionalidade
- `fix` → correção de bug
- `docs` → documentação
- `refactor` → melhoria de código sem mudança de comportamento
- `chore` → tarefas internas / manutenção

---

## 👀 Code Review

### Regras

- Todo código deve passar por Pull Request (PR)
- Mínimo de **1 aprovação**
- Não aprovar o próprio PR

### Boas práticas

- PRs pequenos (idealmente até ~300 linhas)
- Descrição clara do que foi feito
- Explicar decisões importantes, se necessário

---

## ⚖️ Princípio geral

> Preferimos simplicidade e consistência ao invés de processos complexos.

Se alguma regra estiver atrapalhando mais do que ajudando, ela pode (e deve) ser ajustada.
