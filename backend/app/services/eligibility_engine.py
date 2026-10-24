from typing import List, Dict, Any, Tuple
from app.models.entities import Opportunity, Result, ResultSubject, Student

def evaluate_opportunity_eligibility(
    opportunity: Opportunity,
    result: Result,
    subjects: List[ResultSubject],
    student: Student
) -> Tuple[str, List[str]]:
    """
    Evaluates student eligibility for an opportunity.
    Returns (status: 'ELIGIBLE' | 'CHECK_REQUIRED' | 'NOT_ELIGIBLE', reasons: List[str])
    Never makes assumptions or invents criteria.
    """
    reasons: List[str] = []
    
    # 1. Verification status of the opportunity itself
    if opportunity.verification_status != "VERIFIED":
        return "CHECK_REQUIRED", ["This opportunity is under administrative verification. Please verify latest criteria with official authority."]

    # If student has no result yet
    if not result:
        return "CHECK_REQUIRED", ["No published examination result linked to evaluate against."]

    # Calculate metrics
    pct = result.overall_percentage
    failed_count = sum(1 for s in subjects if s.status.upper() == "FAIL" or s.obtained_marks < (s.max_marks * 0.35))
    subject_map = {s.subject_name.lower(): s for s in subjects}

    is_eligible = True
    needs_manual_check = False

    # 2. Check stream requirement if defined
    if opportunity.stream_requirement and opportunity.stream_requirement.lower() != "any":
        req_stream = opportunity.stream_requirement.lower()
        student_stream = (student.stream or "").lower()
        if student_stream and req_stream not in student_stream:
            is_eligible = False
            reasons.append(f"Requires {opportunity.stream_requirement} stream (Your profile stream is {student.stream or 'General'}).")

    # 3. Check baseline min percentage
    if opportunity.min_percentage > 0:
        if pct < opportunity.min_percentage:
            is_eligible = False
            reasons.append(f"Requires minimum {opportunity.min_percentage}% overall marks (Your score: {pct}%).")
        else:
            reasons.append(f"✓ Meets minimum aggregate requirement ({pct}% >= {opportunity.min_percentage}%).")

    # 4. Check specific eligibility rules in DB
    if hasattr(opportunity, "rules") and opportunity.rules:
        for rule in opportunity.rules:
            rtype = rule.rule_type.upper()
            val = rule.condition_value
            op = rule.condition_operator.upper()

            if rtype == "RESULT_STATUS":
                if val.upper() == "PASS" and result.result_status != "PASS":
                    is_eligible = False
                    reasons.append(f"Requires clean PASS in all subjects (Current status: {result.result_status}).")
            
            elif rtype == "MAX_FAILS":
                try:
                    max_allowed = int(val)
                    if failed_count > max_allowed:
                        is_eligible = False
                        reasons.append(f"Allowed failed subjects: {max_allowed} (You have {failed_count}).")
                except ValueError:
                    needs_manual_check = True

            elif rtype == "MIN_SUBJECT_MARK":
                # condition_key is subject name (e.g. "Mathematics", "English")
                key = (rule.condition_key or "").lower()
                matched_subj = None
                for s_name, s_obj in subject_map.items():
                    if key in s_name:
                        matched_subj = s_obj
                        break
                
                if matched_subj:
                    try:
                        req_marks = float(val)
                        if matched_subj.obtained_marks < req_marks:
                            is_eligible = False
                            reasons.append(f"Requires at least {req_marks} marks in {matched_subj.subject_name} (Your score: {matched_subj.obtained_marks:.0f}).")
                        else:
                            reasons.append(f"✓ Cleared {matched_subj.subject_name} requirement ({matched_subj.obtained_marks:.0f}/{matched_subj.max_marks:.0f}).")
                    except ValueError:
                        needs_manual_check = True
                else:
                    # Subject not taken or unclear
                    needs_manual_check = True
                    reasons.append(f"Subject requirement ({rule.condition_key}) verification required.")

            elif rtype in ("CATEGORY_MATCH", "INCOME_LIMIT"):
                needs_manual_check = True
                if rule.explanation:
                    reasons.append(f"Certificate Verification: {rule.explanation}")
                else:
                    reasons.append("Requires valid income/caste certificate verification at time of application.")

    # 5. Evaluate final status
    if not is_eligible:
        return "NOT_ELIGIBLE", reasons
    elif needs_manual_check:
        return "CHECK_REQUIRED", reasons
    else:
        if not reasons:
            reasons.append("✓ Meets all verified eligibility conditions for this program.")
        return "ELIGIBLE", reasons
