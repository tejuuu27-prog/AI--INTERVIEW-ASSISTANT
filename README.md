# 🤖 AI Interview Assistant

An AI-powered interview preparation platform that helps users analyze their resumes, generate interview questions, practice mock interviews, and receive AI-powered performance feedback.

The application is built using **React, Spring Boot, MySQL, and Ollama**. Ollama runs the AI model locally, so the application can perform AI processing without depending on an external AI API.

---

## 📌 Project Overview

The AI Interview Assistant provides an end-to-end interview preparation workflow:

1. User creates an account.
2. User logs in.
3. User uploads a PDF resume.
4. The resume is stored in MySQL.
5. Resume text is extracted from the PDF.
6. The extracted resume information is analyzed using local AI through Ollama.
7. Personalized interview questions are generated.
8. The user completes a mock interview.
9. AI evaluates the interview answers.
10. The application displays feedback and the final performance result.

### Main Flow

```text
User
 │
 ▼
React Frontend
 │
 │ HTTP Requests
 ▼
Spring Boot Backend
 │
 ├──────────────► MySQL
 │                 │
 │                 └── Users / Resumes / Interview Data
 │
 └──────────────► Ollama
                    │
                    └── Local AI Model
                    🚀 Features
1. 👤 User Registration

Users can create an account by providing:

Name
Email
Password

Passwords are encrypted using BCrypt before being stored.

2. 🔐 User Login

Registered users can log in using their email and password.

The application validates the login information before allowing access to the dashboard.

Empty login fields are rejected.

3. 📄 Resume Upload

Users can upload their resume as a PDF file.

The application:

PDF Resume
    ↓
React Frontend
    ↓
Spring Boot API
    ↓
PDF Text Extraction
    ↓
Resume Text
    ↓
MySQL

Resume metadata and extracted text are stored in the database.

4. 🧠 AI Resume Analysis

The system analyzes the uploaded resume using Ollama.

The analysis can identify information such as:

Skills
Strengths
Weaknesses
Experience
Education
Suggestions
Interview focus areas

The frontend sends the analysis request to Spring Boot.

React does NOT directly communicate with Ollama.

React
  ↓
Spring Boot
  ↓
ResumeAnalysisService
  ↓
Ollama
  ↓
AI Response
  ↓
Spring Boot
  ↓
React
5. ❓ AI Interview Questions

Interview questions are generated based on the candidate's resume and technical background.

The questions can cover areas such as:

Java
Spring Boot
React
SQL
Database concepts
REST APIs
System design
Projects
Resume-specific experience
6. 🎤 Mock Interview

The mock interview allows users to answer AI-generated interview questions.

The application maintains the interview flow and collects the candidate's answers for evaluation.

7. 📊 AI Feedback

After the interview, the answers are analyzed using the local AI model.

The system provides feedback about:

Answer quality
Technical knowledge
Communication
Strengths
Weaknesses
Areas for improvement

A final performance result is also displayed.

🛠 Technology Stack
Frontend
React
JavaScript
Vite
CSS
Backend
Java 21
Spring Boot
Spring Data JPA
Maven
REST APIs
BCrypt
Database
MySQL
AI
Ollama
Local Llama model 3.2
Development Tools
Visual Studio Code
MySQL Workbench
Postman
Git
GitHub
📂 Project Structure
AI-INTERVIEW-ASSISTANT/
│
├── backend/
│   │
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── aiinterview/
│   │       │           └── backend/
│   │       │               ├── controller/
│   │       │               ├── entity/
│   │       │               ├── repository/
│   │       │               └── service/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
├── frontend/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── assets/
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── database scripts
│
├── docs/
│   └── project documentation
│
├── screenshots/
│   └── application screenshots
│
├── .gitignore
└── README.md
🏗 System Architecture

The application follows a three-layer architecture.

                    ┌──────────────────────┐
                    │      React UI        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot       │
                    │      Backend         │
                    └───────┬───────┬──────┘
                            │       │
                    JPA     │       │ HTTP
                            ▼       ▼
                    ┌──────────┐  ┌──────────┐
                    │  MySQL   │  │  Ollama  │
                    │ Database │  │ Local AI │
                    └──────────┘  └──────────┘
🔄 Complete Application Workflow
Step 1 — Registration
User enters registration information
        ↓
React
        ↓
Spring Boot
        ↓
BCrypt password encryption
        ↓
MySQL users table
Step 2 — Login
User enters email + password
        ↓
React
        ↓
Spring Boot
        ↓
Find user in MySQL
        ↓
Compare password using BCrypt
        ↓
Login successful
        ↓
Dashboard
Step 3 — Resume Upload
User selects PDF
        ↓
React
        ↓
Spring Boot
        ↓
PDF processing
        ↓
Text extraction
        ↓
Resume entity
        ↓
MySQL
Step 4 — Resume Analysis

The frontend calls:

GET /api/resume/analyze/latest

The backend:

Finds the latest resume.
Retrieves the extracted resume text.
Builds an AI prompt.
Sends the prompt to Ollama.
Receives the AI response.
Processes the response.
Returns the result to React.
🤖 Ollama Local AI

Ollama is used to run the AI model locally.

This means the application architecture is:

React
  ↓
Spring Boot
  ↓
Ollama
  ↓
Local LLM

React should not directly call Ollama.

Spring Boot acts as the backend layer between the frontend and the local AI model.

🧠 Ollama Model

The project uses a local Llama model.

Example:

ollama list

To download the model:

ollama pull llama3.2

To test the model:

ollama run llama3.2

To start the Ollama server:

ollama serve

Ollama normally exposes its local service on:

http://localhost:11434
📝 AI Prompt Architecture

The application sends structured prompts from Spring Boot to Ollama.

The general structure is:

SYSTEM ROLE


You are an AI interview assistant.


TASK


Analyze the candidate information provided below.


CANDIDATE DATA


[Resume text]


REQUIREMENTS


Identify:
- Skills
- Strengths
- Weaknesses
- Experience
- Education
- Suggestions
- Interview focus areas


Return a clear and structured response.

The important concept is that the resume text is inserted into the prompt dynamically.

For example:

Resume text
     ↓
Spring Boot
     ↓
Prompt construction
     ↓
Ollama
     ↓
AI response
🎯 Interview Question Prompt

The question-generation prompt follows the same architecture.

You are an AI technical interviewer.


Based on the candidate's resume, generate interview questions
that match the candidate's skills and experience.


Focus on:
- Technical skills
- Projects
- Experience
- Resume-specific technologies
- Practical knowledge


Generate concise interview questions.

The resume information is dynamically added before sending the prompt to Ollama.

🎤 Mock Interview

The mock interview uses the generated questions.

Resume
  ↓
AI Question Generation
  ↓
Interview Questions
  ↓
Candidate Answers
  ↓
AI Evaluation
  ↓
Feedback
  ↓
Final Result
📊 Feedback Generation

The AI evaluates the candidate's answers.

The evaluation considers factors such as:

Technical accuracy
Communication
Completeness
Relevance
Confidence
Areas for improvement

A feedback request can be structured conceptually as:

You are an AI interview evaluator.


Evaluate the candidate's interview answers.


For each answer consider:
- Technical correctness
- Relevance
- Clarity
- Completeness


Provide:
- Strengths
- Weaknesses
- Suggestions
- Overall performance
🗄 Database

The application uses MySQL.

Database:

ai_interview_db

Main tables include:

users
resumes

The resume table stores information such as:

id
file_name
uploaded_by
resume_text

The extracted resume text is stored in:

resume_text

This allows the AI service to retrieve the resume text later without extracting the PDF again.

📄 Resume Processing

The resume-processing flow is:

PDF
 ↓
Spring Boot
 ↓
PDF Text Extraction
 ↓
Extracted Text
 ↓
Resume Entity
 ↓
MySQL

For example:

resume.setResumeText(extractedText);

This stores the extracted text in the resume entity before saving it to the database.

🔌 Backend API

The backend exposes REST APIs for communication with the React frontend.

The resume analysis endpoint used by the frontend is:

GET /api/resume/analyze/latest

The frontend calls it using:

const response = await fetch(
  "http://localhost:8080/api/resume/analyze/latest"
);

The complete API list should be maintained according to the controllers currently present in the backend.

🖥 Frontend Pages

The React application contains the following major pages:

Home
 │
 ├── Login
 ├── Register
 ├── Features
 ├── How It Works
 │
 └── Dashboard
       │
       ├── Resume Upload
       ├── Resume Analysis
       ├── Mock Interview
       └── Feedback
🔐 Authentication Flow

The application currently provides basic registration and login functionality.

Register
   ↓
User information
   ↓
Password encrypted using BCrypt
   ↓
MySQL


Login
   ↓
Email + Password
   ↓
Backend validation
   ↓
Dashboard

The project does not currently depend on an external authentication provider.

▶️ How to Run the Project

Three major services are required.

1. Start MySQL

Start your MySQL server and make sure the database exists.

Example:

CREATE DATABASE ai_interview_db;

Configure the database connection in:

backend/src/main/resources/application.properties
2. Start Ollama

Open a terminal:

ollama serve

Check installed models:

ollama list

If necessary:

ollama pull llama3.2
3. Start Spring Boot

Open a second terminal.

Navigate to:

cd backend

Run:

mvn spring-boot:run

The backend runs on:

http://localhost:8080
4. Start React

Open a third terminal.

Navigate to:

cd frontend

Install dependencies if required:

npm install

Start the frontend:

npm run dev

Vite normally provides:

http://localhost:5173
🧪 Development Setup

The complete development environment is:

Terminal 1
──────────
ollama serve


Terminal 2
──────────
cd backend
mvn spring-boot:run


Terminal 3
──────────
cd frontend
npm run dev

Then open the React application in the browser.

🔍 Troubleshooting
Ollama is not responding

Check:

ollama list

Then start:

ollama serve

Make sure the required model exists.

Ollama model is missing

Run:

ollama pull llama3.2

Then test:

ollama run llama3.2
Spring Boot cannot connect to MySQL

Check:

application.properties

Verify:

MySQL is running
Database name is correct
Username is correct
Password is correct
MySQL port is correct
Resume analysis fails

Check the following:

Spring Boot is running.
Ollama is running.
The required model is installed.
A resume exists in the database.
resume_text contains extracted text.
The Ollama model can respond independently.

You can verify the resume text using:

SELECT id, file_name, LENGTH(resume_text)
FROM resumes
ORDER BY id DESC
LIMIT 1;
Port 11434 already in use

If Ollama reports:

bind: Only one usage of each socket address

it usually means an Ollama server is already running.

You generally do not need to start another ollama serve process.

🔒 GitHub Safety

The project should not commit:

node_modules/
target/
uploads/
.env
*.log

Uploaded resumes and local configuration files should remain outside the Git repository.

📸 Screenshots

Application screenshots are stored in:

screenshots/

Recommended screenshots include:

Home page
Registration
Login
Dashboard
Resume upload
Resume analysis
Interview questions
Mock interview
AI feedback
Final result
MySQL database
Ollama running
Backend running
📈 Project Development Flow

The project was developed progressively:

1. Project Setup
       ↓
2. Spring Boot Backend
       ↓
3. MySQL Database
       ↓
4. User Registration
       ↓
5. Login
       ↓
6. React Frontend
       ↓
7. Resume Upload
       ↓
8. PDF Text Extraction
       ↓
9. Resume Storage
       ↓
10. Ollama Integration
       ↓
11. Resume Analysis
       ↓
12. AI Interview Questions
       ↓
13. Mock Interview
       ↓
14. AI Feedback
       ↓
15. Final Result
       ↓
16. GitHub Documentation
🌐 Data Flow Summary

The complete application flow is:

                    USER
                      │
                      ▼
              ┌──────────────┐
              │ React / Vite │
              └──────┬───────┘
                     │
                     │ REST API
                     ▼
              ┌──────────────┐
              │ Spring Boot  │
              └──────┬───────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
     ┌─────────┐          ┌──────────┐
     │  MySQL  │          │  Ollama  │
     │         │          │ Local AI │
     └─────────┘          └──────────┘
          │                     │
          │                     │
          └──────────┬──────────┘
                     ▼
               AI RESULT
                     │
                     ▼
              React Dashboard
💡 Why Ollama?

Ollama allows the project to run AI models locally.

Advantages include:

No external AI API dependency
Local processing
No API key required
Useful for development and demonstrations
Full control over the model used
Easy integration with Spring Boot through HTTP

A limitation is that local AI inference can be slower depending on the computer's CPU/GPU and available memory.

🚧 Future Improvements

Possible future improvements include:

JWT-based authentication
Role-based access
Better AI response parsing
More advanced resume scoring
Multiple AI models
Interview difficulty selection
Voice-based mock interviews
Speech-to-text
Text-to-speech
Interview history
User profile management
Resume version management
Deployment to cloud
Docker support
Production database configuration
Improved AI response speed
🎓 Learning Outcomes

This project demonstrates practical experience with:

Java
Spring Boot
REST API development
Spring Data JPA
MySQL
React
Vite
PDF processing
File upload handling
BCrypt password encryption
Frontend/backend integration
AI integration
Ollama
Prompt engineering
Git and GitHub
Full-stack application architecture
👩‍💻 Developer

Tejaswini Shivannagari

Computer Science Engineering Student

⭐ Project Summary

The AI Interview Assistant combines full-stack web development with locally hosted artificial intelligence.

The project demonstrates how:

React
   +
Spring Boot
   +
MySQL
   +
Ollama

can be combined to create a complete AI-powered interview preparation platform.

The system allows users to move from resume upload → resume analysis → interview questions → mock interview → AI feedback → final performance result within one application.




Also, I didn't invent exact backend endpoint names for every feature. We know your working analysis endpoint is:

/api/resume/analyze/latest

