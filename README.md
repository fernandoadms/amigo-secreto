# 🎁 Amigo Secreto - Aplicação Web

Aplicação React moderna para organização de amigo secreto com sugestões de IA, impedimentos personalizados e interface totalmente acessível.

## ✨ Funcionalidades

- 🎯 **Sorteio Inteligente**: Algoritmo que respeita regras de impedimento
- 🤖 **Sugestões com IA**: Gemini AI sugere presentes baseado em preferências
- 🔐 **Privacidade Garantida**: Firebase Authentication anônima
- ♿ **100% Acessível**: WCAG 2.1 AA compliant
- 📱 **Responsivo**: Mobile-first design com Tailwind CSS
- 🎨 **UI Moderna**: Componentes baseados em Shadcn UI e Radix Primitives

## 🚀 Começando

### Pré-requisitos

- Node.js 20.19+ ou 22.12+
- npm ou yarn

### Instalação

1. Clone o repositório
```bash
git clone <seu-repositorio>
cd amigo-secreto
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=sua_chave_firebase_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id

# Gemini API Configuration
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
```

**⚠️ IMPORTANTE**: Nunca commite o arquivo `.env.local` no Git. Ele já está incluído no `.gitignore`.

### Como obter as credenciais

#### Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **Project Settings** > **General**
4. Em "Your apps", clique em **Web** (</>) para criar um app web
5. Copie as configurações do `firebaseConfig`

#### Gemini API
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Clique em "Get API Key"
3. Crie uma nova chave ou use uma existente
4. Copie a chave gerada

### Executar em desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:5173

### Build para produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

## ♿ Acessibilidade

Esta aplicação foi desenvolvida seguindo as diretrizes WCAG 2.1 Level AA:

- ✅ Navegação completa por teclado
- ✅ Focus trap em modais
- ✅ ARIA labels e roles adequados
- ✅ Contraste mínimo 4.5:1 (textos)
- ✅ Hierarquia semântica de headings
- ✅ Suporte a `prefers-reduced-motion`
- ✅ Labels em todos os campos de formulário
- ✅ Feedback de loading em ações assíncronas

## 🛠️ Tecnologias

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Utility-first CSS
- **Firebase** - Authentication e Firestore
- **Gemini API** - Sugestões de presentes com IA
- **React Focus Lock** - Gerenciamento de foco em modais
- **Lucide React** - Ícones modernos

## 📁 Estrutura do Projeto

```
amigo-secreto/
├── src/
│   ├── App.tsx          # Componente principal com toda lógica
│   ├── main.tsx         # Entry point
│   ├── index.css        # Estilos globais + a11y
│   └── assets/          # Imagens e recursos
├── public/              # Arquivos estáticos
├── .env.example         # Template de variáveis de ambiente
├── .env.local           # Suas credenciais (não commitado)
└── ...config files
```

## 🔒 Segurança

- ✅ Credenciais em variáveis de ambiente
- ✅ `.env.local` no `.gitignore`
- ✅ Authentication anônima do Firebase
- ✅ Regras de segurança do Firestore configuradas

## 📝 Licença

MIT

---

Desenvolvido com ❤️ e foco em acessibilidade
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
