import os
import sqlite3
import json
from typing import Dict, Any, Optional, List
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "resume_analyzer.db")


def get_db_connection() -> sqlite3.Connection:
    """Create and return a row-mapped SQLite connection."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_db():
    """Context manager for SQLite connections that guarantees commit and closing."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _safe_json_loads(val: Any, default: Any) -> Any:
    """Safely parse JSON strings or return the default/existing data structure."""
    if val is None:
        return default
    if isinstance(val, (dict, list)):
        return val
    try:
        return json.loads(val)
    except (json.JSONDecodeError, TypeError):
        return default


def init_db() -> None:
    """Initialize the SQLite database schema if not already present."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resume_filename TEXT NOT NULL,
                job_title TEXT,
                ats_score INTEGER NOT NULL,
                score_breakdown TEXT NOT NULL,
                matched_skills TEXT NOT NULL,
                missing_skills TEXT NOT NULL,
                keywords TEXT NOT NULL,
                strengths TEXT NOT NULL,
                weaknesses TEXT NOT NULL,
                recommendations TEXT NOT NULL,
                summary TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_analysis(record: Dict[str, Any]) -> int:
    """
    Save an analysis result record to SQLite and return the generated ID.
    JSON fields are serialized automatically.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO analyses (
                resume_filename,
                job_title,
                ats_score,
                score_breakdown,
                matched_skills,
                missing_skills,
                keywords,
                strengths,
                weaknesses,
                recommendations,
                summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(record.get("resume_filename", "resume.pdf")),
            str(record.get("job_title", "")),
            int(record.get("ats_score", 0)),
            json.dumps(record.get("score_breakdown", {})),
            json.dumps(record.get("matched_skills", [])),
            json.dumps(record.get("missing_skills", [])),
            json.dumps(record.get("keywords", [])),
            json.dumps(record.get("strengths", [])),
            json.dumps(record.get("weaknesses", [])),
            json.dumps(record.get("recommendations", [])),
            str(record.get("summary", ""))
        ))
        return int(cursor.lastrowid or 0)


def get_analysis_by_id(analysis_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve an analysis record by its primary key ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,))
        row = cursor.fetchone()
        if not row:
            return None

        return {
            "id": row["id"],
            "analysis_id": row["id"],
            "resume_filename": row["resume_filename"],
            "job_title": row["job_title"],
            "ats_score": row["ats_score"],
            "score_breakdown": _safe_json_loads(row["score_breakdown"], {}),
            "matched_skills": _safe_json_loads(row["matched_skills"], []),
            "missing_skills": _safe_json_loads(row["missing_skills"], []),
            "keywords": _safe_json_loads(row["keywords"], []),
            "strengths": _safe_json_loads(row["strengths"], []),
            "weaknesses": _safe_json_loads(row["weaknesses"], []),
            "recommendations": _safe_json_loads(row["recommendations"], []),
            "summary": row["summary"] or "",
            "created_at": str(row["created_at"]) if row["created_at"] else ""
        }


def get_recent_analyses(limit: int = 10) -> List[Dict[str, Any]]:
    """Retrieve recent analyses list."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, resume_filename, job_title, ats_score, created_at FROM analyses ORDER BY id DESC LIMIT ?",
            (limit,)
        )
        rows = cursor.fetchall()
        return [dict(r) for r in rows]


def delete_analysis(analysis_id: int) -> bool:
    """Delete an analysis record by ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM analyses WHERE id = ?", (analysis_id,))
        return cursor.rowcount > 0


def clear_all_analyses() -> bool:
    """Clear all analysis records from the database."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM analyses")
        try:
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='analyses'")
        except sqlite3.OperationalError:
            pass
        return True


if __name__ == "__main__":
    init_db()
    print("Database schema initialized and verified successfully at:", DB_PATH)
