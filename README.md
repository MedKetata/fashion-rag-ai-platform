# 👗 Fashion RAG AI

> An end-to-end AI-powered fashion assistant built with **RAG**, **semantic search**, **vector databases**, **local LLM inference**, and **observability with Phoenix**.

<p align="center">
  <img src="screenshots/landing_page_01.png" alt="Fashion RAG AI Landing Page" width="900">
</p>

---

## 📌 Overview

**Fashion RAG AI** is a full-stack intelligent fashion assistant that supports both:

- **FAQ queries** such as return policy, shipping, payment, and support
- **Product queries** such as clothing search, style suggestions, color preferences, and fashion recommendations

The project combines:

- **React + TypeScript + Tailwind CSS** frontends
- **FastAPI** backend
- **MySQL** for authentication
- **MongoDB** for chat history
- **Weaviate** for vector search
- **Ollama** for local LLM inference
- **Phoenix** for observability and tracing

---

## ✨ Features

- 🔐 User authentication and role-based access
- 🤖 FAQ vs Product query routing
- 🧠 RAG-based product retrieval
- 🏷️ Metadata filtering from natural language queries
- 🛍️ Product recommendation generation
- 🖼️ Product image extraction from generated answers
- 📜 Chat history persistence
- ⚙️ Ollama model management
- 💰 Manual model cost configuration
- 📊 Phoenix observability and tracing
- 🐳 Dockerized multi-service architecture

---

## 🧰 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router

### Backend
- FastAPI
- Python
- Pydantic
- SQLAlchemy

### Databases
- MySQL
- MongoDB
- Weaviate

### AI / RAG / LLM
- Ollama
- Phoenix
- OpenTelemetry
- Semantic search
- Metadata-based retrieval

### DevOps
- Docker
- Docker Compose

---

## 🏗️ Architecture

### Global Application Architecture

<p align="center">
  <img src="screenshots/Global_Application_Architecture.png" alt="Global Application Architecture" width="900">
</p>

### RAG Pipeline Architecture

<p align="center">
  <img src="screenshots/RAG_Pipeline_Architecture.png" alt="RAG Pipeline Architecture" width="900">
</p>

## 📂 Project Structure

```bash

RAG_Ecommerce/
│
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── core/
│   │   ├── data/
│   │   ├── llm/
│   │   ├── metadata/
│   │   ├── observability/
│   │   ├── pipelines/
│   │   ├── retrieval/
│   │   ├── routing/
│   │   ├── services/
│   │   └── vector_db/
│   ├── .env
│   └── main.py
│
├── frontend-user/
├── frontend-admin/
│
├── docker/
│   └── ollama/
│       ├── Dockerfile
│       └── start.sh
│
├── nginx/
│   └── nginx.conf
│
├── docker-compose.yml
├── .env
├── screenshots/
└── README.md

## 🧠 Backend Logic

### 1. Query Routing
The system first classifies the user query into one of these categories:

- **FAQ**
- **Product**

If the query is product-related, it also classifies the task as:

- **creative**
- **technical**

### 2. FAQ Pipeline
- Retrieve relevant FAQ entries from Weaviate
- Build FAQ context
- Generate a grounded answer using the selected Ollama model

### 3. Product Pipeline
- Generate metadata filters from the query
- Retrieve relevant products from Weaviate
- Apply refiltering if needed
- Build product context
- Generate final answer
- Extract product IDs and image URLs from the answer

---

## 🖥️ User Interface

### Landing Page
<p align="center">
  <img src="screenshots/landing_page_01.png" alt="Landing Page 1" width="800">
</p>

<p align="center">
  <img src="screenshots/landing_page_02.png" alt="Landing Page 2" width="800">
</p>

<p align="center">
  <img src="screenshots/landing_page_03.png" alt="Landing Page 3" width="800">
</p>

<p align="center">
  <img src="screenshots/landing_page_04.png" alt="Landing Page 4" width="800">
</p>

<p align="center">
  <img src="screenshots/landing_page_05.png" alt="Landing Page 5" width="800">
</p>

### Authentication
<p align="center">
  <img src="screenshots/login_user.png" alt="User Login" width="700">
</p>

<p align="center">
  <img src="screenshots/register_user.png" alt="User Register" width="700">
</p>

<p align="center">
  <img src="screenshots/login_admin.png" alt="Admin Login" width="700">
</p>

### User Pages
<p align="center">
  <img src="screenshots/home_page_user.png" alt="Home Page User" width="850">
</p>

<p align="center">
  <img src="screenshots/contact_page_user_01.png" alt="Contact Page User 1" width="850">
</p>

<p align="center">
  <img src="screenshots/contact_page_user_02.png" alt="Contact Page User 2" width="850">
</p>

<p align="center">
  <img src="screenshots/news_page_user_01.png" alt="News Page User 1" width="850">
</p>

<p align="center">
  <img src="screenshots/news_page_user_02.png" alt="News Page User 2" width="850">
</p>

---

## 💬 Query Examples

### FAQ Query
<p align="center">
  <img src="screenshots/user_faq_question.png" alt="User FAQ Question" width="850">
</p>

<p align="center">
  <img src="screenshots/FAQ_Response.png" alt="FAQ Response" width="850">
</p>

### Product Query
<p align="center">
  <img src="screenshots/user_product_request.png" alt="User Product Request" width="850">
</p>

<p align="center">
  <img src="screenshots/product_query_response.png" alt="Product Query Response" width="850">
</p>

---

## 🛠️ Admin Interface

### Admin Dashboard
<p align="center">
  <img src="screenshots/admin_dashboard.png" alt="Admin Dashboard" width="850">
</p>

### Model Management
<p align="center">
  <img src="screenshots/Manage_Models.png" alt="Manage Models" width="850">
</p>

<p align="center">
  <img src="screenshots/search_model.png" alt="Search Model" width="850">
</p>

<p align="center">
  <img src="screenshots/show_model_llama_details.png" alt="Show Model Llama Details" width="850">
</p>

<p align="center">
  <img src="screenshots/show_model_gemma3_details.png" alt="Show Model Gemma3 Details" width="850">
</p>

<p align="center">
  <img src="screenshots/switch_to_other_model.png" alt="Switch To Other Model" width="850">
</p>

### Cost Management
<p align="center">
  <img src="screenshots/Manage_Model_Costs.png" alt="Manage Model Costs" width="850">
</p>

### Monitoring
<p align="center">
  <img src="screenshots/monitoring_page.png" alt="Monitoring Page" width="850">
</p>

<p align="center">
  <img src="screenshots/open_phoenix_page.png" alt="Open Phoenix Page" width="850">
</p>

---

## 📊 Phoenix Observability

<p align="center">
  <img src="screenshots/project_phoenix_created.png" alt="Project Phoenix Created" width="850">
</p>

<p align="center">
  <img src="screenshots/phoenix_faq_traces.png" alt="Phoenix FAQ Traces" width="850">
</p>

<p align="center">
  <img src="screenshots/phoenix_traces_dashboard.png" alt="Phoenix Traces Dashboard" width="850">
</p>

<p align="center">
  <img src="screenshots/phoenix_product_traces.png" alt="Phoenix Product Traces" width="850">
</p>

---

## 🤖 Supported Ollama Models

Examples of models used in this project:

- `llama3.1:8b`
- `mistral-nemo:latest`
- `gemma3:12b`

The backend supports:
- model listing
- model selection
- model detail inspection
- cost configuration for Phoenix

---

## 👨‍💻 Author

**Mohamed Abdelkader Ketata**

- Email: `med.abdelkader.ketata@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/mohamed-abdelkader-ketata-4955a42b8`
- GitHub: `https://github.com/MedKetata`