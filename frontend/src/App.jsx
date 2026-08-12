import { useState } from "react";
import "./App.css";

function App() {
  const [selectedResume, setSelectedResume] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
const[activePage, setActivePage] = useState("home");
const [resumeUploaded, setResumeUploaded] = useState(false);
const [analysisResult, setAnalysisResult] = useState(null);
const [analysisLoading, setAnalysisLoading] = useState(false);


const handleResumeUpload = async () => {
  if (!selectedResume) {
    setUploadStatus("Please select your resume first.");
    return;
  }

  try {
    setUploadStatus("Uploading resume...");

    const formData = new FormData();

    // IMPORTANT: Spring Boot expects "file"
    formData.append("file", selectedResume);

    // Temporary value until we connect your logged-in user
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

    console.log("Backend response:", result);

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

const handleStartAnalysis = async () => {
  try {
    setAnalysisLoading(true);
    setUploadStatus("");

    const response = await fetch(
      "http://localhost:8080/api/resume/analyze/latest"
    );

    if (!response.ok) {
      throw new Error("Analysis failed");
    }

    const result = await response.json();

    console.log("Analysis result:", result);

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


  

  const goToPage = (page) => {
    setActivePage(page);
    //window.scrollTo(0, 0);
  };

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div
          className="brand"
          onClick={() => goToPage("home")}
        >
          AI Interview Assistant
        </div>

        <div className="nav-links">

          <button
            onClick={() => goToPage("home")}
            className="nav-button"
          >
            Home
          </button>

          <button
            onClick={() => goToPage("features")}
            className="nav-button"
          >
            Features
          </button>

          <button
            onClick={() => goToPage("how")}
            className="nav-button"
          >
            How It Works
          </button>

          <button
            onClick={() => goToPage("login")}
            className="login-button"
          >
            Login
          </button>

          <button
            onClick={() => goToPage("register")}
            className="signup-button"
          >
            Get Started
          </button>

        </div>

      </nav>


      {/* HOME */}

      {activePage === "home" && (

        <main>

          <section className="hero-section">

            <div className="hero-content">

              <p className="eyebrow">
                PRACTICE SMARTER
              </p>

              <h1>
                Your Personal
                <span> Interview Practice Partner</span>
              </h1>

              <p className="hero-description">
                Upload your resume, analyze your skills,
                practice interview questions and receive
                instant feedback to improve your performance.
              </p>

              <div className="hero-buttons">

                <button
                  className="primary-button"
                  onClick={() => goToPage("register")}
                >
                  Start Practicing
                </button>

                <button
                  className="secondary-button"
                  onClick={() => goToPage("how")}
                >
                  Learn More
                </button>

              </div>

            </div>


            <div className="hero-card">

              <div className="card-icon">
                🤖
              </div>

              <h3>
                AI Interview Assistant
              </h3>

              <p>
                Resume Analysis
              </p>

              <div className="progress-bar">
                <div className="progress"></div>
              </div>

              <p>
                Interview Preparation
              </p>

              <div className="progress-bar">
                <div className="progress progress-2"></div>
              </div>

              <p>
                Performance Feedback
              </p>

              <div className="progress-bar">
                <div className="progress progress-3"></div>
              </div>

            </div>

          </section>


          {/* FEATURES */}

          <section
            className="features-section"
            id="features"
          >

            <div className="section-heading">

              <p className="eyebrow">
                FEATURES
              </p>

              <h2>
                Everything You Need
              </h2>

              <p>
                Prepare for interviews with a simple
                step-by-step workflow.
              </p>

            </div>


            <div className="features-grid">

              <FeatureCard
                icon="📄"
                title="Resume Analysis"
                text="Upload your resume and analyze your skills, experience and technologies."
              />

              <FeatureCard
                icon="💬"
                title="Interview Questions"
                text="Get interview questions based on your resume and technical skills."
              />

              <FeatureCard
                icon="📊"
                title="Performance Feedback"
                text="Review your answers and understand where you can improve."
              />

              <FeatureCard
                icon="🏆"
                title="Mock Interview Score"
                text="Complete a mock interview and receive your final performance score."
              />

            </div>

          </section>


          {/* HOW IT WORKS */}

          <section
            className="how-section"
            id="how"
          >

            <div className="section-heading">

              <p className="eyebrow">
                HOW IT WORKS
              </p>

              <h2>
                Four Simple Steps
              </h2>

            </div>


            <div className="steps-grid">

              <Step
                number="01"
                title="Upload Resume"
                text="Upload your latest resume."
              />

              <Step
                number="02"
                title="Analyze Skills"
                text="Our system extracts your skills and experience."
              />

              <Step
                number="03"
                title="Practice Interview"
                text="Answer interview questions based on your profile."
              />

              <Step
                number="04"
                title="Get Feedback"
                text="Review your feedback and final score."
              />

            </div>

          </section>


          {/* CTA */}

          <section className="cta-section">

            <h2>
              Ready to Practice?
            </h2>

            <p>
              Start preparing for your next interview today.
            </p>

            <button
              className="primary-button"
              onClick={() => goToPage("register")}
            >
              Get Started
            </button>

          </section>

        </main>

      )}


      {/* FEATURES PAGE */}

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
              title="Skill Analysis"
              text="Identify your technical and professional skills."
            />

            <FeatureCard
              icon="❓"
              title="Interview Questions"
              text="Practice questions related to your skills."
            />

            <FeatureCard
              icon="📈"
              title="Feedback"
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


      {/* HOW PAGE */}

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
              text="Provide your resume to the system."
            />

            <Step
              number="02"
              title="Resume Analysis"
              text="The system analyzes your resume and identifies skills."
            />

            <Step
              number="03"
              title="Interview Questions"
              text="Practice questions generated from your skills."
            />

            <Step
              number="04"
              title="Answer Questions"
              text="Submit your answers for evaluation."
            />

            <Step
              number="05"
              title="Feedback"
              text="Receive feedback on your performance."
            />

            <Step
              number="06"
              title="Final Score"
              text="Complete your mock interview and see your final score."
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


      {/* LOGIN */}

      {activePage === "login" && (

        <AuthPage
          title="Welcome Back"
          subtitle="Login to continue your interview preparation."
          buttonText="Login"
          switchText="Don't have an account?"
          switchButton="Create Account"
          onSwitch={() => goToPage("register")}
          onBack={() => goToPage("home")}
          onLogin={() => goToPage("dashboard")}
        />

      )}


      {/* REGISTER */}

      {activePage === "register" && (

        <AuthPage
          title="Create Your Account"
          subtitle="Start preparing for your next interview."
          buttonText="Create Account"
          switchText="Already have an account?"
          switchButton="Login"
          onSwitch={() => goToPage("login")}
          onBack={() => goToPage("home")}
          register
        />

      )}
      {/* DASHBOARD */}

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

      <div className="dashboard-card"
      onClick={() => goToPage("upload-resume")}>

        <div className="dashboard-icon">
          📄
        </div>

        <h3>
          Upload Resume
        </h3>

        <p>
          Upload your resume and prepare it for AI analysis.
        </p>

        <button className="primary-button"
        OnClick={() => goToPage("upload-resume")}>
          Upload Resume
        </button>

      </div>


      <div className="dashboard-card">

        <div className="dashboard-icon">
          🧠
        </div>

        <h3>
          Resume Analysis
        </h3>

        <p>
          Analyze your skills, experience and technologies.
        </p>

        <button className="primary-button">
          Analyze Resume
        </button>

      </div>


      <div className="dashboard-card">

        <div className="dashboard-icon">
          🎤
        </div>

        <h3>
          Mock Interview
        </h3>

        <p>
          Practice interview questions based on your profile.
        </p>

        <button className="primary-button">
          Start Interview
        </button>

      </div>


      <div className="dashboard-card">

        <div className="dashboard-icon">
          📊
        </div>

        <h3>
          Feedback
        </h3>

        <p>
          Review your interview performance and feedback.
        </p>

        <button className="primary-button">
          View Feedback
        </button>

      </div>

    </div>

  </section>

)}
{/* UPLOAD RESUME */}

{activePage === "upload-resume" && (
  <section className="upload-section">

    <div className="upload-container">

      <p className="eyebrow">
        AI INTERVIEW ASSISTANT
      </p>

      <h1>Upload Your Resume</h1>

      <p>
        Upload your resume to prepare it for AI-powered analysis.
      </p>

      <div className="upload-box">

        <div className="dashboard-icon">
          📄
        </div>

        <h3>Choose your resume</h3>

        <p>
          PDF, DOC or DOCX files are supported.
        </p>

        {/* FILE INPUT */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            setSelectedResume(e.target.files[0]);
          }}
        />

        {/* SELECTED FILE */}
        {selectedResume && (
          <div className="selected-file">
            <p>
              📎 {selectedResume.name}
            </p>
          </div>
        )}

        {/* UPLOAD BUTTON */}
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
      {/* RESUME ANALYSIS */}

{activePage === "analysis" && (
  <section className="analysis-section">

    <div className="analysis-container">

      <p className="eyebrow">
        AI INTERVIEW ASSISTANT
      </p>

      <h1>Resume Analysis</h1>

      <p>
        Your resume is ready for AI-powered analysis.
      </p>

      {selectedResume && (
        <div className="analysis-file-card">

          <div className="dashboard-icon">
            📄
          </div>

          <div>
            <h3>{selectedResume.name}</h3>

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

        <h2>AI Resume Analysis</h2>

        <p>
          Our AI will analyze your resume and identify your
          strengths, skills, experience, and areas for improvement.
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
{analysisResult && (
  <div className="analysis-results">

    <h2>📊 Analysis Results</h2>

    <div className="result-item">
      <strong>Resume:</strong>
      <span>{analysisResult.fileName}</span>
    </div>

    <div className="result-item">
      <strong>Resume ID:</strong>
      <span>{analysisResult.resumeId}</span>
    </div>

    <div className="result-item">
      <strong>Text Length:</strong>
      <span>{analysisResult.textLength} characters</span>
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

    <div className="skills-section">

      <h3>🛠 Detected Skills</h3>

      {analysisResult.detectedSkills &&
      analysisResult.detectedSkills.length > 0 ? (

        <div className="skills-list">

          {analysisResult.detectedSkills.map((skill, index) => (
            <span
              className="skill-tag"
              key={index}
            >
              {skill}
            </span>
          ))}

        </div>

      ) : (
        <p>No skills detected.</p>
      )}

    </div>

  </div>
)}
      <button
        className="secondary-button"
        onClick={() => goToPage("upload-resume")}
      >
        ← Back to Resume Upload
      </button>

    </div>

  </section>
  
)}




      {/* FOOTER */}

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


/* FEATURE CARD */

function FeatureCard({ icon, title, text }) {

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


/* STEP */

function Step({ number, title, text }) {

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


/* LOGIN / REGISTER */

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


        <button className="primary-button auth-button"
          onClick={onLogin}
        >
          {buttonText}
        </button>


        <div className="switch-auth">

          <span>
            {switchText}
          </span>

          <button onClick={onSwitch}>
            {switchButton}
          </button>

        </div>

      </div>

    </section>

  );

}


export default App;