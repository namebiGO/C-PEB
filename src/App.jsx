import React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SEO from './components/SEO'
import ScrollToTop from './components/ScrollToTop'

// Home sections
import HeroSection from './components/HeroSection'
import TrustBadges from './components/TrustBadges'
import WhyChooseUs from './components/WhyChooseUs'
import Features from './components/Features'
import Categories from './components/Categories'
import TopInfluencers from './components/TopInfluencers'
import LatestServices from './components/LatestServices'
import WorkingProcess from './components/WorkingProcess'
import AffiliatePayments from './components/AffiliatePayments'
import FAQSection from './components/FAQSection'
import TestimonialsScroll from './components/TestimonialsScroll'
import Chatbot from './components/chatbot/Chatbot'

// Content pages (all live)
import StartupSupport from './pages/StartupSupport'
import BusinessServices from './pages/BusinessServices'
import Contact from './pages/Contact'
import About from './pages/About'
import JoinCreator from './pages/JoinCreator'
import ToolsHub from './pages/tools/ToolsHub'
import ROICalculator from './pages/tools/ROICalculator'
import FundingChecker from './pages/tools/FundingChecker'
import CaseStudies from './pages/CaseStudies'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import CookiePolicy from './pages/legal/CookiePolicy'
import NotFound from './pages/NotFound'
import CategoryInfluencers from './pages/influencers/CategoryInfluencers'

// Service pages — coming soon
import ComingSoon from './pages/ComingSoon'
import useScrollReveal from './hooks/useScrollReveal'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'
import Login from './pages/admin/Login'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'

// Creator Pages
import CreatorLogin from './pages/creators/CreatorLogin'
import CreatorRegister from './pages/creators/CreatorRegister'
import CreatorApply from './pages/creators/CreatorApply'
import CreatorDashboard from './pages/creators/CreatorDashboard'
import CreatorOnboarding from './pages/creators/CreatorOnboarding'
import CreatorProtectedRoute from './components/creators/CreatorProtectedRoute'
import ForCreators from './pages/creators/ForCreators'
import PublicCreatorProfile from './pages/creators/PublicCreatorProfile'
import AdminInfluencers from './pages/admin/Influencers'
import AdminCreators from './pages/admin/AdminCreators'
import AdminCreatorOrder from './pages/admin/AdminCreatorOrder'
import AdminCreatorReview from './pages/admin/AdminCreatorReview'
import AdminServices from './pages/admin/Services'
import AdminHomepage from './pages/admin/Homepage'
import AdminLeads from './pages/admin/Leads'
import AdminAdvisory from './pages/admin/AdminAdvisory'
import AdminSettings from './pages/admin/Settings'
import StartupAdvisory from './pages/StartupAdvisory'

const HomePage = () => (
  <main>
    <SEO 
      title="C-PEB | Let's Change the Game for Indian Startups" 
      description="C-PEB is India's leading platform connecting funded startups with premium creators, while providing the operational and compliance backbone your business needs." 
    />
    <HeroSection />
    <TrustBadges />
    <div className="reveal"><WhyChooseUs /></div>
    <div className="reveal"><Features /></div>
    <div className="reveal"><WorkingProcess /></div>
    <div className="reveal"><Categories /></div>
    <div className="reveal"><TopInfluencers /></div>
    <div className="reveal"><LatestServices /></div>
    <div className="reveal"><FAQSection /></div>
    <div className="reveal"><TestimonialsScroll /></div>
    <div className="reveal"><AffiliatePayments /></div>
  </main>
)

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
    <Chatbot />
  </>
);

function App() {
  useScrollReveal(); // Initialize scroll animations globally
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        
        {/* ── Admin Routes ── */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="influencers" element={<AdminInfluencers />} />
            <Route path="creators" element={<AdminCreators />} />
            <Route path="creators/order" element={<AdminCreatorOrder />} />
            <Route path="creators/:id" element={<AdminCreatorReview />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="advisory" element={<AdminAdvisory />} />
            {/* Fallbacks */}
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* ── Public Routes ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* Dedicated Startup & Business Advisory Service Page */}
          <Route path="/startup-business-advisory" element={<StartupAdvisory />} />

          {/* Services — Startup & Business live; others coming soon */}
          <Route path="/services/startup-support"   element={<StartupSupport />} />
          <Route path="/services/business-services" element={<BusinessServices />} />
          <Route path="/services/brand-promotion"   element={<ComingSoon />} />
          <Route path="/services/digital-marketing" element={<ComingSoon />} />

          {/* Content pages */}
          <Route path="/coming-soon"  element={<ComingSoon />} />
          <Route path="/pricing"      element={<Navigate to="/startup-business-advisory" replace />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/about"        element={<About />} />
          <Route path="/creators"     element={<ForCreators />} />
          <Route path="/creators/:slug" element={<PublicCreatorProfile />} />

          <Route path="/for-creators" element={<ForCreators />} />
          <Route path="/for-creators/join" element={<JoinCreator />} />
          <Route path="/join-creator" element={<JoinCreator />} />

          <Route path="/influencers/:category" element={<CategoryInfluencers />} />


          <Route path="/tools"                 element={<ToolsHub />} />
          <Route path="/tools/roi-calculator"  element={<ROICalculator />} />
          <Route path="/tools/funding-checker" element={<FundingChecker />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms"   element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />

          {/* ── Creator Auth & Dashboard Routes ── */}
          <Route path="/for-creators/login"    element={<CreatorLogin />} />
          <Route path="/for-creators/register" element={<CreatorApply />} />
          
          <Route element={<CreatorProtectedRoute />}>
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/creator/onboarding" element={<CreatorOnboarding />} />
          </Route>

          {/* Catch-all — must be last */}
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
