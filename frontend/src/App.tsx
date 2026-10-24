import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingAIWidget } from './components/ai/FloatingAIWidget';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResultSearchPage } from './pages/ResultSearchPage';
import { ResultDetailPage } from './pages/ResultDetailPage';
import { SmartAnalysisPage } from './pages/SmartAnalysisPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { RevaluationPage } from './pages/RevaluationPage';
import { DeadlinesPage } from './pages/DeadlinesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { NextStepsPage } from './pages/NextStepsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AdminPortal } from './pages/AdminPortal';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/results" element={<ResultSearchPage />} />
              <Route path="/results/:id" element={<ResultDetailPage />} />
              <Route path="/analysis" element={<SmartAnalysisPage />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="/revaluation" element={<RevaluationPage />} />
              <Route path="/deadlines" element={<DeadlinesPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/next-steps" element={<NextStepsPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <FloatingAIWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
