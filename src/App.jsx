import React, { lazy, Suspense } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SEO from './components/SEO'
import ScrollToTop from './components/ScrollToTop'

// Home sections — eagerly loaded (above the fold, needed immediately)
import HeroSection from './components/HeroSection'
import TrustBadges from './components/TrustBadges'
import HomeServices from './components/HomeServices'
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
import useScrollReveal from './hooks/useScrollReveal'

// --- Route-level lazy loading (loaded only when the route is visited) ---

// Content pages
const StartupSupport    = lazy(() => import('./pages/StartupSupport'))
const BusinessServices  = lazy(() => import('./pages/BusinessServices'))
const Contact           = lazy(() => import('./pages/Contact'))
const About             = lazy(() => import('./pages/About'))
const Careers           = lazy(() => import('./pages/Careers'))
const JoinCreator       = lazy(() => import('./pages/JoinCreator'))
const ToolsHub          = lazy(() => import('./pages/tools/ToolsHub'))
const ROICalculator     = lazy(() => import('./pages/tools/ROICalculator'))
const FundingChecker    = lazy(() => import('./pages/tools/FundingChecker'))
const CaseStudies       = lazy(() => import('./pages/CaseStudies'))
const PrivacyPolicy     = lazy(() => import('./pages/legal/PrivacyPolicy'))
const TermsOfService    = lazy(() => import('./pages/legal/TermsOfService'))
const CookiePolicy      = lazy(() => import('./pages/legal/CookiePolicy'))
const NotFound          = lazy(() => import('./pages/NotFound'))
const CategoryInfluencers = lazy(() => import('./pages/influencers/CategoryInfluencers'))
const ComingSoon        = lazy(() => import('./pages/ComingSoon'))
const StartupAdvisory   = lazy(() => import('./pages/StartupAdvisory'))

// Admin pages (heavy — only loaded when accessed)
const AdminLayout       = lazy(() => import('./pages/admin/AdminLayout'))
const Login             = lazy(() => import('./pages/admin/Login'))
const ProtectedRoute    = lazy(() => import('./components/admin/ProtectedRoute'))
const Dashboard         = lazy(() => import('./pages/admin/Dashboard'))
const AdminInfluencers  = lazy(() => import('./pages/admin/Influencers'))
const AdminCreators     = lazy(() => import('./pages/admin/AdminCreators'))
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'))
const AdminUsers        = lazy(() => import('./pages/admin/AdminUsers'))
const AdminCreatorOrder = lazy(() => import('./pages/admin/AdminCreatorOrder'))
const AdminCreatorReview = lazy(() => import('./pages/admin/AdminCreatorReview'))
const AdminServices     = lazy(() => import('./pages/admin/Services'))
const AdminHomepage     = lazy(() => import('./pages/admin/Homepage'))
const AdminLeads        = lazy(() => import('./pages/admin/Leads'))
const AdminContacts     = lazy(() => import('./pages/admin/AdminContacts'))
const AdminAdvisory     = lazy(() => import('./pages/admin/AdminAdvisory'))
const AdminSettings     = lazy(() => import('./pages/admin/Settings'))
const AdminAnalytics    = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminQueries      = lazy(() => import('./pages/admin/AdminQueries'))
const AdminQueryDetail  = lazy(() => import('./pages/admin/AdminQueryDetail'))
const AdminActivityLog  = lazy(() => import('./pages/admin/AdminActivityLog'))
const AdminPayments     = lazy(() => import('./pages/admin/AdminPayments'))

// Creator pages
const CreatorLogin      = lazy(() => import('./pages/creators/CreatorLogin'))
const CreatorApply      = lazy(() => import('./pages/creators/CreatorApply'))
const CreatorDashboard  = lazy(() => import('./pages/creators/CreatorDashboard'))
const CreatorOnboarding = lazy(() => import('./pages/creators/CreatorOnboarding'))
const CreatorProtectedRoute = lazy(() => import('./components/creators/CreatorProtectedRoute'))
const ForCreators       = lazy(() => import('./pages/creators/ForCreators'))
const PublicCreatorProfile = lazy(() => import('./pages/creators/PublicCreatorProfile'))

// Minimal loading fallback — no layout shift
const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#17a85a', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

const HomePage = () => (
  <main>
    <SEO 
      title="C-PEB | Let's Change the Game for Indian Startups" 
      description="C-PEB is India's leading platform connecting funded startups with premium creators, while providing the operational and compliance backbone your business needs." 
    />
    <HeroSection />
    <TrustBadges />
    <div className="reveal"><HomeServices /></div>
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          
          {/* ── Admin Routes ── */}
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="influencers" element={<AdminInfluencers />} />
              <Route path="creators" element={<AdminCreators />} />
              <Route path="creators/applications" element={<AdminApplications />} />
              <Route path="creators/order" element={<AdminCreatorOrder />} />
              <Route path="creators/:id" element={<AdminCreatorReview />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="homepage" element={<AdminHomepage />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="advisory" element={<AdminAdvisory />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="queries" element={<AdminQueries />} />
              <Route path="queries/:id" element={<AdminQueryDetail />} />
              <Route path="activity" element={<AdminActivityLog />} />
              <Route path="payments" element={<AdminPayments />} />
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
            <Route path="/careers"      element={<Careers />} />
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
      </Suspense>
    </>
  )
}

export default App
