const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("govresult_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Registration failed");
    }
    return res.json();
  },

  async login(data: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login failed");
    }
    return res.json();
  },

  async demoLogin(type: "student1" | "student2" | "admin") {
    const res = await fetch(`${API_BASE}/auth/demo-login/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Demo login failed");
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  },

  // Examinations
  async getExaminations() {
    const res = await fetch(`${API_BASE}/examinations`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch examinations");
    return res.json();
  },

  // Results & Analysis
  async searchResult(data: { registration_number: string; examination_year?: number; roll_number?: string; captcha?: string }) {
    const res = await fetch(`${API_BASE}/results/search`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "No examination result found for this registration number.");
    }
    return res.json();
  },

  async getResultById(id: number) {
    const res = await fetch(`${API_BASE}/results/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load result");
    return res.json();
  },

  async getResultAnalysis(id: number) {
    const res = await fetch(`${API_BASE}/results/${id}/analysis`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load result analysis");
    return res.json();
  },

  async getStudentLatestResult(studentId: number) {
    const res = await fetch(`${API_BASE}/results/student/${studentId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("No result found for student");
    return res.json();
  },

  // Opportunities
  async getOpportunities(category?: string, search?: string, studentId?: number) {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    if (studentId) params.append("student_id", studentId.toString());

    const url = `${API_BASE}/opportunities?${params.toString()}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch opportunities");
    return res.json();
  },

  // Revaluation & Supplementary
  async getRevaluation(examId: number = 1) {
    const res = await fetch(`${API_BASE}/revaluation/${examId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch revaluation info");
    return res.json();
  },

  async getSupplementary(examId: number = 1) {
    const res = await fetch(`${API_BASE}/supplementary/${examId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch supplementary info");
    return res.json();
  },

  // Deadlines & Reminders
  async getDeadlines() {
    const res = await fetch(`${API_BASE}/deadlines`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch deadlines");
    return res.json();
  },

  async setReminder(deadlineId: number, reminderType: string = "3_DAYS_BEFORE") {
    const res = await fetch(`${API_BASE}/deadlines/reminders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ deadline_id: deadlineId, reminder_type: reminderType })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to set reminder");
    }
    return res.json();
  },

  async removeReminder(deadlineId: number) {
    const res = await fetch(`${API_BASE}/deadlines/reminders/${deadlineId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to remove reminder");
    return res.json();
  },

  // Documents
  async getDocuments() {
    const res = await fetch(`${API_BASE}/documents`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  },

  async updateDocumentStatus(documentId: number, status: "READY" | "PENDING", notes?: string) {
    const res = await fetch(`${API_BASE}/documents/status`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ document_id: documentId, status, notes })
    });
    if (!res.ok) throw new Error("Failed to update document status");
    return res.json();
  },

  // Next Steps
  async getNextSteps(studentId: number) {
    const res = await fetch(`${API_BASE}/next-steps/${studentId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch next steps plan");
    return res.json();
  },

  // AI Assistant
  async sendAIChat(message: string, studentId?: number, conversationId?: number) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, student_id: studentId, conversation_id: conversationId })
    });
    if (!res.ok) throw new Error("AI service temporarily unavailable");
    return res.json();
  },

  // Admin Portal
  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Admin access required");
    return res.json();
  },

  async createOpportunity(data: any) {
    const res = await fetch(`${API_BASE}/admin/opportunities`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create opportunity");
    return res.json();
  },

  async deleteOpportunity(id: number) {
    const res = await fetch(`${API_BASE}/admin/opportunities/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete opportunity");
    return res.json();
  },

  async createDeadline(data: any) {
    const res = await fetch(`${API_BASE}/admin/deadlines`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create deadline");
    return res.json();
  }
};
