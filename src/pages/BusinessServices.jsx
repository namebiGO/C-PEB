import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Search, ArrowLeft, X, ExternalLink, CheckCircle2, FileText,
  Clock, AlertCircle, ChevronRight, Bookmark, BookmarkCheck, Calculator,
  ChevronDown, ChevronUp, Star, Zap, Shield, TrendingUp,
} from 'lucide-react';
import './BusinessServices.css';
import SEO from '../components/SEO';

/* ═══════════════════════════════════════
   BADGE CONFIG
═══════════════════════════════════════ */
const BADGE_STYLES = {
  'Government':    { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'Popular':       { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
  'Free':          { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  'Fast':          { bg: '#fdf4ff', color: '#7c3aed', border: '#e9d5ff' },
  'No Collateral': { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
};

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'loans', name: 'Loans & Funding', color: '#10b981',
    desc: 'Get funding to start, run, or expand your business',
    popular: ['MSME Business Loan', 'Mudra Loan', 'Working Capital Loan'],
    services: [
      {
        id: 'msme-loan', name: 'MSME Business Loan', isLoan: true,
        tagline: 'Collateral-free loans up to ₹2 Crore for MSMEs',
        tags: ['Popular', 'No Collateral'],
        whoFor: 'Registered MSMEs with 1+ year of business operations',
        benefit: 'Quick disbursal, minimal documentation, competitive rates',
        docs: ['Udyam Registration Certificate', 'GST Certificate', 'Bank Statements (6 months)', 'ITR (2 years)', 'Business PAN & Aadhaar'],
        authority: 'SIDBI / Public Sector Banks / NBFCs',
        process: ['Apply online or at bank branch', 'Document verification by lender', 'Credit assessment & underwriting', 'Loan sanction & disbursal'],
        time: '7–21 working days', amount: 'Up to ₹2 Crore (varies by lender)',
        rate: 'From 8.5% p.a.', officialLink: 'https://www.sidbi.in',
        note: 'Loan amounts, rates, and eligibility are set by individual lenders. Always verify current terms directly.',
        faqs: [
          { q: 'Do I need collateral?', a: 'Under CGTMSE coverage, no collateral is required. Without coverage, lenders may ask for security depending on loan amount.' },
          { q: 'What credit score is needed?', a: 'Most lenders require CIBIL score of 700+ for MSMEs.' },
          { q: 'Can a new MSME apply?', a: 'Most lenders require at least 1–2 years of business vintage. New businesses may explore MUDRA or CGTMSE-backed loans.' },
        ],
        related: ['working-capital', 'cgtmse', 'mudra-loan'],
      },
      {
        id: 'working-capital', name: 'Working Capital Loan', isLoan: true,
        tagline: 'Short-term funds to manage day-to-day business operations',
        tags: ['Fast'],
        whoFor: 'Any registered business needing liquidity for operations',
        benefit: 'Flexible repayment, revolving credit options available',
        docs: ['Business Registration', 'GST Returns', 'Bank Statements (3–6 months)', 'Financial Statements'],
        authority: 'Banks / NBFCs',
        process: ['Identify suitable lender', 'Submit application & documents', 'Credit evaluation & sanction', 'Funds disbursed to account'],
        time: '3–14 working days', amount: 'Based on turnover & credit assessment',
        rate: 'From 10% p.a.', officialLink: 'https://www.rbi.org.in',
        note: 'Terms are lender-specific. Compare multiple lenders before choosing.',
        faqs: [
          { q: 'What is the difference between working capital and term loan?', a: 'Working capital loans cover short-term operational needs. Term loans are for longer-term investments like machinery or expansion.' },
          { q: 'Is overdraft facility available?', a: 'Yes. Many banks offer Cash Credit (CC) or Overdraft (OD) as revolving working capital facilities.' },
        ],
        related: ['msme-loan', 'cgtmse', 'expansion-loan'],
      },
      {
        id: 'mudra-loan', name: 'Mudra Loan (PMMY)', isLoan: true,
        tagline: 'Government-backed micro finance up to ₹20 Lakh',
        tags: ['Government', 'No Collateral', 'Popular'],
        whoFor: 'Non-farm income generating businesses, especially micro & small',
        benefit: 'No collateral required, low interest rates, government guarantee',
        docs: ['Aadhaar & PAN', 'Business Plan', 'Proof of Business', 'Bank Statements'],
        authority: 'Banks / MFIs / NBFCs under MUDRA Scheme (Ministry of Finance)',
        process: ['Visit nearest bank or mudra.org.in', 'Fill application & submit documents', 'Document verification', 'Loan sanction'],
        time: '7–30 working days', amount: 'Shishu: ≤₹50K | Kishore: ₹50K–5L | Tarun: ₹5L–20L',
        rate: 'Varies; typically below market rate', officialLink: 'https://www.mudra.org.in',
        note: 'Loan limits revised periodically. Check official MUDRA portal for current limits.',
        faqs: [
          { q: 'What are Shishu, Kishore, and Tarun?', a: 'Three tiers based on loan amount. Shishu (≤₹50K) for very early-stage, Kishore (₹50K–5L) for growing, Tarun (₹5L–20L) for more established businesses.' },
          { q: 'Is there a guarantee required?', a: 'No collateral or third-party guarantee required for MUDRA loans.' },
        ],
        related: ['msme-loan', 'pmegp', 'cgtmse'],
      },
      {
        id: 'cgtmse', name: 'CGTMSE Loan', isLoan: true,
        tagline: 'Credit guarantee scheme for collateral-free MSME loans',
        tags: ['Government', 'No Collateral'],
        whoFor: 'New or existing MSMEs requiring term loans or working capital',
        benefit: 'No collateral/third-party guarantee needed up to covered limit',
        docs: ['Udyam Certificate', 'Project Report', 'Bank Statements', 'KYC Documents'],
        authority: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
        process: ['Apply via member lending institution', 'Bank submits guarantee proposal to CGTMSE', 'Guarantee approved', 'Loan disbursed without collateral'],
        time: '15–45 working days', amount: 'Up to ₹5 Crore under guarantee cover',
        rate: 'Market rate + CGTMSE guarantee fee (0.37%–1.35% p.a.)', officialLink: 'https://www.cgtmse.in',
        note: 'Coverage limits and guarantee fee rates are subject to revision.',
        faqs: [
          { q: 'Does the borrower pay the guarantee fee?', a: 'Yes, the annual guarantee fee is typically passed on to the borrower as part of the effective interest rate.' },
        ],
        related: ['msme-loan', 'mudra-loan', 'udyam'],
      },
      {
        id: 'machinery-loan', name: 'Machinery Loan', isLoan: true,
        tagline: 'Finance to purchase plant, machinery, and equipment',
        tags: ['Fast'],
        whoFor: 'Manufacturing or equipment-based businesses',
        benefit: 'Loan secured against machinery; preserves working capital',
        docs: ['Machinery Quotation/Invoice', 'Business Registration', 'GST Certificate', 'Bank Statements', 'ITR'],
        authority: 'Banks / NBFCs / SIDBI',
        process: ['Get vendor quotation', 'Apply with lender', 'Asset valuation & approval', 'Bank pays vendor directly'],
        time: '10–30 working days', amount: 'Up to 90% of machinery cost',
        rate: 'From 8% p.a. (asset-backed)', officialLink: 'https://www.sidbi.in',
        note: 'Lender-specific terms apply.',
        faqs: [
          { q: 'Can I get a loan for second-hand machinery?', a: 'Some lenders finance used machinery at a lower LTV ratio with a valuation report.' },
        ],
        related: ['msme-loan', 'expansion-loan', 'msme-schemes'],
      },
      {
        id: 'expansion-loan', name: 'Business Expansion Loan', isLoan: true,
        tagline: 'Capital to scale operations, open new locations, or enter new markets',
        tags: ['Popular'],
        whoFor: 'Established businesses with 2+ years of profitable operations',
        benefit: 'Higher loan amounts, longer tenure, structured repayment',
        docs: ['Audited Financials (3 years)', 'Business Plan / Expansion Plan', 'Tax Returns', 'Bank Statements'],
        authority: 'Banks / NBFCs / Private Equity',
        process: ['Prepare detailed expansion plan', 'Submit application to lender', 'Financial due diligence', 'Loan sanction & structured disbursal'],
        time: '15–60 working days', amount: 'Case-specific; based on financials',
        rate: 'From 9% p.a.', officialLink: 'https://www.sbi.co.in',
        note: 'Terms vary significantly by lender and business profile.',
        faqs: [
          { q: 'Do I need audited accounts?', a: 'Most banks require at least 2–3 years of audited financials for expansion loans.' },
        ],
        related: ['working-capital', 'startup-funding', 'consulting'],
      },
      {
        id: 'startup-funding', name: 'Startup Funding', isLoan: false,
        tagline: 'Angel investment, VC funding, and government startup grants',
        tags: ['Government', 'Popular'],
        whoFor: 'DPIIT-recognised startups with innovative business models',
        benefit: 'Equity or debt capital to scale; access to investor network',
        docs: ['DPIIT Recognition Certificate', 'Business Plan / Pitch Deck', 'Financial Projections', 'CAP Table'],
        authority: 'SIDBI Fund of Funds / Angel Networks / VCs / Startup India',
        process: ['Apply for DPIIT recognition', 'Connect with investors via Startup India portal', 'Pitch & due diligence', 'Term sheet & funding'],
        time: '2–12 months (highly variable)', amount: 'Seed: ₹10L–₹2Cr | Series A+: varies',
        rate: 'Equity dilution / grants (non-repayable)', officialLink: 'https://www.startupindia.gov.in',
        note: 'Funding availability and investor terms change frequently.',
        faqs: [
          { q: 'Is DPIIT recognition mandatory?', a: 'Not always, but it unlocks specific government schemes, tax benefits, and the Startup India platform.' },
          { q: 'What is the SIDBI Fund of Funds?', a: 'A government-backed fund that invests in VC/PE funds which then invest in startups — not directly in startups.' },
        ],
        related: ['startup-india', 'expansion-loan', 'consulting'],
      },
    ],
  },
  {
    id: 'govt-schemes', name: 'Government Schemes', color: '#3b82f6',
    desc: 'Subsidies, incentives, and support from central & state govts',
    popular: ['MSME Schemes', 'PMEGP', 'Startup India Schemes'],
    services: [
      {
        id: 'msme-schemes', name: 'MSME Schemes', isLoan: false,
        tagline: 'Central government support programmes for MSMEs',
        tags: ['Government', 'Popular', 'Free'],
        whoFor: 'All registered MSMEs (Udyam registered)',
        benefit: 'Subsidies, technology support, market access, credit facilitation',
        docs: ['Udyam Registration', 'GST Certificate', 'Bank Account Details'],
        authority: 'Ministry of MSME, Govt. of India',
        process: ['Obtain Udyam Registration', 'Identify applicable scheme on msme.gov.in', 'Apply via udyam/msme portal', 'Verification & benefit disbursal'],
        time: 'Scheme-specific', amount: 'Varies by scheme', rate: 'N/A',
        officialLink: 'https://msme.gov.in',
        note: 'Scheme availability and benefits change with budget cycles.',
        faqs: [
          { q: 'How do I find the right MSME scheme?', a: 'Visit msme.gov.in and use the scheme search tool, or contact your nearest District Industries Centre (DIC).' },
          { q: 'Is Udyam registration mandatory?', a: 'Yes, Udyam registration is mandatory for most MSME government schemes.' },
        ],
        related: ['udyam', 'subsidies', 'msme-loan'],
      },
      {
        id: 'startup-india', name: 'Startup India Schemes', isLoan: false,
        tagline: 'Government programme for innovation-driven startups',
        tags: ['Government', 'Popular'],
        whoFor: 'DPIIT-recognised startups (≤10 years old, turnover ≤₹100Cr)',
        benefit: 'Tax exemptions, IPR support, faster exit, fund of funds access',
        docs: ['Certificate of Incorporation', 'PAN', 'Startup description (innovation element)'],
        authority: 'DPIIT, Ministry of Commerce & Industry',
        process: ['Apply on Startup India portal', 'Receive DPIIT recognition', 'Access scheme-specific benefits'],
        time: '2–4 weeks for recognition', amount: 'Varies by benefit type', rate: 'N/A',
        officialLink: 'https://www.startupindia.gov.in',
        note: 'Benefit eligibility criteria and limits subject to policy updates.',
        faqs: [
          { q: 'What tax benefits does Startup India provide?', a: '3-year income tax exemption, exemption from angel tax, and capital gains exemption on reinvestment.' },
          { q: 'Can a 5-year-old company apply?', a: 'Yes, if incorporated within the last 10 years, turnover under ₹100 Crore, and working toward innovation.' },
        ],
        related: ['startup-funding', 'trademark', 'msme-schemes'],
      },
      {
        id: 'pmegp', name: 'PMEGP', isLoan: false,
        tagline: 'Subsidy-linked loan for new micro enterprises',
        tags: ['Government', 'Popular'],
        whoFor: 'Individual entrepreneurs 18+ years; 8th pass for projects above ₹10L (mfg)',
        benefit: 'Margin money subsidy of 15%–35% of project cost',
        docs: ['Project Report', 'EDP Training Certificate', 'Educational Certificates', 'Aadhaar & PAN'],
        authority: 'KVIC, Ministry of MSME',
        process: ['Apply on KVIC portal', 'Application reviewed by district committee', 'Bank sanction of loan', 'Subsidy released after 3-year lock-in'],
        time: '30–90 days', amount: 'Up to ₹50L (manufacturing); ₹20L (services) — check current limits',
        rate: 'Normal bank rate; subsidy reduces effective cost', officialLink: 'https://www.kviconline.gov.in/pmegpeportal',
        note: 'Project cost limits and subsidy rates revised periodically.',
        faqs: [
          { q: 'When is the subsidy released?', a: 'Subsidy is kept in a 3-year lock-in and released after successful completion of this period.' },
          { q: 'Is EDP training mandatory?', a: 'Yes. Entrepreneurship Development Programme training is mandatory before applying.' },
        ],
        related: ['msme-schemes', 'mudra-loan', 'subsidies'],
      },
      {
        id: 'subsidies', name: 'Business Subsidies', isLoan: false,
        tagline: 'Central & state government subsidies on capital, power, and technology',
        tags: ['Government', 'Free'],
        whoFor: 'MSMEs, manufacturing units, exporters (varies by subsidy)',
        benefit: 'Reduces upfront investment; improves business viability',
        docs: ['Udyam Registration', 'GST Certificate', 'Project/Investment details'],
        authority: 'Ministry of MSME / State Industries Departments',
        process: ['Identify applicable subsidy via DIC or state portal', 'Apply via state portal', 'Verification', 'Subsidy credited'],
        time: 'Varies by state and scheme', amount: 'Case-specific', rate: 'N/A',
        officialLink: 'https://msme.gov.in/schemes',
        note: 'State subsidy schemes vary significantly. Always verify with your District Industries Centre (DIC).',
        faqs: [
          { q: 'What is a District Industries Centre (DIC)?', a: 'A government office in each district that helps MSMEs access schemes, subsidies, and registrations.' },
        ],
        related: ['msme-schemes', 'state-schemes', 'udyam'],
      },
      {
        id: 'state-schemes', name: 'State Government Schemes', isLoan: false,
        tagline: 'State-specific incentives, subsidies, and industrial policies',
        tags: ['Government'],
        whoFor: 'Businesses registered in respective states',
        benefit: 'Land at concessional rates, power subsidies, stamp duty exemptions',
        docs: ['Business Registration', 'GST Certificate', 'Land/Lease Documents', 'Employment data'],
        authority: 'State Industries Department / State Investment Promotion Board',
        process: ['Check state industrial policy', 'Apply via state single-window portal', 'Verification & approval'],
        time: '30–180 days (state-specific)', amount: 'State-specific', rate: 'N/A',
        officialLink: 'https://invest.india.gov.in/state-profiles',
        note: 'Each state has its own industrial policy and incentive framework.',
        faqs: [
          { q: 'Where can I find my state\'s industrial policy?', a: 'Visit your state\'s industries department website, or use the Invest India portal (invest.india.gov.in).' },
        ],
        related: ['subsidies', 'msme-schemes', 'gem'],
      },
    ],
  },
  {
    id: 'tax', name: 'Tax & Accounting', color: '#f59e0b',
    desc: 'GST filing, income tax, TDS, bookkeeping, and financial compliance',
    popular: ['GST Registration', 'GST Return Filing', 'Income Tax Return'],
    services: [
      {
        id: 'gst-registration', name: 'GST Registration', isLoan: false,
        tagline: 'Mandatory registration if turnover exceeds the prescribed threshold',
        tags: ['Popular', 'Fast'],
        whoFor: 'Businesses with turnover above ₹20L/₹40L (goods); ₹10L for special category states',
        benefit: 'Legal compliance, input tax credit, business credibility',
        docs: ['PAN Card', 'Aadhaar', 'Business Address Proof', 'Bank Account Details'],
        authority: 'GSTN (Goods and Services Tax Network)',
        process: ['Register on gst.gov.in', 'Submit Part A & Part B', 'ARN generated', 'GSTIN issued in 3–7 days'],
        time: '3–7 working days', amount: 'No government fee',
        rate: 'Professional fee: ₹500–₹2,000', officialLink: 'https://www.gst.gov.in',
        note: 'Turnover thresholds subject to GST Council revision.',
        faqs: [
          { q: 'Is GST registration mandatory for all businesses?', a: 'Only if turnover crosses the threshold. Voluntary registration is also allowed.' },
          { q: 'What is GSTIN?', a: 'A 15-digit unique identification number issued to every GST-registered business.' },
        ],
        related: ['gst-filing', 'income-tax', 'bookkeeping'],
      },
      {
        id: 'gst-filing', name: 'GST Return Filing', isLoan: false,
        tagline: 'Monthly/quarterly GST returns to remain compliant',
        tags: ['Popular'],
        whoFor: 'All GST-registered businesses',
        benefit: 'Avoid penalties, claim ITC, maintain compliance',
        docs: ['Sales & Purchase invoices', 'GSTR-2B (auto-generated)', 'Bank statements'],
        authority: 'GSTN',
        process: ['Reconcile sales/purchases', 'File GSTR-1 (outward supplies)', 'File GSTR-3B (summary)', 'Pay net GST liability'],
        time: 'Monthly / Quarterly', amount: 'Late fee: ₹50/day (₹20 for nil return) — verify current rates',
        rate: 'Professional fee varies', officialLink: 'https://www.gst.gov.in',
        note: 'Due dates and late fees regularly updated by GSTN.',
        faqs: [
          { q: 'What happens if I miss the deadline?', a: 'Late fee of ₹50/day plus 18% p.a. interest on unpaid tax. File as early as possible.' },
          { q: 'Difference between GSTR-1 and GSTR-3B?', a: 'GSTR-1 reports outward sales invoices. GSTR-3B is a summary return for paying tax.' },
        ],
        related: ['gst-registration', 'income-tax', 'tds'],
      },
      {
        id: 'income-tax', name: 'Income Tax Filing (Business)', isLoan: false,
        tagline: 'Annual income tax return for businesses and professionals',
        tags: ['Popular'],
        whoFor: 'All businesses, LLPs, companies (mandatory regardless of profit/loss)',
        benefit: 'Legal compliance, loan eligibility, carry forward of losses',
        docs: ['Financial Statements (P&L, Balance Sheet)', 'GST Returns', 'Bank Statements', 'Form 26AS / AIS'],
        authority: 'Income Tax Department, CBDT',
        process: ['Prepare P&L and Balance Sheet', 'Tax audit if turnover exceeds threshold', 'File ITR via incometax.gov.in', 'E-verify the return'],
        time: 'By 31 July / 31 Oct — check current deadlines', amount: 'Penalty up to ₹5,000 for late filing',
        rate: 'Tax rate: 22% (domestic company); slab rate for others', officialLink: 'https://www.incometax.gov.in',
        note: 'Tax rates, due dates, and audit thresholds change with Finance Act each year.',
        faqs: [
          { q: 'Is tax audit mandatory?', a: 'Tax audit mandatory if business turnover exceeds ₹1 Crore (₹10 Crore for digital transactions). Verify current threshold with a CA.' },
          { q: 'Can losses be carried forward?', a: 'Yes. Business losses can be carried forward for 8 years to set off against future profits.' },
        ],
        related: ['gst-filing', 'tds', 'bookkeeping'],
      },
      {
        id: 'tds', name: 'TDS Compliance', isLoan: false,
        tagline: 'Deduct and deposit TDS on applicable payments',
        tags: [],
        whoFor: 'Businesses making payments liable to TDS (salary, rent, professional fees, etc.)',
        benefit: 'Stay compliant, avoid heavy penalties and interest',
        docs: ['TAN (Tax Deduction Account Number)', 'Payment details', 'Deductee PAN'],
        authority: 'CBDT / Income Tax Department',
        process: ['Deduct TDS at prescribed rate', 'Deposit via Challan 281 by 7th of next month', 'File quarterly TDS returns', 'Issue TDS certificates (Form 16/16A)'],
        time: 'Monthly deposit; Quarterly returns', amount: 'Penalty: ₹200/day for late TDS certificate',
        rate: 'Varies by nature of payment (1%–30%)', officialLink: 'https://www.incometax.gov.in/iec/foportal',
        note: 'TDS rates and thresholds revised annually in Union Budget.',
        faqs: [
          { q: 'What is TAN?', a: 'Tax Deduction Account Number — mandatory for all entities required to deduct TDS. Apply on the NSDL portal.' },
          { q: 'Penalty for not deducting TDS?', a: 'Interest at 1% per month, plus a penalty equal to the TDS amount under Section 271C.' },
        ],
        related: ['income-tax', 'gst-filing', 'payroll'],
      },
      {
        id: 'bookkeeping', name: 'Bookkeeping & Accounting', isLoan: false,
        tagline: 'Systematic recording of all business transactions',
        tags: ['Popular'],
        whoFor: 'Every business (mandatory for companies; advisable for all)',
        benefit: 'Financial clarity, audit readiness, better decision-making',
        docs: ['Sales/Purchase invoices', 'Bank Statements', 'Expense receipts', 'Payroll data'],
        authority: 'Companies Act / Income Tax Act',
        process: ['Record all transactions daily/weekly', 'Monthly bank reconciliation', 'Ledger maintenance', 'Monthly MIS and financial reports'],
        time: 'Ongoing (monthly)', amount: 'Professional fee: ₹3,000–₹15,000/month', rate: 'N/A',
        officialLink: 'https://www.mca.gov.in',
        note: 'Mandatory accounting standards apply to companies under Companies Act.',
        faqs: [
          { q: 'Is bookkeeping mandatory?', a: 'Companies are legally required to maintain proper books. Strongly advisable for all others for tax and lending purposes.' },
          { q: 'What software should I use?', a: 'Popular options: Tally, Zoho Books, QuickBooks. Choose based on business size and complexity.' },
        ],
        related: ['gst-filing', 'income-tax', 'roc-compliance'],
      },
    ],
  },
  {
    id: 'msme', name: 'MSME Services', color: '#8b5cf6',
    desc: 'Udyam registration, GeM, government tenders, and MSME benefits',
    popular: ['Udyam Registration', 'GeM Registration', 'MSME Samadhaan'],
    services: [
      {
        id: 'udyam', name: 'Udyam / MSME Registration', isLoan: false,
        tagline: 'Official MSME certification to access all government benefits',
        tags: ['Government', 'Free', 'Fast', 'Popular'],
        whoFor: 'Micro, Small, and Medium Enterprises (check current investment/turnover criteria)',
        benefit: 'Priority lending, subsidies, government tender advantages, scheme access',
        docs: ['Aadhaar of Proprietor/Director', 'PAN of Business', 'GST Number (if applicable)'],
        authority: 'Ministry of Micro, Small and Medium Enterprises',
        process: ['Visit udyamregistration.gov.in', 'Aadhaar OTP verification', 'Self-declare business details', 'URN issued instantly'],
        time: 'Instant (online self-declaration)', amount: 'No government fee', rate: 'N/A',
        officialLink: 'https://udyamregistration.gov.in',
        note: 'MSME classification criteria (investment + turnover) subject to revision.',
        faqs: [
          { q: 'How is MSME classified?', a: 'Micro: Investment ≤₹1Cr, Turnover ≤₹5Cr. Small: ≤₹10Cr, ≤₹50Cr. Medium: ≤₹50Cr, ≤₹250Cr. Verify current limits.' },
          { q: 'Is Udyam registration free?', a: 'Yes, completely free. No government charges.' },
        ],
        related: ['msme-schemes', 'gem', 'msme-loan'],
      },
      {
        id: 'msme-samadhaan', name: 'MSME Samadhaan', isLoan: false,
        tagline: 'Recover delayed payments from buyers through the government portal',
        tags: ['Government', 'Free'],
        whoFor: 'MSMEs whose payments are delayed beyond 45 days by buyers',
        benefit: 'Legal right to interest on delayed payments; government dispute resolution',
        docs: ['Udyam Registration', 'Invoice copies', 'Delivery proof', 'Buyer details'],
        authority: 'Ministry of MSME (MSME Samadhaan Portal)',
        process: ['File application on samadhaan.msme.gov.in', 'Facilitation council takes up case', 'Conciliation session', 'Arbitration if conciliation fails'],
        time: '30–90 days (conciliation)', amount: 'Interest at 3× RBI bank rate on delayed amount', rate: 'N/A',
        officialLink: 'https://samadhaan.msme.gov.in',
        note: 'Only registered MSMEs can file. Buyer must be a specified entity.',
        faqs: [
          { q: 'Can I file against government departments?', a: 'Yes. MSME Samadhaan applies to government buyers as well.' },
        ],
        related: ['udyam', 'roc-compliance', 'business-agreements'],
      },
      {
        id: 'gem', name: 'GeM Registration', isLoan: false,
        tagline: 'Sell directly to government departments and PSUs',
        tags: ['Government', 'Popular'],
        whoFor: 'Businesses supplying goods/services to government organisations',
        benefit: 'Access to ₹3L Crore+ government procurement market annually',
        docs: ['PAN', 'Aadhaar/Company Registration', 'Bank Account', 'GST Certificate', 'Product/Service details'],
        authority: 'Government e-Marketplace (GeM), Ministry of Commerce',
        process: ['Register on gem.gov.in as seller', 'Upload business & product details', 'Account verification', 'Start listing and bidding'],
        time: '3–7 working days', amount: 'No fee for MSMEs (verify current structure)',
        rate: 'Transaction fee: 0.5% (capped) — verify current rates', officialLink: 'https://gem.gov.in',
        note: 'GeM fee structure and policies updated periodically.',
        faqs: [
          { q: 'Do I need to bid on every order?', a: 'No. GeM has both direct purchase (small amounts) and bid/reverse auction for larger orders.' },
        ],
        related: ['udyam', 'govt-tender', 'state-schemes'],
      },
      {
        id: 'govt-tender', name: 'Government Tender Assistance', isLoan: false,
        tagline: 'Professional help to identify, bid, and win government tenders',
        tags: [],
        whoFor: 'Businesses eligible to participate in government procurement',
        benefit: 'Steady government revenue stream, large order sizes',
        docs: ['Company Registration', 'GST Certificate', 'Udyam Certificate', 'Financial Statements', 'Experience Certificates'],
        authority: 'Central Public Procurement Portal (CPPP) / State portals',
        process: ['Identify relevant tenders on eprocure.gov.in', 'Prepare technical & financial bid', 'Submit before deadline', 'L1 evaluation & contract award'],
        time: 'Tender-specific (21–90 days)', amount: 'EMD required; returned after tender',
        rate: 'MSMEs often get EMD exemption', officialLink: 'https://eprocure.gov.in',
        note: 'Tender conditions and EMD amounts change by tender.',
        faqs: [
          { q: 'What is EMD?', a: 'Earnest Money Deposit — a refundable security deposit submitted with a bid. MSMEs are often exempt under government procurement policies.' },
        ],
        related: ['gem', 'udyam', 'business-agreements'],
      },
    ],
  },
  {
    id: 'legal', name: 'Legal & Compliance', color: '#ef4444',
    desc: 'MCA filings, contracts, trademark, patent, and business agreements',
    popular: ['Trademark Registration', 'MCA/ROC Compliance', 'Business Agreements'],
    services: [
      {
        id: 'roc-compliance', name: 'MCA / ROC Compliance', isLoan: false,
        tagline: 'Annual filings and statutory compliance for companies and LLPs',
        tags: ['Popular'],
        whoFor: 'All registered Private Limited Companies and LLPs',
        benefit: 'Avoid heavy penalties (₹100–₹1,000/day), maintain good standing',
        docs: ['Financial Statements', 'Board Resolution', 'Annual Return data', 'Director KYC'],
        authority: 'Ministry of Corporate Affairs (MCA) / Registrar of Companies',
        process: ['Prepare annual financials', 'Conduct AGM', 'File MGT-7A (annual return)', 'File AOC-4 (financial statements)', 'Director DIN KYC'],
        time: 'AGM by 30 Sept; filings within 60 days of AGM', amount: 'Penalty: ₹100–₹1,000/day per form',
        rate: 'Professional fee: ₹5,000–₹20,000/year', officialLink: 'https://www.mca.gov.in',
        note: 'Filing due dates and penalties subject to MCA amendments.',
        faqs: [
          { q: 'What happens if I miss ROC filing?', a: 'Late additional fee of ₹100/day per form applies. Company name can be struck off if filings are persistently missed.' },
          { q: 'Is ROC compliance mandatory for LLPs?', a: 'Yes. LLPs must file Annual Return (Form 11) and Statement of Accounts (Form 8).' },
        ],
        related: ['bookkeeping', 'income-tax', 'business-agreements'],
      },
      {
        id: 'trademark', name: 'Trademark Registration', isLoan: false,
        tagline: 'Protect your brand name, logo, and tagline legally',
        tags: ['Popular'],
        whoFor: 'Any individual or business with a brand identity',
        benefit: 'Exclusive right to use the mark; legal protection against infringement',
        docs: ['Applicant details & address', 'Brand name / logo image', 'Goods/services classification', 'MSME Certificate (for fee concession)'],
        authority: 'Office of the Controller General of Patents, Designs & Trade Marks (CGPDTM)',
        process: ['Trademark search for conflicts', 'File TM-A application online', 'Examination by TM office', 'Publication in TM Journal', 'Registration if no opposition'],
        time: '12–24 months (TM-pending from day 1)', amount: 'Govt fee: ₹4,500 (MSME) | ₹9,000 (others) per class',
        rate: 'Professional fee: ₹2,000–₹5,000', officialLink: 'https://ipindiaonline.gov.in',
        note: 'Government fees revised periodically.',
        faqs: [
          { q: 'Can I use ™ before registration completes?', a: 'Yes! Once you file, you can use ™. The ® symbol is only for registered trademarks.' },
          { q: 'Does trademark registration expire?', a: 'Valid for 10 years and renewable indefinitely every 10 years.' },
        ],
        related: ['copyright', 'patent', 'startup-india'],
      },
      {
        id: 'business-agreements', name: 'Business Agreements & Contracts', isLoan: false,
        tagline: 'Legally binding agreements for business transactions and partnerships',
        tags: [],
        whoFor: 'All businesses entering partnerships, vendor deals, client contracts, or employment',
        benefit: 'Clear terms, dispute prevention, legal enforceability',
        docs: ['Party details', 'Transaction specifics', 'Payment terms', 'Dispute resolution preference'],
        authority: 'Indian Contract Act, 1872',
        process: ['Define requirements with legal professional', 'Draft the agreement', 'Review & negotiate', 'Execute on stamp paper'],
        time: '3–10 days', amount: 'Stamp duty varies by state and contract value',
        rate: 'Professional fee: ₹2,000–₹25,000+', officialLink: 'https://www.indiacode.nic.in',
        note: 'Stamp duty rates are state-specific.',
        faqs: [
          { q: 'Are verbal contracts valid?', a: 'Technically yes but very hard to enforce. Always get agreements in writing.' },
        ],
        related: ['roc-compliance', 'trademark', 'labour-compliance'],
      },
      {
        id: 'copyright', name: 'Copyright Registration', isLoan: false,
        tagline: 'Protect creative works like content, software, music, art',
        tags: ['Fast'],
        whoFor: 'Creators and businesses with original creative works',
        benefit: 'Legal proof of ownership; protection for lifetime + 60 years',
        docs: ['Author/claimant details', 'Sample of the work', 'NOC from publisher (if applicable)'],
        authority: 'Copyright Office, Ministry of Education',
        process: ['Apply on copyright.gov.in', 'Pay government fee', 'Diary number issued', 'Examination', 'Certificate issued'],
        time: '1–3 months', amount: 'Govt fee: ₹500–₹5,000 depending on type',
        rate: 'Professional fee: ₹2,000–₹8,000', officialLink: 'https://copyright.gov.in',
        note: 'Copyright exists automatically on creation; registration provides legal evidence.',
        faqs: [
          { q: 'Does software get copyright protection?', a: 'Yes. Original software code is protected as a literary work.' },
          { q: 'Do I need to register copyright?', a: 'Not mandatory but registration provides public record and legal evidence in disputes.' },
        ],
        related: ['trademark', 'patent', 'business-agreements'],
      },
      {
        id: 'patent', name: 'Patent Filing', isLoan: false,
        tagline: 'Protect inventions and innovations for up to 20 years',
        tags: [],
        whoFor: 'Inventors, R&D companies, startups with novel technical solutions',
        benefit: 'Exclusive commercial rights; competitive moat; licensing revenue',
        docs: ['Inventor details', 'Technical specification & drawings', 'Claims', 'Abstract'],
        authority: 'Indian Patent Office (IPO), CGPDTM',
        process: ['Prior art search', 'File provisional or complete specification', 'Publication after 18 months', 'Request for examination', 'Grant of patent'],
        time: '3–7 years (expedited for startups: ~12–18 months)', amount: 'Govt fee: ₹1,600–₹8,800 (e-filing); startup/MSME discounts apply',
        rate: 'Professional fee: ₹20,000–₹1,00,000+', officialLink: 'https://ipindiaonline.gov.in',
        note: 'Patent filing fees and timelines subject to IPO rules.',
        faqs: [
          { q: 'What can be patented in India?', a: 'New inventions that are novel, involve an inventive step, and are capable of industrial application. Software per se cannot be patented directly.' },
          { q: 'Is a provisional application worth it?', a: 'Yes. It secures your filing date at lower cost while you complete the full specification, giving you 12 months.' },
        ],
        related: ['trademark', 'copyright', 'startup-india'],
      },
    ],
  },
  {
    id: 'hr', name: 'HR & Payroll', color: '#06b6d4',
    desc: 'Employee management, payroll, PF, ESIC, and labour compliance',
    popular: ['Payroll Management', 'PF Registration', 'ESIC Registration'],
    services: [
      {
        id: 'payroll', name: 'Payroll Management', isLoan: false,
        tagline: 'Accurate and compliant salary processing every month',
        tags: ['Popular'],
        whoFor: 'Businesses with one or more employees',
        benefit: 'Accurate deductions, payslips, and statutory compliance',
        docs: ['Employee KYC documents', 'Salary structure', 'Monthly attendance data', 'Tax declarations'],
        authority: 'Income Tax Act, PF Act, ESIC Act',
        process: ['Collect monthly attendance data', 'Calculate gross/net salary', 'Deduct statutory contributions', 'Disburse salary & file monthly returns'],
        time: 'Monthly', amount: 'Professional fee: ₹100–₹300 per employee/month', rate: 'N/A',
        officialLink: 'https://www.epfindia.gov.in',
        note: 'Minimum wage and contribution rates revised periodically.',
        faqs: [
          { q: 'What deductions are mandatory on salary?', a: 'PF (if applicable), ESIC (if applicable), and TDS (if employee income exceeds exemption limit).' },
        ],
        related: ['pf', 'esic', 'tds'],
      },
      {
        id: 'pf', name: 'PF Registration & Compliance (EPF)', isLoan: false,
        tagline: 'Mandatory social security fund for employees',
        tags: ['Government', 'Popular'],
        whoFor: 'Businesses with 20+ employees (mandatory); voluntary below threshold',
        benefit: 'Employee retirement security; employer contribution tax deductible',
        docs: ['Business Registration', 'GST Certificate', 'Employee list & salaries', 'Bank details'],
        authority: 'Employees Provident Fund Organisation (EPFO)',
        process: ['Register on EPFO unified portal', 'Obtain PF establishment code', 'File monthly ECR', 'Contribute 12% employer + 12% employee'],
        time: '7–15 days for registration', amount: 'Employer: 12% | Employee: 12% of basic salary',
        rate: 'Admin charges: 0.5% on EPF wages', officialLink: 'https://www.epfindia.gov.in',
        note: 'Contribution rates and admin charges revised by government.',
        faqs: [
          { q: 'Can employees opt out of PF?', a: 'New employees with salary above ₹15,000 at time of joining can opt out. Existing members cannot.' },
        ],
        related: ['payroll', 'esic', 'labour-compliance'],
      },
      {
        id: 'esic', name: 'ESIC Registration & Compliance', isLoan: false,
        tagline: 'Health and social insurance scheme for employees',
        tags: ['Government'],
        whoFor: 'Businesses with 10+ employees earning below ₹21,000/month (verify current threshold)',
        benefit: 'Medical care, sickness, maternity, and disability benefits for employees',
        docs: ['Business Registration', 'Employee list with salaries', 'Bank details', 'Factory/Shop licence'],
        authority: 'Employees State Insurance Corporation (ESIC)',
        process: ['Register on esic.in', 'Get employer code', 'File monthly ESI return', 'Issue ESI cards to employees'],
        time: '7–14 days for registration', amount: 'Employer: 3.25% | Employee: 0.75% of gross wages (verify rates)',
        rate: 'N/A', officialLink: 'https://www.esic.in',
        note: 'Contribution rates and coverage thresholds revised by ESIC.',
        faqs: [
          { q: 'What does ESIC cover?', a: 'Medical care, sickness benefit, maternity benefit, disablement benefit, and dependent benefit.' },
        ],
        related: ['payroll', 'pf', 'employee-insurance'],
      },
      {
        id: 'labour-compliance', name: 'Labour Law Compliance', isLoan: false,
        tagline: 'Stay compliant with all applicable labour laws and regulations',
        tags: [],
        whoFor: 'All businesses with employees',
        benefit: 'Avoid penalties, inspections, and employee disputes',
        docs: ['Registration certificates', 'Employment registers', 'Attendance records', 'Wage records'],
        authority: 'Ministry of Labour & Employment / State Labour Departments',
        process: ['Identify applicable laws', 'Obtain required licences', 'Maintain statutory registers', 'File timely returns and renewals'],
        time: 'Ongoing', amount: 'Penalty for non-compliance varies by law',
        rate: 'Professional fee: ₹5,000–₹20,000/year', officialLink: 'https://labour.gov.in',
        note: 'Labour laws vary by state. Labour Codes pending full implementation.',
        faqs: [
          { q: 'What is the Shop & Establishment Act?', a: 'A state-level law regulating working hours, leave, wages, and employment conditions. Mandatory for most businesses.' },
        ],
        related: ['pf', 'esic', 'payroll'],
      },
    ],
  },
  {
    id: 'insurance', name: 'Business Insurance', color: '#f97316',
    desc: 'Protect your business, property, stock, machinery, and employees',
    popular: ['Business Insurance', 'Property Insurance', 'Employee Group Insurance'],
    services: [
      {
        id: 'business-insurance', name: 'Business / Commercial Insurance', isLoan: false,
        tagline: 'Comprehensive protection package for your business',
        tags: ['Popular'],
        whoFor: 'All businesses — sole proprietors to large enterprises',
        benefit: 'Combined cover for property, liability, and business interruption',
        docs: ['Business Registration', 'Property details', 'Annual turnover', 'Previous insurance history'],
        authority: 'IRDAI-regulated insurance companies',
        process: ['Assess coverage requirements', 'Compare quotes from multiple insurers', 'Submit proposal form', 'Premium payment & policy issuance'],
        time: '2–7 working days', amount: 'Premium: 0.5%–2% of insured value annually', rate: 'N/A',
        officialLink: 'https://www.irdai.gov.in',
        note: 'Premiums and coverage terms set by individual insurers, regulated by IRDAI.',
        faqs: [
          { q: 'What does a commercial package policy cover?', a: 'Typically fire & allied perils, burglary, machinery breakdown, money-in-transit, public liability, and employer\'s liability.' },
          { q: 'Is business insurance tax deductible?', a: 'Yes. Business insurance premiums are deductible as a business expense.' },
        ],
        related: ['property-insurance', 'employee-insurance', 'cyber-insurance'],
      },
      {
        id: 'property-insurance', name: 'Property / Fire Insurance', isLoan: false,
        tagline: 'Protect your business premises from fire and natural disasters',
        tags: [],
        whoFor: 'Business owners with office, factory, or commercial property',
        benefit: 'Compensation for damage from fire, flood, earthquake, and allied perils',
        docs: ['Property documents / lease agreement', 'Asset valuation', 'Previous policy (if renewal)'],
        authority: 'IRDAI-regulated insurers',
        process: ['Property assessment or self-valuation', 'Premium quote', 'Submit proposal form', 'Policy issuance'],
        time: '3–7 days', amount: 'Based on insured sum (property replacement value)',
        rate: 'Varies by construction type and risk', officialLink: 'https://www.irdai.gov.in',
        note: 'Verify sum insured is adequate; under-insurance leads to proportional claim settlement.',
        faqs: [
          { q: 'Reinstatement value vs market value?', a: 'Reinstatement value covers full rebuild cost (preferred). Market value accounts for depreciation. Under-insuring on reinstatement value leads to claim deductions.' },
        ],
        related: ['business-insurance', 'machinery-insurance', 'cyber-insurance'],
      },
      {
        id: 'machinery-insurance', name: 'Machinery / Equipment Insurance', isLoan: false,
        tagline: 'Cover for breakdown, damage, and loss of machinery',
        tags: [],
        whoFor: 'Manufacturing units, factories, equipment-intensive businesses',
        benefit: 'Claim for repair/replacement; covers electrical/mechanical breakdown',
        docs: ['Machinery list with make/model/value', 'Business Registration', 'Last inspection report'],
        authority: 'IRDAI-regulated insurers',
        process: ['Declare machinery details', 'Insurer technical assessment', 'Policy issuance'],
        time: '3–10 days', amount: 'Sum insured = replacement value of machinery',
        rate: 'Varies by machinery type and age', officialLink: 'https://www.irdai.gov.in',
        note: 'Depreciation applies to older machinery. Negotiate reinstatement value policies.',
        faqs: [],
        related: ['property-insurance', 'business-insurance', 'machinery-loan'],
      },
      {
        id: 'employee-insurance', name: 'Group Employee Health Insurance', isLoan: false,
        tagline: 'Health cover for your workforce — attract and retain talent',
        tags: ['Popular'],
        whoFor: 'Businesses with 7+ employees (min group size varies by insurer)',
        benefit: 'Medical hospitalisation cover; improves employee satisfaction and retention',
        docs: ['Employee list with date of birth', 'Salary details', 'Business Registration'],
        authority: 'IRDAI-regulated health insurers',
        process: ['Decide on sum insured per employee', 'Get group quotations', 'Employee enrolment', 'Policy issuance and E-cards'],
        time: '7–14 days', amount: 'Cover: ₹1–5 Lakh/employee (customisable)',
        rate: 'Group premium: significantly lower than individual plans', officialLink: 'https://www.irdai.gov.in',
        note: 'Separate from ESIC. For businesses not covered under ESIC or as a top-up.',
        faqs: [
          { q: 'Can I offer different cover amounts to different employees?', a: 'Yes. Graded policies allow different sums insured for different employee grades.' },
        ],
        related: ['pf', 'esic', 'business-insurance'],
      },
      {
        id: 'cyber-insurance', name: 'Cyber Insurance', isLoan: false,
        tagline: 'Protection against cyberattacks, data breaches, and digital fraud',
        tags: [],
        whoFor: 'Businesses handling customer data, doing online transactions, or using digital systems',
        benefit: 'Covers financial loss, legal expenses, and notification costs from cyber incidents',
        docs: ['Business details', 'IT infrastructure summary', 'Revenue from digital operations'],
        authority: 'IRDAI-regulated insurers',
        process: ['Cyber risk assessment questionnaire', 'Underwriting review', 'Premium quote', 'Policy issuance'],
        time: '5–10 days', amount: 'Cover: ₹50L–₹5Cr+ depending on risk',
        rate: 'Varies by industry and risk profile', officialLink: 'https://www.irdai.gov.in',
        note: 'Cyber risk evolves rapidly; review and update coverage annually.',
        faqs: [
          { q: 'What does cyber insurance cover?', a: 'First-party losses (financial loss, data recovery, business interruption) and third-party liabilities (data breach claims, regulatory fines).' },
        ],
        related: ['business-insurance', 'property-insurance', 'business-agreements'],
      },
    ],
  },
  {
    id: 'growth', name: 'Business Growth', color: '#10b981',
    desc: 'Digital marketing, branding, SEO, and business consulting',
    popular: ['Digital Marketing', 'SEO', 'Business Consulting'],
    services: [
      {
        id: 'digital-marketing', name: 'Digital Marketing', isLoan: false,
        tagline: 'Reach your customers online through targeted digital campaigns',
        tags: ['Popular'],
        whoFor: 'Any business wanting to grow its online presence and customer base',
        benefit: 'Measurable ROI, targeted reach, scalable campaigns',
        docs: ['Business details', 'Target audience information', 'Marketing budget'],
        authority: 'N/A (private services)',
        process: ['Strategy development', 'Content & campaign creation', 'Campaign launch & monitoring', 'Optimise & report'],
        time: 'Ongoing; results in 30–90 days', amount: 'Ad budget: ₹10,000/month+',
        rate: 'Agency fee: 10–20% of ad spend or fixed retainer', officialLink: '',
        note: 'Effectiveness depends on strategy, budget, and market competition.',
        faqs: [
          { q: 'Which channels should I start with?', a: 'B2C: Instagram/Facebook/Google Ads. B2B: LinkedIn and SEO. Start with 1–2 channels and expand.' },
        ],
        related: ['seo', 'branding', 'consulting'],
      },
      {
        id: 'seo', name: 'SEO (Search Engine Optimisation)', isLoan: false,
        tagline: 'Rank higher on Google and get organic business enquiries',
        tags: [],
        whoFor: 'Businesses with websites wanting long-term organic growth',
        benefit: 'Sustainable traffic, high-intent leads, better than paid ads long-term',
        docs: ['Website access', 'Business information', 'Target keyword/competitor list'],
        authority: 'N/A (private services)',
        process: ['Website audit', 'Keyword research', 'On-page & technical SEO', 'Off-page link building', 'Monthly reporting'],
        time: '3–6 months for significant results', amount: 'Monthly retainer: ₹8,000–₹50,000+', rate: 'N/A',
        officialLink: '',
        note: 'SEO is a long-term investment. Avoid providers guaranteeing overnight rankings.',
        faqs: [
          { q: 'SEO vs Google Ads?', a: 'Google Ads gives immediate visibility but stops when you stop paying. SEO builds lasting organic traffic. Most businesses benefit from both.' },
        ],
        related: ['digital-marketing', 'branding', 'consulting'],
      },
      {
        id: 'branding', name: 'Branding & Identity', isLoan: false,
        tagline: 'Build a brand people remember and trust',
        tags: [],
        whoFor: 'New businesses or established ones looking to rebrand',
        benefit: 'Differentiation, customer loyalty, premium positioning',
        docs: ['Business overview and values', 'Target audience description', 'Competitor examples'],
        authority: 'N/A (private services)',
        process: ['Brand discovery workshop', 'Logo & visual identity design', 'Typography and colour palette', 'Brand guidelines document'],
        time: '2–8 weeks', amount: 'Basic: ₹15,000+ | Comprehensive: ₹1,00,000+', rate: 'N/A',
        officialLink: '',
        note: 'Quality varies significantly; review portfolios carefully.',
        faqs: [
          { q: 'Should I trademark my brand name?', a: 'Yes. Once you invest in building a brand, trademark registration protects it from being copied.' },
        ],
        related: ['digital-marketing', 'trademark', 'seo'],
      },
      {
        id: 'consulting', name: 'Business Consulting', isLoan: false,
        tagline: 'Expert advice to solve business problems and accelerate growth',
        tags: ['Popular'],
        whoFor: 'Businesses facing growth bottlenecks, operational challenges, or strategic decisions',
        benefit: 'Objective external perspective, proven frameworks, faster decisions',
        docs: ['Business overview', 'Financial data (P&L)', 'Specific challenge description'],
        authority: 'N/A (private services)',
        process: ['Initial assessment', 'Root-cause diagnosis', 'Strategy & action plan', 'Implementation support'],
        time: 'Project-based (weeks to months)', amount: 'Hourly: ₹2,000–₹10,000 | Project: ₹50,000+', rate: 'N/A',
        officialLink: '',
        note: 'Verify consultant experience in your specific industry.',
        faqs: [
          { q: 'When should I hire a business consultant?', a: 'When facing stagnant growth, entering a new market, restructuring, or needing expertise not available in-house.' },
        ],
        related: ['digital-marketing', 'expansion-loan', 'startup-funding'],
      },
    ],
  },
];

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
const allServices = CATEGORIES.flatMap(cat =>
  cat.services.map(s => ({ ...s, catId: cat.id, catName: cat.name, catIcon: cat.icon, catColor: cat.color }))
);
const getServiceById = (id) => allServices.find(s => s.id === id);
const calcEMI = (p, r, m) => {
  if (!p || !r || !m) return 0;
  const mo = r / 12 / 100;
  return Math.round((p * mo * Math.pow(1 + mo, m)) / (Math.pow(1 + mo, m) - 1));
};

/* ═══════════════════════════════════════
   BADGE
═══════════════════════════════════════ */
const Badge = ({ label }) => {
  const s = BADGE_STYLES[label] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
  return (
    <span className="bs-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {label === 'Popular' && <Star size={10} />}
      {label === 'Fast' && <Zap size={10} />}
      {label === 'Government' && <Shield size={10} />}
      {label === 'Free' && <CheckCircle2 size={10} />}
      {label}
    </span>
  );
};

/* ═══════════════════════════════════════
   BOOKMARK BUTTON
═══════════════════════════════════════ */
const BookmarkBtn = ({ serviceId }) => {
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bs_bookmarks') || '[]').includes(serviceId); }
    catch { return false; }
  });
  const toggle = (e) => {
    e.stopPropagation();
    const cur = JSON.parse(localStorage.getItem('bs_bookmarks') || '[]');
    const upd = saved ? cur.filter(id => id !== serviceId) : [...cur, serviceId];
    localStorage.setItem('bs_bookmarks', JSON.stringify(upd));
    setSaved(!saved);
    window.dispatchEvent(new Event('storage'));
  };
  return (
    <button className={`bs-bookmark-btn ${saved ? 'saved' : ''}`} onClick={toggle} title={saved ? 'Remove bookmark' : 'Save for later'}>
      {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
    </button>
  );
};

/* ═══════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════ */
const FAQAccordion = ({ faqs }) => {
  const [open, setOpen] = useState(null);
  if (!faqs?.length) return null;
  return (
    <div className="bs-faq-list">
      {faqs.map((faq, i) => (
        <div key={i} className={`bs-faq-item ${open === i ? 'open' : ''}`}>
          <button className="bs-faq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span>{faq.q}</span>
            {open === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {open === i && <p className="bs-faq-a">{faq.a}</p>}
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════
   EMI CALCULATOR
═══════════════════════════════════════ */
const EMICalculator = () => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(36);
  const emi = calcEMI(amount, rate, tenure);
  const total = emi * tenure;
  const interest = total - amount;
  return (
    <div className="bs-emi-calc">
      <div className="bs-emi-header"><Calculator size={16} /><h4>EMI Calculator</h4></div>
      <div className="bs-emi-field">
        <div className="bs-emi-label-row"><label>Loan Amount</label><span>₹{(amount/100000).toFixed(1)}L</span></div>
        <input type="range" min="50000" max="10000000" step="50000" value={amount}
          onChange={e => setAmount(+e.target.value)} className="bs-slider"
          style={{'--pct': `${((amount-50000)/(10000000-50000))*100}%`}} />
      </div>
      <div className="bs-emi-field">
        <div className="bs-emi-label-row"><label>Interest Rate (p.a.)</label><span>{rate}%</span></div>
        <input type="range" min="6" max="24" step="0.5" value={rate}
          onChange={e => setRate(+e.target.value)} className="bs-slider"
          style={{'--pct': `${((rate-6)/(24-6))*100}%`}} />
      </div>
      <div className="bs-emi-field">
        <div className="bs-emi-label-row"><label>Tenure</label><span>{tenure} months</span></div>
        <input type="range" min="6" max="84" step="6" value={tenure}
          onChange={e => setTenure(+e.target.value)} className="bs-slider"
          style={{'--pct': `${((tenure-6)/(84-6))*100}%`}} />
      </div>
      <div className="bs-emi-result">
        <div className="bs-emi-main">
          <span className="bs-emi-label-sm">Monthly EMI</span>
          <span className="bs-emi-value">₹{emi.toLocaleString('en-IN')}</span>
        </div>
        <div className="bs-emi-breakdown">
          <div><span>Principal</span><span>₹{amount.toLocaleString('en-IN')}</span></div>
          <div><span>Total Interest</span><span>₹{interest.toLocaleString('en-IN')}</span></div>
          <div className="bs-emi-total"><span>Total Payable</span><span>₹{total.toLocaleString('en-IN')}</span></div>
        </div>
      </div>
      <p className="bs-emi-note">* Indicative only. Actual EMI varies by lender terms.</p>
    </div>
  );
};

/* ═══════════════════════════════════════
   SMART RECOMMENDER QUIZ
═══════════════════════════════════════ */
const SmartRecommender = ({ onRecommend }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [
    { id: 'need', q: 'What does your business need most right now?', options: [
      { label: 'Funding or Loans', value: 'loans' },
      { label: 'Government Schemes', value: 'govt-schemes' },
      { label: 'Tax & Accounting', value: 'tax' },
      { label: 'Legal Protection', value: 'legal' },
      { label: 'HR & Employees', value: 'hr' },
      { label: 'Insurance', value: 'insurance' },
      { label: 'Growth & Marketing', value: 'growth' },
      { label: 'MSME Benefits', value: 'msme' },
    ]},
    { id: 'size', q: 'How large is your business?', options: [
      { label: 'Solo / Freelancer', value: 'solo' },
      { label: '1–9 employees', value: 'micro' },
      { label: '10–50 employees', value: 'small' },
      { label: '50+ employees', value: 'medium' },
    ]},
    { id: 'age', q: 'How old is your business?', options: [
      { label: 'Less than 1 year', value: 'new' },
      { label: '1–3 years', value: 'early' },
      { label: '3–5 years', value: 'growing' },
      { label: '5+ years', value: 'established' },
    ]},
  ];
  const handleAnswer = (qId, value) => {
    const na = { ...answers, [qId]: value };
    setAnswers(na);
    if (step < questions.length - 1) { setStep(step + 1); return; }
    const cat = CATEGORIES.find(c => c.id === na.need);
    const recs = cat ? cat.services.slice(0, 3).map(s => s.id) : [];
    if (na.need === 'loans' && na.age === 'established') recs.push('expansion-loan');
    if (na.need === 'hr' && ['small','medium'].includes(na.size)) { recs.push('pf','esic'); }
    onRecommend([...new Set(recs)].slice(0, 4));
  };
  return (
    <div className="bs-quiz">
      <div className="bs-quiz-progress">
        {questions.map((_, i) => <div key={i} className={`bs-quiz-dot ${i <= step ? 'active' : ''}`} />)}
      </div>
      <p className="bs-quiz-step-label">Step {step + 1} of {questions.length}</p>
      <p className="bs-quiz-q">{questions[step].q}</p>
      <div className="bs-quiz-options">
        {questions[step].options.map(opt => (
          <button key={opt.value} className="bs-quiz-opt" onClick={() => handleAnswer(questions[step].id, opt.value)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   SAVED SERVICES STRIP
═══════════════════════════════════════ */
const SavedStrip = ({ onOpen }) => {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bs_bookmarks') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    const sync = () => {
      try { setIds(JSON.parse(localStorage.getItem('bs_bookmarks') || '[]')); } catch { setIds([]); }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  if (!ids.length) return null;
  const services = ids.map(id => getServiceById(id)).filter(Boolean);
  return (
    <div className="bs-saved-strip">
      <div className="container">
        <div className="bs-saved-inner">
          <div className="bs-saved-label"><BookmarkCheck size={14} /> {services.length} Saved</div>
          <div className="bs-saved-chips">
            {services.map(s => (
              <button key={s.id} className="bs-saved-chip" onClick={() => onOpen(s)}>
                {s.catIcon} {s.name}
              </button>
            ))}
          </div>
          <button className="bs-saved-clear" onClick={() => { localStorage.removeItem('bs_bookmarks'); setIds([]); window.dispatchEvent(new Event('storage')); }}>
            <X size={12} /> Clear
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function BusinessServices() {
  const [view, setView] = useState('home');
  const [activeCat, setActiveCat] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [recommendations, setRecommendations] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allServices.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.catName.toLowerCase().includes(q) ||
      (s.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  const filteredCategories = useMemo(() => {
    if (filter === 'all') return CATEGORIES;
    return CATEGORIES.filter(c => c.services.some(s => (s.tags || []).includes(filter)));
  }, [filter]);

  const openCategory = useCallback((cat) => { setActiveCat(cat); setView('category'); window.scrollTo(0, 0); }, []);
  const openService = useCallback((svc, cat) => {
    const catObj = cat || CATEGORIES.find(c => c.id === svc.catId);
    setActiveCat(catObj);
    setActiveService({ ...svc, catName: catObj?.name || svc.catName, catIcon: catObj?.icon || svc.catIcon, catColor: catObj?.color || svc.catColor });
    setView('service'); window.scrollTo(0, 0);
  }, []);
  const goHome = useCallback(() => { setView('home'); setActiveCat(null); setActiveService(null); setQuery(''); window.scrollTo(0, 0); }, []);
  const goCategory = useCallback(() => { setView('category'); setActiveService(null); window.scrollTo(0, 0); }, []);
  const recommendedServices = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.map(id => getServiceById(id)).filter(Boolean);
  }, [recommendations]);

  const FILTERS = ['all', 'Government', 'Popular', 'Free', 'Fast', 'No Collateral'];

  return (
    <div className="bs-page">
      <SEO 
        title="Business Services & Compliance | C-PEB" 
        description="From MSME loans and government schemes to GST, trademark, and payroll — find and apply for the right services to grow your business." 
      />
      <SavedStrip onOpen={(svc) => openService(svc)} />

      {/* ────── HOME ────── */}
      {view === 'home' && (
        <>
          <section className="bs-hero">
            <div className="container">
              <p className="section-eyebrow">Business Services</p>
              <h1 className="bs-hero-title">Services to Grow &amp; Manage<br />Your Business</h1>
              <p className="bs-hero-sub">Your business is started. Now get the funding, government support, compliance, protection, and professional services you need to grow.</p>

              <div className="bs-search-wrap">
                <Search size={18} className="bs-search-icon" />
                <input type="text" className="bs-search"
                  placeholder="Search: GST, Mudra loan, trademark, payroll, insurance…"
                  value={query} onChange={e => setQuery(e.target.value)} />
                {query && <button className="bs-search-clear" onClick={() => setQuery('')}><X size={16} /></button>}
                {searchResults.length > 0 && (
                  <div className="bs-search-results">
                    {searchResults.slice(0, 8).map(s => (
                      <button key={s.id} className="bs-search-result-item" onClick={() => { openService(s); setQuery(''); }}>
                        <span className="bs-sri-icon">{s.catIcon}</span>
                        <div>
                          <span className="bs-sri-name">{s.name}</span>
                          <span className="bs-sri-cat">{s.catName}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto', marginRight: 8 }}>
                          {(s.tags || []).slice(0, 2).map(t => <Badge key={t} label={t} />)}
                        </div>
                        <ChevronRight size={14} className="bs-sri-arrow" />
                      </button>
                    ))}
                  </div>
                )}
                {query && !searchResults.length && (
                  <div className="bs-search-empty-drop">No results for "<strong>{query}</strong>"</div>
                )}
              </div>
              {!query && <p className="bs-search-hint">Try: "mudra", "GST", "trademark", "PF", "GeM", "ESIC"</p>}
            </div>
          </section>

          {/* Quiz Banner */}
          {!showQuiz && !recommendations && (
            <div className="bs-quiz-cta-bar">
              <div className="container">
                <div className="bs-quiz-cta-inner">
                  <div>
                    <strong>Not sure what your business needs?</strong>
                    <span>Answer 3 quick questions → get personalised service recommendations</span>
                  </div>
                  <button className="btn btn-primary" onClick={() => setShowQuiz(true)}>
                    Find My Services <TrendingUp size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz */}
          {showQuiz && !recommendations && (
            <div className="bs-quiz-section">
              <div className="container">
                <div className="bs-quiz-wrap">
                  <div className="bs-quiz-header">
                    <h3>What does your business need?</h3>
                    <button className="bs-quiz-close" onClick={() => setShowQuiz(false)}><X size={16} /></button>
                  </div>
                  <SmartRecommender onRecommend={(recs) => { setRecommendations(recs); setShowQuiz(false); }} />
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations && (
            <div className="bs-recs-section">
              <div className="container">
                <div className="bs-recs-header">
                  <div><h3>Recommended for Your Business</h3><p>Based on your answers</p></div>
                  <button className="bs-recs-reset" onClick={() => { setRecommendations(null); }}>
                    <X size={13} /> Retake Quiz
                  </button>
                </div>
                <div className="bs-recs-grid">
                  {recommendedServices.map(s => (
                    <div key={s.id} className="bs-rec-card" onClick={() => openService(s)} style={{ borderTopColor: s.catColor }}>
                      <div className="bs-rec-cat" style={{ color: s.catColor }}>{s.catIcon} {s.catName}</div>
                      <h4>{s.name}</h4>
                      <p>{s.tagline}</p>
                      <span className="bs-rec-btn" style={{ color: s.catColor }}>View Details <ChevronRight size={13} /></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category Grid */}
          <section className="bs-categories">
            <div className="container">
              <div className="bs-filter-bar">
                {FILTERS.map(f => (
                  <button key={f} className={`bs-filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f === 'Government' && <Shield size={12} />}
                    {f === 'Popular' && <Star size={12} />}
                    {f === 'Free' && <CheckCircle2 size={12} />}
                    {f === 'Fast' && <Zap size={12} />}
                    {f === 'all' ? 'All Services' : f}
                  </button>
                ))}
              </div>
              <div className="bs-cat-grid">
                {filteredCategories.map(cat => (
                  <div key={cat.id} className="bs-cat-card" onClick={() => openCategory(cat)}>
                    <div className="bs-cat-info">
                      <h3 className="bs-cat-name">{cat.name}</h3>
                      <p className="bs-cat-desc">{cat.desc}</p>
                      <div className="bs-cat-popular">
                        {cat.popular.map(s => <span key={s} className="bs-cat-tag">{s}</span>)}
                      </div>
                    </div>
                    <button className="bs-cat-cta" style={{ color: cat.color }}>View All <ArrowRight size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bs-bottom-cta">
            <div className="container">
              <div className="bs-bottom-cta-inner">
                <div>
                  <h2>Need expert guidance?</h2>
                  <p>Talk to our advisors — free 30-minute business consultation call.</p>
                </div>
                <button className="btn btn-primary btn-lg">Book Free Consultation <ArrowRight size={18} /></button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ────── CATEGORY ────── */}
      {view === 'category' && activeCat && (
        <>
          <section className="bs-cat-hero" style={{ borderTopColor: activeCat.color }}>
            <div className="container">
              <button className="bs-back-btn" onClick={goHome}><ArrowLeft size={16} /> All Services</button>
              <div className="bs-cat-hero-inner">
                <span className="bs-cat-hero-icon" style={{ background: activeCat.color + '18', color: activeCat.color }}>{activeCat.icon}</span>
                <div>
                  <p className="section-eyebrow">{activeCat.name}</p>
                  <h1>{activeCat.name}</h1>
                  <p className="bs-cat-hero-desc">{activeCat.desc}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="bs-svc-list">
            <div className="container">
              <div className="bs-svc-grid">
                {activeCat.services.map(svc => (
                  <div key={svc.id} className="bs-svc-card" onClick={() => openService(svc, activeCat)}>
                    <div className="bs-svc-card-top">
                      <div className="bs-svc-card-title-row">
                        <h3>{svc.name}</h3>
                        <BookmarkBtn serviceId={svc.id} />
                      </div>
                      {svc.tags?.length > 0 && <div className="bs-svc-tags">{svc.tags.map(t => <Badge key={t} label={t} />)}</div>}
                      <p>{svc.tagline}</p>
                    </div>
                    <div className="bs-svc-card-bottom">
                      <span className="bs-svc-meta-item"><Clock size={12} /> {svc.time}</span>
                      <button className="bs-svc-btn" style={{ color: activeCat.color }}>Details <ChevronRight size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ────── SERVICE DETAIL ────── */}
      {view === 'service' && activeService && (
        <section className="bs-detail">
          <div className="container">
            <div className="bs-breadcrumb">
              <button onClick={goHome}>All Services</button>
              <ChevronRight size={14} />
              <button onClick={goCategory}>{activeService.catIcon} {activeService.catName}</button>
              <ChevronRight size={14} />
              <span>{activeService.name}</span>
            </div>
            <div className="bs-detail-layout">
              {/* Left */}
              <div className="bs-detail-main">
                <div className="bs-detail-title-row">
                  <h1>{activeService.name}</h1>
                  <BookmarkBtn serviceId={activeService.id} />
                </div>
                {activeService.tags?.length > 0 && (
                  <div className="bs-detail-badges">{activeService.tags.map(t => <Badge key={t} label={t} />)}</div>
                )}
                <p className="bs-detail-tagline">{activeService.tagline}</p>
                <div className="bs-detail-section">
                  <h4><CheckCircle2 size={16} /> Who should use this?</h4>
                  <p>{activeService.whoFor}</p>
                </div>
                <div className="bs-detail-section">
                  <h4><FileText size={16} /> Required Documents</h4>
                  <ul className="bs-detail-list">{activeService.docs.map((d, i) => <li key={i}>{d}</li>)}</ul>
                </div>
                <div className="bs-detail-section">
                  <h4><TrendingUp size={16} /> Application Process</h4>
                  <div className="bs-process-steps">
                    {activeService.process.map((step, i) => (
                      <div key={i} className="bs-process-step">
                        <div className="bs-ps-num" style={{ borderColor: activeService.catColor, color: activeService.catColor }}>{i + 1}</div>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {activeService.faqs?.length > 0 && (
                  <div className="bs-detail-section">
                    <h4><ChevronDown size={16} /> Frequently Asked Questions</h4>
                    <FAQAccordion faqs={activeService.faqs} />
                  </div>
                )}
                {activeService.note && (
                  <div className="bs-disclaimer"><AlertCircle size={15} /><p>{activeService.note}</p></div>
                )}
                {/* Related Services */}
                {activeService.related?.length > 0 && (
                  <div className="bs-related">
                    <h4>Related Services</h4>
                    <div className="bs-related-grid">
                      {activeService.related.map(id => {
                        const svc = getServiceById(id);
                        if (!svc) return null;
                        return (
                          <div key={id} className="bs-related-card" onClick={() => openService(svc)}>
                            <span className="bs-related-icon">{svc.catIcon}</span>
                            <div>
                              <span className="bs-related-name">{svc.name}</span>
                              <span className="bs-related-cat">{svc.catName}</span>
                            </div>
                            <ChevronRight size={13} className="bs-related-arrow" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {/* Sidebar */}
              <div className="bs-detail-sidebar">
                <div className="bs-summary-card">
                  <h4>Quick Summary</h4>
                  <div className="bs-summary-row"><Clock size={14} /><div><span className="bs-sum-label">Processing Time</span><span className="bs-sum-val">{activeService.time}</span></div></div>
                  {activeService.amount && <div className="bs-summary-row"><Calculator size={14} /><div><span className="bs-sum-label">Amount / Fee</span><span className="bs-sum-val">{activeService.amount}</span></div></div>}
                  {activeService.rate && activeService.rate !== 'N/A' && <div className="bs-summary-row"><TrendingUp size={14} /><div><span className="bs-sum-label">Rate / Charges</span><span className="bs-sum-val">{activeService.rate}</span></div></div>}
                  <div className="bs-summary-row"><Shield size={14} /><div><span className="bs-sum-label">Authority</span><span className="bs-sum-val">{activeService.authority}</span></div></div>
                  <div className="bs-summary-row"><CheckCircle2 size={14} /><div><span className="bs-sum-label">Key Benefit</span><span className="bs-sum-val">{activeService.benefit}</span></div></div>
                  <button className="btn btn-primary bs-cta-btn">Get Assistance <ArrowRight size={16} /></button>
                  {activeService.officialLink && (
                    <a href={activeService.officialLink} target="_blank" rel="noopener noreferrer" className="bs-official-link">
                      <ExternalLink size={13} /> Official Government Portal
                    </a>
                  )}
                </div>
                {activeService.isLoan && <EMICalculator />}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

