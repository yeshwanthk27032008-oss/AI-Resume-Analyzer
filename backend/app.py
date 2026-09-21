import os
import sys
import uuid
from datetime import datetime, timezone

# Ensure backend directory is in sys.path for direct or module execution
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify, Response  # type: ignore
from flask_cors import CORS  # type: ignore
from werkzeug.utils import secure_filename  # type: ignore

from resume_parser import extract_text_from_resume  # type: ignore
from analyzer import analyze_resume  # type: ignore
from database import init_db, save_analysis, get_analysis_by_id, get_recent_analyses  # type: ignore

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
REPORTS_FOLDER = os.path.join(BASE_DIR, "reports")

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORTS_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["REPORTS_FOLDER"] = REPORTS_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

# Enable CORS for frontend communication
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ensure database tables exist
init_db()


def is_allowed_file(filename: str) -> bool:
    """Check if the uploaded file has a supported extension."""
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend service status."""
    return jsonify({
        "status": "ok"
    }), 200


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Main endpoint to upload resume and analyze against job description.
    Accepts multipart/form-data:
      - resume: File (.pdf or .docx)
      - job_description: Text
      - job_title: Text (optional)
    """
    try:
        # 1. Validation: File presence
        if "resume" not in request.files:
            return jsonify({"success": False, "error": "No resume file provided in the request."}), 400

        file = request.files["resume"]
        if file.filename == "":
            return jsonify({"success": False, "error": "No file was selected for upload."}), 400

        if not is_allowed_file(file.filename or ""):
            return jsonify({
                "success": False,
                "error": "Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx)."
            }), 400

        # 2. Validation: Job description presence
        job_description = request.form.get("job_description", "").strip()
        job_title = request.form.get("job_title", "").strip() or "Target Role"

        if not job_description:
            return jsonify({"success": False, "error": "Job description is required for analysis."}), 400

        if len(job_description) < 30:
            return jsonify({
                "success": False,
                "error": "Job description is too brief. Please provide at least 30 characters of job details."
            }), 400

        # 3. Save uploaded file securely
        original_filename = secure_filename(file.filename or "") or "resume.pdf"
        file_ext = os.path.splitext(original_filename)[1].lower()
        unique_filename = f"{uuid.uuid4().hex[:10]}_{original_filename}"
        saved_file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        file.save(saved_file_path)

        # 4. Extract text from uploaded resume
        try:
            resume_text = extract_text_from_resume(saved_file_path)
        except Exception as parse_err:
            return jsonify({
                "success": False,
                "error": f"Error parsing resume: {str(parse_err)}"
            }), 422

        # 5. Execute analysis engine
        analysis_result = analyze_resume(
            resume_text=resume_text,
            job_description=job_description,
            job_title=job_title
        )

        # 6. Save result to SQLite database
        analysis_record = {
            "resume_filename": original_filename,
            "job_title": job_title,
            "ats_score": analysis_result["ats_score"],
            "score_breakdown": analysis_result["score_breakdown"],
            "matched_skills": analysis_result["matched_skills"],
            "missing_skills": analysis_result["missing_skills"],
            "keywords": analysis_result["keywords"],
            "strengths": analysis_result["strengths"],
            "weaknesses": analysis_result["weaknesses"],
            "recommendations": analysis_result["recommendations"],
            "summary": analysis_result["summary"]
        }
        analysis_id = save_analysis(analysis_record)

        # 7. Construct and return response
        response_data = {
            "success": True,
            "analysis_id": analysis_id,
            "resume_filename": original_filename,
            "job_title": job_title,
            "ats_score": analysis_result["ats_score"],
            "score_breakdown": analysis_result["score_breakdown"],
            "matched_skills": analysis_result["matched_skills"],
            "missing_skills": analysis_result["missing_skills"],
            "keywords": analysis_result["keywords"],
            "strengths": analysis_result["strengths"],
            "weaknesses": analysis_result["weaknesses"],
            "recommendations": analysis_result["recommendations"],
            "summary": analysis_result["summary"],
            "created_at": datetime.now().strftime("%B %d, %Y %I:%M %p")
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"An unexpected server error occurred: {str(e)}"
        }), 500


@app.route("/api/analysis/<int:analysis_id>", methods=["GET"])
def get_analysis(analysis_id: int):
    """Retrieve an existing analysis by ID."""
    analysis = get_analysis_by_id(analysis_id)
    if not analysis:
        return jsonify({"success": False, "error": f"Analysis with ID {analysis_id} not found."}), 404

    return jsonify({"success": True, **analysis}), 200


@app.route("/api/history", methods=["GET"])
def get_history():
    """Retrieve recent analyses for quick access."""
    recent = get_recent_analyses(limit=10)
    return jsonify({"success": True, "analyses": recent}), 200


@app.route("/api/report/<int:analysis_id>", methods=["GET"])
def download_report(analysis_id: int):
    """Generate and return a formatted markdown/text analysis report."""
    analysis = get_analysis_by_id(analysis_id)
    if not analysis:
        return jsonify({"success": False, "error": "Analysis not found."}), 404

    report_lines = [
        "=" * 60,
        "AI RESUME ANALYZER - DETAILED ATS AUDIT REPORT",
        "=" * 60,
        f"Analysis ID      : #{analysis['id']}",
        f"Date             : {analysis['created_at']}",
        f"Resume File      : {analysis['resume_filename']}",
        f"Target Job Title : {analysis['job_title']}",
        f"Overall ATS Score: {analysis['ats_score']}/100",
        "",
        "SCORE BREAKDOWN:",
        f"  - Skills Match          : {analysis['score_breakdown'].get('skills', 0)}%",
        f"  - Keyword Match         : {analysis['score_breakdown'].get('keywords', 0)}%",
        f"  - Resume Structure      : {analysis['score_breakdown'].get('structure', 0)}%",
        f"  - Experience Relevance  : {analysis['score_breakdown'].get('relevance', 0)}%",
        "",
        "SUMMARY:",
        f"  {analysis['summary']}",
        "",
        "MATCHED SKILLS:",
    ]

    for s in analysis['matched_skills']:
        report_lines.append(f"  [+] {s}")
    if not analysis['matched_skills']:
        report_lines.append("  (None detected)")

    report_lines.append("\nMISSING SKILLS:")
    for s in analysis['missing_skills']:
        report_lines.append(f"  [-] {s}")
    if not analysis['missing_skills']:
        report_lines.append("  (None detected)")

    report_lines.append("\nSTRENGTHS:")
    for st in analysis['strengths']:
        report_lines.append(f"  * {st}")

    report_lines.append("\nWEAKNESSES:")
    for w in analysis['weaknesses']:
        report_lines.append(f"  ! {w}")

    report_lines.append("\nRECOMMENDATIONS:")
    for idx, r in enumerate(analysis['recommendations'], 1):
        report_lines.append(f"  {idx}. {r}")

    report_lines.extend([
        "",
        "=" * 60,
        "DISCLAIMER: Recommendations generated by AI Resume Analyzer",
        "are for guidance purposes only and do not guarantee employment.",
        "=" * 60
    ])

    report_content = "\n".join(report_lines)
    return Response(
        report_content,
        mimetype="text/plain",
        headers={"Content-Disposition": f"attachment;filename=Resume_Report_{analysis_id}.txt"}
    )


# Generic error handler for unexpected exceptions

@app.errorhandler(Exception)
def handle_exception(e):
    # Log the exception (could be expanded to use logging)
    return jsonify({
        "success": False,
        "error": f"An unexpected error occurred: {str(e)}"
    }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting AI Resume Analyzer Flask Backend on http://127.0.0.1:{port}...")
    try:
        app.run(host="127.0.0.1", port=port, debug=True)
    except OSError as err:
        if "10048" in str(err) or "address already in use" in str(err).lower():
            fallback_port = 5001
            print(f"Port {port} is busy. Automatically starting on http://127.0.0.1:{fallback_port}...")
            app.run(host="127.0.0.1", port=fallback_port, debug=True)
        else:
            raise err
