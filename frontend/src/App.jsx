import { useState } from "react";
import "./App.css";

function App() {
  // =====================================================
  // STATES
  // =====================================================

  const [selectedResume, setSelectedResume] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [activePage, setActivePage] = useState("home");

  const [resumeUploaded, setResumeUploaded] = useState(false);

  // Resume Analysis
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Interview Questions
  const [questionsResult, setQuestionsResult] = useState(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Mock Interview
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Final Result
  const [finalResult, setFinalResult] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);


  // =====================================================
  // NAVIGATION
  // =====================================================
  const goToPage = (page) => {
    setActivePage(page);
    setUploadStatus("");
  };


  // =====================================================
  // FILE SELECTION
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedResume(file);
    setUploadStatus("");
  };


  // =====================================================
  // RESUME UPLOAD
  // =====================================================

  const handleResumeUpload = async () => {
    if (!selectedResume) {
      setUploadStatus("Please select your resume first.");
      return;
    }

    try {
      setUploadStatus("Uploading resume...");

      const formData = new FormData();

      formData.append("file", selectedResume);
      formData.append("uploadedBy", "demo-user");

      const response = await fetch(
        "http://localhost:8080/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Resume upload failed");
      }

      const result = await response.json();

      console.log("Upload response:", result);

      setUploadStatus(
        `✅ ${selectedResume.name} uploaded successfully!`
      );

      setResumeUploaded(true);

    } catch (error) {
      console.error("Upload error:", error);

      setUploadStatus(
        "❌ Resume upload failed. Please try again."
      );
    }
  };


  // =====================================================
  // RESUME ANALYSIS
  // =====================================================

  const handleStartAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      setUploadStatus("");

      /*
       * IMPORTANT:
       *
       * React does NOT directly call Ollama.
       *
       * React → Spring Boot → Ollama
       *
       * This endpoint is handled by your Spring Boot
       * ResumeAnalysisService.
       */

      const response = await fetch(
        "http://localhost:8080/api/resume/analyze/latest"
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();

      console.log("Ollama Resume Analysis:", result);

      setAnalysisResult(result);

    } catch (error) {
      console.error("Analysis error:", error);

      setUploadStatus(
        "❌ Unable to analyze the resume. Please try again."
      );

    } finally {
      setAnalysisLoading(false);
    }
  };


  // =====================================================
  // GENERATE INTERVIEW QUESTIONS
  // =====================================================
const handleGenerateQuestions = async () => {
  try {
    setQuestionsLoading(true);
    setUploadStatus("");

    const response = await fetch(
      "http://localhost:8080/api/resume/questions/latest"
    );

    if (!response.ok) {
      throw new Error("Question generation failed");
    }

    const result = await response.json();

    console.log("Interview Questions Response:", result);

    setQuestionsResult(result);

    // Automatically select the first question
    if (
      result.interviewQuestions &&
      result.interviewQuestions.length > 0
    ) {
     setCurrentQuestionIndex(0);
setCurrentQuestion(result.interviewQuestions[0]);
setAnswer("");
setFeedbackResult(null);
    }

  } catch (error) {
    console.error("Interview question error:", error);
    setUploadStatus(
      "Failed to generate interview questions. Make sure the backend is running."
    );
  } finally {
    setQuestionsLoading(false);
  }
};
  
  // =====================================================
  // MOCK INTERVIEW FEEDBACK
  // =====================================================

const handleSubmitAnswer = async () => {
  if (!currentQuestion || !answer.trim()) {
    setUploadStatus("Please select a question and enter your answer.");
    return;
  }

  try {
    setFeedbackLoading(true);
    setUploadStatus("");

    const response = await fetch(
      "http://localhost:8080/api/interview/feedback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer: answer,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Feedback generation failed");
    }

    const result = await response.json();

    console.log("AI Feedback:", result);

    setFeedbackResult(result);
  } catch (error) {
    console.error("Feedback error:", error);
    setUploadStatus("Failed to generate feedback.");
  } finally {
    setFeedbackLoading(false);
  }
};


  // =====================================================
  // FINAL MOCK INTERVIEW RESULT
  // =====================================================

  const handleFinalResult = async () => {
    try {
      setResultLoading(true);
      setUploadStatus("");

      /*
       * NOTE:
       *
       * This request assumes the backend DTO accepts
       * the collected interview information.
       *
       * If your MockInterviewResultRequest uses different
       * field names, we will adjust this after checking
       * that DTO.
       */

      const response = await fetch(
        "http://localhost:8080/api/resume/mock-interview/result",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: currentQuestion,
            answer: answer,
            feedback: feedbackResult,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Final result request failed");
      }

      const result = await response.json();

      console.log("Final Mock Interview Result:", result);

      setFinalResult(result);

    } catch (error) {
      console.error("Final result error:", error);

      setUploadStatus(
        "❌ Unable to calculate final interview result."
      );

    } finally {
      setResultLoading(false);
    }
  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = () => {
    goToPage("dashboard");
  };


  // =====================================================
  // MAIN APP
  // =====================================================

  return (
    <div className="app">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">

        <div
          className="logo"
          onClick={() => goToPage("home")}
          style={{ cursor: "pointer" }}
        >
          AI Interview Assistant
        </div>

        <div className="nav-buttons">

          <button
            className="secondary-button"
            onClick={() => goToPage("login")}
          >
            Login
          </button>

          <button
            className="primary-button"
            onClick={() => goToPage("register")}
          >
            Get Started
          </button>

        </div>

      </header>


      {/* =================================================
          HOME
      ================================================= */}

      {activePage === "home" && (

        <main>

          <section className="hero-section">

            <div className="hero-content">

              <p className="eyebrow">
                AI INTERVIEW ASSISTANT
              </p>

              <h1>
                Prepare smarter.
                <br />
                Interview confidently.
              </h1>

              <p>
                Upload your resume, analyze your skills,
                practice interviews and receive AI-powered
                feedback.
              </p>

              <button
                className="primary-button"
                onClick={() => goToPage("login")}
              >
                Get Started
              </button>

            </div>

          </section>


          <section className="features-section">

            <h2>
              Everything you need to prepare
            </h2>

            <div className="features-grid">

              <FeatureCard
                icon="📄"
                title="Resume Analysis"
                text="Analyze your resume, skills and experience."
              />

              <FeatureCard
                icon="❓"
                title="AI Questions"
                text="Generate interview questions from your resume."
              />

              <FeatureCard
                icon="🎤"
                title="Mock Interview"
                text="Answer questions and practice your interview."
              />

              <FeatureCard
                icon="📊"
                title="AI Feedback"
                text="Receive feedback and a final performance score."
              />

            </div>

          </section>


          <section className="steps-section">

            <h2>
              How it works
            </h2>

            <div className="steps-grid">

              <Step
                number="01"
                title="Upload Resume"
                text="Upload your resume to the system."
              />

              <Step
                number="02"
                title="Resume Analysis"
                text="AI analyzes your skills and experience."
              />

              <Step
                number="03"
                title="Mock Interview"
                text="Practice personalized questions."
              />

              <Step
                number="04"
                title="Feedback"
                text="Get AI feedback and your final score."
              />

            </div>

          </section>

        </main>

      )}


      {/* =================================================
          FEATURES
      ================================================= */}

      {activePage === "features" && (

        <section className="page-section">

          <p className="eyebrow">
            FEATURES
          </p>

          <h1>
            AI Interview Assistant Features
          </h1>

          <div className="features-grid">

            <FeatureCard
              icon="📄"
              title="Resume Upload"
              text="Upload your resume for analysis."
            />

            <FeatureCard
              icon="🧠"
              title="Resume Analysis"
              text="Identify your technical and professional skills."
            />

            <FeatureCard
              icon="❓"
              title="Interview Questions"
              text="Practice questions related to your resume."
            />

            <FeatureCard
              icon="🎤"
              title="Mock Interview"
              text="Answer questions in a realistic interview."
            />

            <FeatureCard
              icon="📊"
              title="AI Feedback"
              text="Understand your strengths and weaknesses."
            />

          </div>

          <button
            className="primary-button back-button"
            onClick={() => goToPage("home")}
          >
            Back to Home
          </button>

        </section>

      )}


      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      {activePage === "how" && (

        <section className="page-section">

          <p className="eyebrow">
            HOW IT WORKS
          </p>

          <h1>
            Your Interview Preparation Journey
          </h1>

          <div className="journey">

            <Step
              number="01"
              title="Upload Resume"
              text="Provide your resume."
            />

            <Step
              number="02"
              title="Resume Analysis"
              text="AI analyzes your resume."
            />

            <Step
              number="03"
              title="Generate Questions"
              text="Questions are generated from your profile."
            />

            <Step
              number="04"
              title="Mock Interview"
              text="Answer interview questions."
            />

            <Step
              number="05"
              title="AI Feedback"
              text="Receive feedback on your answers."
            />

            <Step
              number="06"
              title="Final Score"
              text="See your final interview performance."
            />

          </div>

          <button
            className="primary-button back-button"
            onClick={() => goToPage("home")}
          >
            Back to Home
          </button>

        </section>

      )}


      {/* =================================================
          LOGIN
      ================================================= */}

      {activePage === "login" && (

        <AuthPage
          title="Welcome Back"
          subtitle="Login to continue your interview preparation."
          buttonText="Login"
          switchText="Don't have an account?"
          switchButton="Create Account"
          onSwitch={() => goToPage("register")}
          onBack={() => goToPage("home")}
          onLogin={handleLogin}
        />

      )}


      {/* =================================================
          REGISTER
      ================================================= */}

      {activePage === "register" && (

        <AuthPage
          title="Create Your Account"
          subtitle="Start preparing for your next interview."
          buttonText="Create Account"
          switchText="Already have an account?"
          switchButton="Login"
          onSwitch={() => goToPage("login")}
          onBack={() => goToPage("home")}
          register={true}
          onLogin={() => goToPage("dashboard")}
        />

      )}


      {/* =================================================
          DASHBOARD
      ================================================= */}

      {activePage === "dashboard" && (

        <section className="dashboard-section">

          <div className="dashboard-header">

            <div>

              <p className="eyebrow">
                AI INTERVIEW ASSISTANT
              </p>

              <h1>
                Welcome to Your Dashboard 👋
              </h1>

              <p>
                Prepare for your next interview with AI-powered tools.
              </p>

            </div>

            <button
              className="secondary-button"
              onClick={() => goToPage("home")}
            >
              Logout
            </button>

          </div>


          <div className="dashboard-grid">


            {/* RESUME UPLOAD */}

            <div className="dashboard-card">

              <div className="dashboard-icon">
                📄
              </div>

              <h3>
                Resume Upload
              </h3>

              <p>
                Upload your resume for AI processing.
              </p>

              <button
                className="primary-button"
                onClick={() => goToPage("upload-resume")}
              >
                Upload Resume
              </button>

            </div>


            {/* RESUME ANALYSIS */}

            <div className="dashboard-card">

              <div className="dashboard-icon">
                🧠
              </div>

              <h3>
                Resume Analysis
              </h3>

              <p>
                Analyze your skills and experience.
              </p>

              <button
                className="primary-button"
                disabled={!resumeUploaded}
                onClick={() => goToPage("analysis")}
              >
                Analyze Resume
              </button>

            </div>


            {/* MOCK INTERVIEW */}

            <div className="dashboard-card">

              <div className="dashboard-icon">
                🎤
              </div>

              <h3>
                Mock Interview
              </h3>

              <p>
                Practice personalized interview questions.
              </p>

              <button
                className="primary-button"
                disabled={!resumeUploaded}
                onClick={() => goToPage("mock-interview")}
              >
                Start Interview
              </button>

            </div>


            {/* FEEDBACK */}

            <div className="dashboard-card">

              <div className="dashboard-icon">
                📊
              </div>

              <h3>
                Feedback
              </h3>

              <p>
                Review your AI interview feedback.
              </p>

              <button
                className="primary-button"
                disabled={!feedbackResult && !finalResult}
                onClick={() => goToPage("feedback")}
              >
                View Feedback
              </button>

            </div>

          </div>

        </section>

      )}


      {/* =================================================
          UPLOAD RESUME
      ================================================= */}

      {activePage === "upload-resume" && (

        <section className="upload-section">

          <div className="upload-container">

            <p className="eyebrow">
              AI INTERVIEW ASSISTANT
            </p>

            <h1>
              Upload Your Resume
            </h1>

            <p>
              Upload your resume to prepare it for AI-powered analysis.
            </p>


            <div className="upload-box">

              <div className="dashboard-icon">
                📄
              </div>

              <h3>
                Choose your resume
              </h3>

              <p>
                PDF, DOC or DOCX files are supported.
              </p>


              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />


              {selectedResume && (

                <div className="selected-file">

                  <p>
                    📎 {selectedResume.name}
                  </p>

                </div>

              )}


              <button
                className="primary-button"
                disabled={!selectedResume}
                onClick={handleResumeUpload}
              >
                Upload Resume
              </button>


              {uploadStatus && (

                <div className="upload-status">
                  {uploadStatus}
                </div>

              )}


              {resumeUploaded && (

                <button
                  className="primary-button"
                  onClick={() => goToPage("analysis")}
                >
                  Continue to Analysis →
                </button>

              )}

            </div>


            <button
              className="secondary-button"
              onClick={() => goToPage("dashboard")}
            >
              ← Back to Dashboard
            </button>

          </div>

        </section>

      )}


      {/* =================================================
          RESUME ANALYSIS
      ================================================= */}

      {activePage === "analysis" && (

        <section className="analysis-section">

          <div className="analysis-container">

            <p className="eyebrow">
              AI INTERVIEW ASSISTANT
            </p>

            <h1>
              Resume Analysis
            </h1>

            <p>
              Your resume is ready for AI-powered analysis.
            </p>


            {selectedResume && (

              <div className="analysis-file-card">

                <div className="dashboard-icon">
                  📄
                </div>

                <div>

                  <h3>
                    {selectedResume.name}
                  </h3>

                  <p>
                    Your selected resume
                  </p>

                </div>

              </div>

            )}


            <div className="analysis-card">

              <div className="dashboard-icon">
                🤖
              </div>

              <h2>
                AI Resume Analysis
              </h2>

              <p>
                Our local AI system will analyze your resume
                and identify skills, strengths, weaknesses,
                suggestions and interview focus.
              </p>


              <button
                className="primary-button"
                onClick={handleStartAnalysis}
                disabled={analysisLoading}
              >
                {analysisLoading
                  ? "Analyzing Resume..."
                  : "Start AI Analysis"}
              </button>

            </div>


            {uploadStatus && (

              <p className="upload-status">
                {uploadStatus}
              </p>

            )}


            {/* ANALYSIS RESULT */}

            {analysisResult && (

              <div className="analysis-results">

                <h2>
                  📊 Analysis Results
                </h2>


                <div className="result-item">
                  <strong>Resume:</strong>
                  <span>
                    {analysisResult.fileName}
                  </span>
                </div>


                <div className="result-item">
                  <strong>Resume ID:</strong>
                  <span>
                    {analysisResult.resumeId}
                  </span>
                </div>


                <div className="result-item">
                  <strong>Text Length:</strong>
                  <span>
                    {analysisResult.textLength} characters
                  </span>
                </div>


                <div className="result-item">
                  <strong>Education:</strong>
                  <span>
                    {analysisResult.educationDetected
                      ? "✅ Detected"
                      : "❌ Not detected"}
                  </span>
                </div>


                <div className="result-item">
                  <strong>Experience:</strong>
                  <span>
                    {analysisResult.experienceDetected
                      ? "✅ Detected"
                      : "❌ Not detected"}
                  </span>
                </div>


                {/* SKILLS */}

                <div className="skills-section">

                  <h3>
                    🛠 Detected Skills
                  </h3>


                  {analysisResult.detectedSkills &&
                  analysisResult.detectedSkills.length > 0 ? (

                    <div className="skills-list">

                      {analysisResult.detectedSkills.map(
                        (skill, index) => (

                          <span
                            className="skill-tag"
                            key={index}
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p>
                      No skills detected.
                    </p>

                  )}

                </div>


                {/* SCORE */}

                {analysisResult.score !== undefined && (

                  <div className="ai-score-section">

                    <h3>
                      🎯 AI Resume Score
                    </h3>

                    <div className="resume-score">

                      {analysisResult.score}

                      <span>
                        /100
                      </span>

                    </div>

                  </div>

                )}


                {/* STRENGTHS */}

                <div className="ai-feedback-section">

                  <h3>
                    💪 Strengths
                  </h3>

                  {analysisResult.strengths &&
                  analysisResult.strengths.length > 0 ? (

                    <ul>

                      {analysisResult.strengths.map(
                        (strength, index) => (

                          <li key={index}>
                            {strength}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p>
                      No strengths available.
                    </p>

                  )}

                </div>


                {/* WEAKNESSES */}

                <div className="ai-feedback-section">

                  <h3>
                    ⚠️ Areas to Improve
                  </h3>

                  {analysisResult.weaknesses &&
                  analysisResult.weaknesses.length > 0 ? (

                    <ul>

                      {analysisResult.weaknesses.map(
                        (weakness, index) => (

                          <li key={index}>
                            {weakness}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p>
                      No weaknesses identified.
                    </p>

                  )}

                </div>


                {/* SUGGESTIONS */}

                <div className="ai-feedback-section">

                  <h3>
                    💡 Suggestions
                  </h3>

                  {analysisResult.suggestions &&
                  analysisResult.suggestions.length > 0 ? (

                    <ul>

                      {analysisResult.suggestions.map(
                        (suggestion, index) => (

                          <li key={index}>
                            {suggestion}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p>
                      No suggestions available.
                    </p>

                  )}

                </div>


                {/* INTERVIEW FOCUS */}

                <div className="ai-feedback-section">

                  <h3>
                    🎯 Interview Focus
                  </h3>

                  <p>
                    {analysisResult.interviewFocus ||
                      "No interview focus available."}
                  </p>

                </div>

              </div>
              

            )}


            <button
              className="secondary-button"
              onClick={() => goToPage("dashboard")}
            >
              ← Back to Dashboard
            </button>

          </div>

        </section>

      )}


      {/* =================================================
          MOCK INTERVIEW
      ================================================= */}

      {activePage === "mock-interview" && (

        <section className="page-section">

          <p className="eyebrow">
            AI MOCK INTERVIEW
          </p>

          <h1>
            Mock Interview 🎤
          </h1>

          <p>
            Generate personalized questions and practice your answers.
          </p>


          <div className="analysis-card">

            <h2>
              Interview Questions
            </h2>

            <button
              className="primary-button"
              onClick={handleGenerateQuestions}
              disabled={questionsLoading}
            >
              {questionsLoading
                ? "Generating Questions..."
                : "Generate Interview Questions"}
            </button>
              {questionsResult && (
  <div className="questions-result">

    <h3>Generated Questions</h3>

    {questionsResult.interviewQuestions &&
    questionsResult.interviewQuestions.length > 0 ? (

      <div>

        {questionsResult.interviewQuestions.map(
          (question, index) => (

            <div
              className="result-item"
              key={index}
              onClick={() => {
  setCurrentQuestionIndex(index);
  setCurrentQuestion(question);
  setAnswer("");
  setFeedbackResult(null);
}}
              style={{ cursor: "pointer" }}
            >

              <strong>
                Q{index + 1}
              </strong>

              <span>
                {question}
              </span>

            </div>

          )
        )}

      </div>

    ) : (

      <p>No interview questions were generated.</p>

    )}

  </div>
)}

          
      

            

          </div>{currentQuestion && (
  <div className="analysis-card">

    <h2>🎤 Mock Interview</h2>

    <div className="result-item">
      <strong>Question:</strong>
      <span>{currentQuestion}</span>
    </div>

    <textarea
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      placeholder="Type your answer here..."
      rows="6"
    />

    
    {feedbackResult && (
      <div className="ai-feedback-section">

        <h3>🤖 AI Feedback</h3>

        {feedbackResult.score !== undefined && (
          <p>
            <strong>Score:</strong>{" "}
            {feedbackResult.score}/100
          </p>
        )}

        {feedbackResult.feedback && (
          <p>
            <strong>Feedback:</strong>{" "}
            {feedbackResult.feedback}
          </p>
        )}

        {feedbackResult.strengths &&
          feedbackResult.strengths.length > 0 && (
            <>
              <h4>💪 Strengths</h4>

              <ul>
                {feedbackResult.strengths.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </>
          )}

        {feedbackResult.improvements &&
          feedbackResult.improvements.length > 0 && (
            <>
              <h4>⚠️ Improvements</h4>

              <ul>
                {feedbackResult.improvements.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </>
          )}

      </div>
    )}

  </div>
)}


          {/* CURRENT QUESTION */}

          {currentQuestion && (

            <div className="analysis-card">

              <h2>
                Current Question
              </h2>

              <p>
                {currentQuestion}
              </p>


              <textarea
                rows="8"
                placeholder="Type your interview answer here..."
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "15px",
                  borderRadius: "10px",
                  resize: "vertical"
                }}
              />


              <button
      className="primary-button"
      onClick={handleSubmitAnswer}
      disabled={feedbackLoading || !answer.trim()}
    >
      {feedbackLoading
        ? "Analyzing Answer..."
        : "Submit Answer"}
    </button>
    {questionsResult &&
  questionsResult.interviewQuestions &&
  currentQuestionIndex <
    questionsResult.interviewQuestions.length - 1 && (
    <button
      className="primary-button"
      onClick={() => {
        const nextIndex = currentQuestionIndex + 1;

        setCurrentQuestionIndex(nextIndex);

        setCurrentQuestion(
          questionsResult.interviewQuestions[nextIndex]
        );

        setAnswer("");
        setFeedbackResult(null);
      }}
    >
      Next Question →
    </button>
  )}


            </div>

          )}


          <button
            className="secondary-button"
            onClick={() => goToPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

        </section>

      )}


      {/* =================================================
          FEEDBACK
      ================================================= */}

      {activePage === "feedback" && (

        <section className="page-section">

          <p className="eyebrow">
            AI INTERVIEW FEEDBACK
          </p>

          <h1>
            Interview Feedback 📊
          </h1>


          {feedbackResult ? (

            <div className="analysis-results">

              <h2>
                🤖 AI Feedback
              </h2>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6"
                }}
              >
                {JSON.stringify(
                  feedbackResult,
                  null,
                  2
                )}
              </pre>


              <button
                className="primary-button"
                onClick={handleFinalResult}
                disabled={resultLoading}
              >
                {resultLoading
                  ? "Calculating Final Result..."
                  : "Calculate Final Result"}
              </button>

            </div>

          ) : (

            <div className="analysis-card">

              <h2>
                No Feedback Yet
              </h2>

              <p>
                Complete a mock interview answer first.
              </p>

              <button
                className="primary-button"
                onClick={() => goToPage("mock-interview")}
              >
                Go to Mock Interview
              </button>

            </div>

          )}


          {/* FINAL RESULT */}

          {finalResult && (

            <div className="analysis-results">

              <h2>
                🏆 Final Interview Result
              </h2>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6"
                }}
              >
                {JSON.stringify(
                  finalResult,
                  null,
                  2
                )}
              </pre>

            </div>

          )}


          <button
            className="secondary-button"
            onClick={() => goToPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

        </section>

      )}


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <h3>
          AI Interview Assistant
        </h3>

        <p>
          Practice smarter. Interview confidently.
        </p>

        <p className="copyright">
          © 2026 AI Interview Assistant
        </p>

      </footer>

    </div>
  );
}


// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({
  icon,
  title,
  text
}) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}


// =====================================================
// STEP
// =====================================================

function Step({
  number,
  title,
  text
}) {
  return (
    <div className="step-card">

      <div className="step-number">
        {number}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}


// =====================================================
// LOGIN / REGISTER
// =====================================================

function AuthPage({
  title,
  subtitle,
  buttonText,
  switchText,
  switchButton,
  onSwitch,
  onBack,
  onLogin,
  register
}) {
  return (
    <section className="auth-section">

      <div className="auth-card">

        <button
          className="back-link"
          onClick={onBack}
        >
          ← Back
        </button>


        <div className="auth-icon">
          🤖
        </div>


        <h1>
          {title}
        </h1>


        <p>
          {subtitle}
        </p>


        {register && (

          <div className="input-group">

            <label>
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
            />

          </div>

        )}


        <div className="input-group">

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
          />

        </div>


        <div className="input-group">

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
          />

        </div>


        <button
          className="primary-button auth-button"
          onClick={onLogin}
        >
          {buttonText}
        </button>


        <div className="switch-auth">

          <span>
            {switchText}
          </span>

          <button
            onClick={onSwitch}
          >
            {switchButton}
          </button>

        </div>

      </div>

    </section>
  );
}


// =====================================================
// EXPORT
// =====================================================

export default App;