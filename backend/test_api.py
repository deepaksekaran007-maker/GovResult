import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_all_endpoints():
    print("--- TESTING BACKEND ENDPOINTS ---")
    
    # 1. Health check
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] Health Check")

    # 2. Demo login Arun Kumar
    res = client.post("/api/auth/demo-login/student1")
    assert res.status_code == 200, f"Demo login student1 failed: {res.text}"
    arun_token = res.json()["access_token"]
    arun_student_id = res.json()["student_id"]
    headers_arun = {"Authorization": f"Bearer {arun_token}"}
    print(f"[PASS] Demo Login Arun Kumar (Student ID: {arun_student_id})")

    # 3. Search Result
    res = client.post("/api/results/search", json={"registration_number": "TN202612089", "examination_year": 2026})
    assert res.status_code == 200, f"Search result failed: {res.text}"
    result_data = res.json()
    assert result_data["overall_percentage"] == 84.2, f"Expected 84.2%, got {result_data['overall_percentage']}"
    assert result_data["result_status"] == "PASS"
    print(f"[PASS] Result Search (Found: {result_data['student_name']} - {result_data['overall_percentage']}%)")

    # 4. Result Analysis
    res = client.get(f"/api/results/{result_data['id']}/analysis")
    assert res.status_code == 200, f"Analysis failed: {res.text}"
    analysis_data = res.json()
    assert analysis_data["highest_mark_subject"]["subject_name"] == "Computer Science"
    assert analysis_data["passed_subjects_count"] == 5
    print(f"[PASS] Result Analysis (Highest Subject: {analysis_data['highest_mark_subject']['subject_name']})")

    # 5. Opportunities Engine
    res = client.get(f"/api/opportunities/eligible/{arun_student_id}")
    assert res.status_code == 200, f"Opportunities failed: {res.text}"
    opps = res.json()
    assert len(opps) > 0
    print(f"[PASS] Opportunities Engine (Found {len(opps)} opportunities, Top: {opps[0]['title']} -> {opps[0]['student_eligibility_status']})")

    # 6. Revaluation & Supplementary
    res = client.get(f"/api/revaluation/{result_data['examination_id']}")
    assert res.status_code == 200
    print("[PASS] Revaluation API")

    res = client.get(f"/api/supplementary/{result_data['examination_id']}")
    assert res.status_code == 200
    print("[PASS] Supplementary API")

    # 7. Deadlines & Reminders
    res = client.get("/api/deadlines", headers=headers_arun)
    assert res.status_code == 200
    deadlines = res.json()
    assert len(deadlines) > 0
    print(f"[PASS] Deadlines API ({len(deadlines)} deadlines found)")

    # Set a reminder
    res = client.post("/api/deadlines/reminders", json={"deadline_id": deadlines[0]["id"], "reminder_type": "3_DAYS_BEFORE"}, headers=headers_arun)
    assert res.status_code == 200
    print("[PASS] Set Reminder API")

    # 8. Documents Checklist
    res = client.get("/api/documents", headers=headers_arun)
    assert res.status_code == 200
    docs = res.json()
    assert len(docs) > 0
    print(f"[PASS] Documents API ({len(docs)} document requirements)")

    # 9. Next Steps Engine
    res = client.get(f"/api/next-steps/{arun_student_id}")
    assert res.status_code == 200
    next_steps = res.json()
    assert len(next_steps["action_plan"]) > 0
    print(f"[PASS] Personalized Next Steps Engine ({len(next_steps['action_plan'])} steps generated)")

    # 10. AI Assistant Chat
    res = client.post("/api/ai/chat", json={"message": "What is my strongest subject?", "student_id": arun_student_id}, headers=headers_arun)
    assert res.status_code == 200
    ai_reply = res.json()
    assert "Computer Science" in ai_reply["reply"] or "Subject Performance Analysis" in ai_reply["reply"]
    print(f"[PASS] AI Assistant Chat (Verified Grounded Response Generated)")

    # 11. Admin Demo Login & Overview
    res = client.post("/api/auth/demo-login/admin")
    assert res.status_code == 200
    admin_token = res.json()["access_token"]
    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    
    res = client.get("/api/admin/overview", headers=headers_admin)
    assert res.status_code == 200
    print(f"[PASS] Admin Portal Overview (Total Students: {res.json()['total_students']})")

    # 12. Student 2 (Priya Sharma - Compartment scenario)
    res = client.post("/api/auth/demo-login/student2")
    assert res.status_code == 200
    priya_student_id = res.json()["student_id"]
    
    res = client.get(f"/api/next-steps/{priya_student_id}")
    assert res.status_code == 200
    priya_plan = res.json()
    assert any(step["category"] == "SUPPLEMENTARY" for step in priya_plan["action_plan"]), "Expected Supplementary step for Priya!"
    print(f"[PASS] Supplementary Scenario Verified for Priya Sharma!")

    print("\n--- ALL BACKEND TEST SUITES PASSED! ---")

if __name__ == "__main__":
    test_all_endpoints()
