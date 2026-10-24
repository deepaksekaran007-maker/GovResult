from typing import List, Dict, Any, Optional
from app.models.entities import Result, ResultSubject

def compute_grade(percentage: float) -> str:
    if percentage >= 90:
        return "A1"
    elif percentage >= 80:
        return "A2"
    elif percentage >= 70:
        return "B1"
    elif percentage >= 60:
        return "B2"
    elif percentage >= 50:
        return "C1"
    elif percentage >= 40:
        return "C2"
    elif percentage >= 35:
        return "D"
    else:
        return "F"

def calculate_result_analysis(result: Result, subjects: List[ResultSubject]) -> Dict[str, Any]:
    if not subjects:
        return {
            "result_id": result.id,
            "student_name": result.student.user.full_name if result.student and result.student.user else "Student",
            "registration_number": result.registration_number,
            "examination_name": result.examination.name if result.examination else "Examination",
            "year": result.examination.year if result.examination else 2026,
            "result_status": result.result_status,
            "overall_percentage": result.overall_percentage,
            "overall_grade": result.overall_grade,
            "performance_band": "N/A",
            "highest_mark_subject": None,
            "lowest_mark_subject": None,
            "average_mark": 0.0,
            "total_subjects": 0,
            "passed_subjects_count": 0,
            "failed_subjects_count": 0,
            "strong_subjects": [],
            "improvement_areas": [],
            "performance_summary": "No subject marks available.",
            "key_takeaways": []
        }

    total_obtained = sum(s.obtained_marks for s in subjects)
    total_max = sum(s.max_marks for s in subjects)
    overall_percentage = round((total_obtained / total_max) * 100, 2) if total_max > 0 else 0.0
    overall_grade = compute_grade(overall_percentage)
    
    passed_subjects = [s for s in subjects if s.status.upper() == "PASS" and s.obtained_marks >= (s.max_marks * 0.35)]
    failed_subjects = [s for s in subjects if s.status.upper() == "FAIL" or s.obtained_marks < (s.max_marks * 0.35)]
    
    avg_mark = round(total_obtained / len(subjects), 2)
    
    # Sort subjects by percentage
    sorted_subjects = sorted(subjects, key=lambda s: (s.obtained_marks / s.max_marks if s.max_marks > 0 else 0), reverse=True)
    
    highest_s = sorted_subjects[0]
    lowest_s = sorted_subjects[-1]
    
    highest_pct = round((highest_s.obtained_marks / highest_s.max_marks) * 100, 2) if highest_s.max_marks > 0 else 0
    lowest_pct = round((lowest_s.obtained_marks / lowest_s.max_marks) * 100, 2) if lowest_s.max_marks > 0 else 0

    highest_highlight = {
        "subject_name": highest_s.subject_name,
        "subject_code": highest_s.subject_code,
        "obtained_marks": highest_s.obtained_marks,
        "max_marks": highest_s.max_marks,
        "percentage": highest_pct,
        "grade": highest_s.grade or compute_grade(highest_pct),
        "reason": f"Top performing subject with {highest_pct}% marks."
    }

    lowest_highlight = {
        "subject_name": lowest_s.subject_name,
        "subject_code": lowest_s.subject_code,
        "obtained_marks": lowest_s.obtained_marks,
        "max_marks": lowest_s.max_marks,
        "percentage": lowest_pct,
        "grade": lowest_s.grade or compute_grade(lowest_pct),
        "reason": "Needs attention or eligible for revaluation/supplementary improvement." if lowest_pct < 40 else f"Lowest relative score at {lowest_pct}%."
    }

    # Strong subjects: >= 80% or >= average + 5
    strong_list = []
    for s in sorted_subjects:
        pct = round((s.obtained_marks / s.max_marks) * 100, 2) if s.max_marks > 0 else 0
        if pct >= 80 or (pct >= avg_mark and pct >= 70):
            strong_list.append({
                "subject_name": s.subject_name,
                "subject_code": s.subject_code,
                "obtained_marks": s.obtained_marks,
                "max_marks": s.max_marks,
                "percentage": pct,
                "grade": s.grade or compute_grade(pct),
                "reason": f"Scored {s.obtained_marks:.0f}/{s.max_marks:.0f} ({pct}%) showcasing strong conceptual clarity."
            })

    # Improvement areas: Failed subjects OR subjects < 75%
    improvement_list = []
    for s in reversed(sorted_subjects):
        pct = round((s.obtained_marks / s.max_marks) * 100, 2) if s.max_marks > 0 else 0
        is_fail = s in failed_subjects
        if is_fail:
            improvement_list.append({
                "subject_name": s.subject_name,
                "subject_code": s.subject_code,
                "obtained_marks": s.obtained_marks,
                "max_marks": s.max_marks,
                "percentage": pct,
                "grade": "F",
                "reason": f"Compartment/Failed ({s.obtained_marks:.0f}/{s.max_marks:.0f}). Eligible for Supplementary Exam or Revaluation."
            })
        elif pct < 75 and len(improvement_list) < 2:
            improvement_list.append({
                "subject_name": s.subject_name,
                "subject_code": s.subject_code,
                "obtained_marks": s.obtained_marks,
                "max_marks": s.max_marks,
                "percentage": pct,
                "grade": s.grade or compute_grade(pct),
                "reason": f"Scope for mark improvement or revaluation check ({s.obtained_marks:.0f}/{s.max_marks:.0f})."
            })

    # Determine Performance Band
    if len(failed_subjects) > 0:
        band = "Compartment / Needs Supplementary"
        summary = f"Student secured {overall_percentage}% with {len(passed_subjects)} passed subjects and {len(failed_subjects)} subject requiring supplementary examination."
    elif overall_percentage >= 75:
        band = "Distinction / First Class with Exemplary Marks"
        summary = f"Exceptional performance! Student secured {overall_percentage}% (Grade {overall_grade}) with distinction across {len(strong_list)} subjects."
    elif overall_percentage >= 60:
        band = "First Class"
        summary = f"Solid performance! Student achieved First Class with {overall_percentage}% (Grade {overall_grade})."
    elif overall_percentage >= 50:
        band = "Second Class"
        summary = f"Student cleared the examination in Second Class with {overall_percentage}%."
    else:
        band = "Pass Class"
        summary = f"Student cleared all subjects with {overall_percentage}%."

    key_takeaways = [
        f"Overall result: {result.result_status} ({overall_percentage}%, Grade {overall_grade})",
        f"Strongest area: {highest_s.subject_name} ({highest_s.obtained_marks:.0f}/{highest_s.max_marks:.0f})",
        f"Passed in {len(passed_subjects)} of {len(subjects)} subjects",
    ]
    if failed_subjects:
        key_takeaways.append(f"Immediate action needed for {len(failed_subjects)} failed subject: Apply for Supplementary Exam or Revaluation.")
    else:
        key_takeaways.append("Eligible for higher education admissions and merit-based state/national scholarships.")

    return {
        "result_id": result.id,
        "student_name": result.student.user.full_name if result.student and result.student.user else "Student",
        "registration_number": result.registration_number,
        "examination_name": result.examination.name if result.examination else "Examination",
        "year": result.examination.year if result.examination else 2026,
        "result_status": result.result_status,
        "overall_percentage": overall_percentage,
        "overall_grade": overall_grade,
        "performance_band": band,
        "highest_mark_subject": highest_highlight,
        "lowest_mark_subject": lowest_highlight,
        "average_mark": avg_mark,
        "total_subjects": len(subjects),
        "passed_subjects_count": len(passed_subjects),
        "failed_subjects_count": len(failed_subjects),
        "strong_subjects": strong_list,
        "improvement_areas": improvement_list,
        "performance_summary": summary,
        "key_takeaways": key_takeaways
    }
