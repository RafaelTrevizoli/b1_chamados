# API de Chamados de Suporte Técnico

Este projeto é uma API RESTful desenvolvida com Django e Django REST Framework, voltada para o gerenciamento de chamados de suporte técnico. Ele permite o cadastro de usuários (clientes e técnicos), categorização de chamados, inserção de comentários e envio de anexos.

---

## 🚀 Endpoints Principais

- `POST /api/token/` — Autenticação com JWT
- `POST /api/token/refresh/` — Refresh de token JWT
- `GET/POST /api/usuarios/` — Gerenciamento de usuários
- `GET/POST /api/categorias/` — Categorias de chamados
- `GET/POST /api/chamados/` — Criação e visualização de chamados
- `GET/POST /api/comentarios/` — Comentários em chamados
- `GET/POST /api/anexos/` — Upload de arquivos

---

## 🧰 Tecnologias Utilizadas

- **Backend:**
  - Python 3.12
  - Django 5.2
  - Django REST Framework
  - Simple JWT (Autenticação)
  - drf-yasg (Swagger para documentação)

- **Frontend:**
  - React
  - React Router DOM
  - Axios
  - React Toastify
  - Tailwind CSS

---

## 🛠 Como Executar

### Backend (Django)

```bash
# Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt

# Execute o servidor
python manage.py runserver
