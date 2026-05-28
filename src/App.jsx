import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Cpu, Layers, Activity, CheckCircle, ArrowRight, 
  Lock, Unlock, Users, FolderGit2, Mail, Phone, Globe, 
  ChevronRight, Download, AlertCircle, Terminal, Eye, RefreshCw,
  Compass, Award, Briefcase, FileCheck, Check, Sparkles
} from 'lucide-react';
import { gsap } from 'gsap';

// Configuration Multi-Projet du Portail Démo Sécurisé
const TENANTS = {
  'OIF-2026': {
    id: 'oif',
    name: 'Commission des marchés OIF',
    title: 'Portail Évaluateur OIF',
    headerText: 'PROTOCOLE EXCLUSIF OIF ACTIF',
    welcomeMessage: 'Bienvenue dans le portail de démonstration pré-configuré pour l\'évaluation de dossiers institutionnels (Exemple OIF). Ce prototype d\'analyse documentaire IA applique les critères d\'éligibilité définis pour l\'évaluation automatisée de pièces administratives.',
    docs: [
      'Lettre_candidature_Initiative_Femmes.pdf',
      'Statuts_Association_Locale.pdf',
      'Budget_Previsionnel_Projet.xlsx',
      'Rapport_Activite_Certifie_2025.pdf'
    ],
    scanResults: {
      'Lettre_candidature_Initiative_Femmes.pdf': {
        detectedOrg: "Association Initiative Éducative - Sénégal",
        score: 95.8,
        criteria: [
          { name: "Existence légale (Sénégal/Espace OHADA)", status: "VALIDE", note: "Immatriculation RCCM vérifiée" },
          { name: "Expérience dans le domaine", status: "EXCELLENT", note: "3 ans d'historique documenté" },
          { name: "Projet ciblant les femmes", status: "VALIDE", note: "Objectif opérationnel clair et chiffré" },
          { name: "Budget d'investissement", status: "VALIDE", note: "Conforme à la fourchette admissible" }
        ],
        aiSummary: "Le dossier présente un haut degré de conformité technique et administrative. Le budget est optimisé sans incohérence financière. Recommandation : Passage prioritaire en phase d'audit sur site."
      },
      'Statuts_Association_Locale.pdf': {
        detectedOrg: "Association Initiative Éducative - Sénégal",
        score: 92.4,
        criteria: [
          { name: "Existence légale (Sénégal/Espace OHADA)", status: "VALIDE", note: "Statuts visés par l'autorité administrative" },
          { name: "Gouvernance transparente", status: "VALIDE", note: "Conseil d'administration paritaire identifié" },
          { name: "Objet social non lucratif", status: "VALIDE", note: "Conforme à la charte OIF" }
        ],
        aiSummary: "Les statuts de l'association locale sont en parfaite conformité avec la réglementation sénégalaise et la législation OHADA."
      },
      'Budget_Previsionnel_Projet.xlsx': {
        detectedOrg: "Association Initiative Éducative - Sénégal",
        score: 89.5,
        criteria: [
          { name: "Faisabilité financière", status: "EXCELLENT", note: "Ressources propres alignées à hauteur de 15%" },
          { name: "Structure des coûts", status: "CONFORME", note: "Frais de structure limités à 8%" }
        ],
        aiSummary: "Le budget prévisionnel est structuré de manière rigoureuse avec une excellente maîtrise des frais généraux."
      },
      'Rapport_Activite_Certifie_2025.pdf': {
        detectedOrg: "Association Initiative Éducative - Sénégal",
        score: 94.1,
        criteria: [
          { name: "Impact terrain documenté", status: "VALIDE", note: "Bénéficiaires directs clairement certifiés" },
          { name: "Certification comptable externe", status: "VALIDE", note: "Signé par un auditeur indépendant" }
        ],
        aiSummary: "Le rapport d'activité 2025 témoigne d'un ancrage local fort et d'une gestion rigoureuse des fonds alloués."
      }
    }
  },
  'MSF-2026': {
    id: 'msf',
    name: 'Médecins Sans Frontières - Logistique Ouest-Afrique',
    title: 'Portail Évaluateur MSF',
    headerText: 'PROTOCOLE D\'AUDIT HUMANITAIRE MSF ACTIF',
    welcomeMessage: 'Bienvenue sur le portail de démonstration logistique (Exemple MSF). Ce simulateur montre comment notre moteur IA audite et valide automatiquement les rapports logistiques et la conformité des flux d\'approvisionnement.',
    docs: [
      'Rapport_Chantier_Mobile_Matam.pdf',
      'Planification_Stocks_Vaccins_Kolda.xlsx',
      'Inventaire_Equipements_Dakar.pdf'
    ],
    scanResults: {
      'Rapport_Chantier_Mobile_Matam.pdf': {
        detectedOrg: "MSF - Mission Sénégal",
        score: 97.2,
        criteria: [
          { name: "Validation médicale", status: "VALIDE", note: "Signé par le médecin coordinateur terrain" },
          { name: "Couverture géographique (Matam)", status: "CONFORME", note: "Zones rurales isolées de Matam desservies" },
          { name: "Allocation carburant", status: "EXCELLENT", note: "Écart de moins de 3% par rapport au budget" }
        ],
        aiSummary: "Le rapport d'activités opérationnel de Matam démontre une rentabilité logistique et humaine exceptionnelle. Recommandation : Validation immédiate pour financement du prochain trimestre."
      },
      'Planification_Stocks_Vaccins_Kolda.xlsx': {
        detectedOrg: "MSF - Hub Kolda",
        score: 91.8,
        criteria: [
          { name: "Chaîne du froid respectée", status: "VALIDE", note: "Logs de température validés en continu" },
          { name: "Gestion de péremption (FEFO)", status: "CONFORME", note: "Règle premier expiré premier sorti appliquée" }
        ],
        aiSummary: "Le planning logistique de Kolda garantit la préservation de la chaîne du froid. Recommandation : Validation de la livraison sous 48h."
      },
      'Inventaire_Equipements_Dakar.pdf': {
        detectedOrg: "MSF - Hub Central Dakar",
        score: 88.5,
        criteria: [
          { name: "Disponibilité du matériel d'urgence", status: "EXCELLENT", note: "Hub Dakar à 95% de sa capacité nominale" },
          { name: "Maintenance préventive", status: "VALIDE", note: "Tous les générateurs d'électricité révisés" }
        ],
        aiSummary: "L'inventaire du Hub Central de Dakar présente une excellente disponibilité des équipements critiques pour l'Afrique de l'Ouest."
      }
    }
  },
  'DEMO-2026': {
    id: 'generic',
    name: 'Espace Partenaire B2B',
    title: 'Espace Démo Sécurisé',
    headerText: 'PROTOCOLE PARTENAIRE AVENITECH ACTIF',
    welcomeMessage: 'Bienvenue dans le portail d\'évaluation général d\'AveniTech. Saisissez ou choisissez un document d\'évaluation type pour analyser en direct notre capacité d\'extraction sémantique, de classification et de notation de dossiers réglementaires complexes.',
    docs: [
      'Contrat_Prestation_Services.pdf',
      'Rapport_Audit_Securite_Standard.pdf'
    ],
    scanResults: {
      'Contrat_Prestation_Services.pdf': {
        detectedOrg: "AveniTech Partner Enterprise",
        score: 91.5,
        criteria: [
          { name: "Limitation de responsabilité", status: "VALIDE", note: "Clause de responsabilité plafonnée standard" },
          { name: "Propriété intellectuelle", status: "CONFORME", note: "Cession exclusive du code applicatif au client" },
          { name: "Loi applicable (Espace OHADA)", status: "VALIDE", note: "Tribunal de commerce de Dakar compétent" }
        ],
        aiSummary: "Le document juridique respecte l'équilibre contractuel B2B. Risque juridique minime. Recommandation : Signature autorisée."
      },
      'Rapport_Audit_Securite_Standard.pdf': {
        detectedOrg: "AveniTech Partner Enterprise",
        score: 96.4,
        criteria: [
          { name: "Tests d'intrusion externes", status: "EXCELLENT", note: "Zéro vulnérabilité critique détectée" },
          { name: "Politique de gestion des accès", status: "VALIDE", note: "MFA obligatoire sur tous les terminaux" }
        ],
        aiSummary: "L'infrastructure technique présente un niveau de sécurité exceptionnel. Recommandation : Certification SOC 2 en cours."
      }
    }
  }
};

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('process');
  const [selectedProcessStep, setSelectedProcessStep] = useState(1);
  const [selectedPilotProject, setSelectedPilotProject] = useState('msf');
  const [copiedStatus, setCopiedStatus] = useState(false);
  
  // Interactive IA Workflow Simulation State
  const [workflowState, setWorkflowState] = useState('idle'); // idle -> scanning -> analyzing -> complete
  const [aiScore, setAiScore] = useState(0);
  const [workflowOutput, setWorkflowOutput] = useState([]);
  
  // Dynamic Multi-Project Evaluator Portal State
  const [accessCode, setAccessCode] = useState('');
  const [activeTenantKey, setActiveTenantKey] = useState(null); // 'OIF-2026', 'MSF-2026', 'DEMO-2026'
  const [portalError, setPortalError] = useState(false);
  const [simulatedDocText, setSimulatedDocText] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);


  // Contact Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    role: '',
    companyName: '',
    companyWebsite: '',
    companySize: '',
    annualRevenue: '',
    projectBudget: '',
    servicesOfInterest: '',
    message: ''
  });


  // Refs for GSAP
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef = useRef(null);
  const orbsRef = useRef(null);

  // GSAP Entrance Animations
  useEffect(() => {
    // Animate Hero elements
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(heroTitleRef.current, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 1.2, delay: 0.2 }
    );
    tl.fromTo(heroSubRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1 },
      '-=0.8'
    );
    tl.fromTo(heroBtnRef.current, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    );

    // Subtle background float via GSAP
    gsap.to('.bg-orb-1', {
      x: '30px',
      y: '-40px',
      scale: 1.1,
      duration: 10,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
    gsap.to('.bg-orb-2', {
      x: '-30px',
      y: '45px',
      scale: 0.9,
      duration: 12,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1
    });
  }, []);

  // Run Simulated Document Processing for Expertises Card
  const startSimulation = () => {
    if (workflowState === 'scanning' || workflowState === 'analyzing') return;
    
    setWorkflowState('scanning');
    setAiScore(0);
    setWorkflowOutput(['[SYSTEM] Initialisation de la session de traitement documentaire...']);
    
    setTimeout(() => {
      setWorkflowOutput(prev => [...prev, '[SYSTEM] Document détecté : Statuts_Asso_MSF_Pilote.pdf', '[OCR] Extraction textuelle en cours...']);
      setWorkflowState('analyzing');
    }, 1500);

    setTimeout(() => {
      setWorkflowOutput(prev => [...prev, '[IA-SEMANTIC] Lancement du moteur sémantique multilingue...', '[IA-SEMANTIC] Recherche de clauses de conformité administrative...', '[IA-SEMANTIC] Analyse de la solvabilité financière...']);
    }, 3000);

    setTimeout(() => {
      setWorkflowOutput(prev => [...prev, '[IA-SEMANTIC] Validation : Document 100% conforme sous charte OHADA.', '[SYSTEM] Compilation du score d\'éligibilité opérationnelle...']);
      setWorkflowState('complete');
      setAiScore(98.4);
    }, 5500);
  };

  // Run Evaluator Portal Simulation (Dynamic multi-tenant)
  const handlePortalUnlock = (e) => {
    e.preventDefault();
    const code = accessCode.trim().toUpperCase();
    if (TENANTS[code]) {
      setActiveTenantKey(code);
      setPortalError(false);
      
      // Auto-set the first simulated document of this tenant
      const tenant = TENANTS[code];
      if (tenant.docs && tenant.docs.length > 0) {
        setSimulatedDocText(tenant.docs[0]);
      }
      
      setWorkflowOutput(prev => [...prev, `[SECURITY] Accès autorisé à l'espace d'évaluation ${tenant.title}. Confidentialité active.`]);
    } else {
      setPortalError(true);
      setTimeout(() => setPortalError(false), 2000);
    }
  };

  // Simulated Document Scanning in portal (Dynamic multi-tenant)
  const handlePortalScan = () => {
    if (!activeTenantKey) return;
    const tenant = TENANTS[activeTenantKey];
    const docResult = tenant.scanResults[simulatedDocText];

    setIsScanning(true);
    setScanProgress(0);
    setAnalysisResult(null);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          if (docResult) {
            setAnalysisResult({
              detectedOrg: docResult.detectedOrg,
              score: docResult.score,
              criteria: docResult.criteria,
              aiSummary: docResult.aiSummary
            });
          } else {
            // Fallback generic result if not pre-defined
            setAnalysisResult({
              detectedOrg: "Organisation Partenaire",
              score: 85.0,
              criteria: [
                { name: "Format du fichier", status: "VALIDE", note: "PDF standard lisible" },
                { name: "Contenu détecté", status: "VALIDE", note: "Structure valide" }
              ],
              aiSummary: "Document analysé avec succès. Aucune clause à risque majeure détectée."
            });
          }
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  // Handle Contact Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formValues.role || !formValues.companyName || !formValues.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormValues({
        role: '',
        companyName: '',
        companyWebsite: '',
        companySize: '',
        annualRevenue: '',
        projectBudget: '',
        servicesOfInterest: '',
        message: ''
      });
    }, 3000);
  };


  return (
    <div className="relative min-h-screen flex flex-col font-sans select-none overflow-hidden">
      
      {/* Background Orbs */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none z-0">
        <div className="bg-orb-1 absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00E699]/10 blur-[140px] filter opacity-75"></div>
        <div className="bg-orb-2 absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#DFBA6B]/15 blur-[140px] filter opacity-50"></div>
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-[#10B981]/5 blur-[120px] filter opacity-30"></div>
      </div>

      {/* --- Section 0 : FLOT FLOTTANTE NAVBAR --- */}
      <header className="sticky top-6 z-40 w-full px-6 flex justify-center">
        <nav className="w-full max-w-5xl glass-panel rounded-full px-6 py-4 flex items-center justify-between border border-white/10 shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
              <Cpu className="text-mint w-6 h-6 animate-pulse" />
              Aveni<span className="text-mint">Tech</span>
              <span className="text-[10px] text-goldSable border border-goldSable/30 px-1.5 py-0.5 rounded tracking-widest font-mono font-medium">ENTERPRISE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-alabaster/70">
            <a href="#process" className="hover:text-mint transition-colors">Procédé</a>
            <a href="#expertises" className="hover:text-mint transition-colors">Solutions</a>
            <a href="#showcase" className="hover:text-mint transition-colors">Récit Pilote</a>
            <a href="#commitments" className="hover:text-mint transition-colors">Souveraineté</a>
            <a href="#demo-portal" className="text-goldSable/90 hover:text-goldSable border border-goldSable/40 hover:border-goldSable/80 rounded-full px-3.5 py-1.5 bg-goldSable/5 transition-all text-xs font-mono tracking-wide flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Espace Démo
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden sm:inline-flex items-center gap-2 bg-mint hover:bg-emeraldCustom text-obsidian px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(0,230,153,0.3)] hover:shadow-[0_0_20px_rgba(0,230,153,0.5)] active:scale-95 font-semibold">
              Prendre Contact
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* --- Section 1 : THE HERO --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 flex flex-col items-center">
        <section className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full border border-mint/20 bg-mint/5 text-mint text-xs font-semibold tracking-wider uppercase font-mono mb-8 animate-fade-in shadow-[0_0_15px_rgba(0,230,153,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint status-dot-active"></span>
            </span>
            IA & Solutions Technologiques Souveraines
          </div>

          <h1 ref={heroTitleRef} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] select-none">
            L'IA Souveraine rencontre <br />
            <span className="font-garamond italic text-goldSable font-normal tracking-wide text-5xl md:text-8xl block mt-2">La Décision Humaine.</span>
          </h1>

          <p ref={heroSubRef} className="text-lg md:text-xl text-alabaster/70 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            AveniTech conçoit des plateformes numériques intelligentes pour les institutions publiques et les organisations à impact. Nous optimisons les workflows administratifs complexes et automatisons le traitement documentaire, en combinant des protocoles hautement sécurisés et l'Intelligence Artificielle.
          </p>

          <div ref={heroBtnRef} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a href="#demo-portal" className="w-full sm:w-auto bg-mint hover:bg-emeraldCustom text-obsidian px-8 py-4 rounded-full font-semibold text-base transition-all shadow-[0_0_20px_rgba(0,230,153,0.3)] hover:shadow-[0_0_30px_rgba(0,230,153,0.5)] active:scale-95 flex items-center justify-center gap-3">
              <Unlock className="w-4 h-4" /> Tester le Démonstrateur
            </a>
            <a href="#expertises" className="w-full sm:w-auto border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-8 py-4 rounded-full font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-3">
              Découvrir nos Expertises
            </a>
          </div>
        </section>

        {/* Hero Interactive Visualization - Mock Dashboard Preview */}
        <div className="w-full max-w-5xl glass-panel rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative mb-32 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-mint/5 to-transparent opacity-50 pointer-events-none"></div>
          
          {/* Dashboard Header decoration */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
              <span className="text-xs font-mono text-alabaster/40 ml-4 tracking-widest uppercase">avenitech-platform-v1.0.4-live</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-mint/80 bg-mint/5 border border-mint/20 rounded px-2.5 py-1">
              <Activity className="w-3 h-3 animate-pulse" /> LIVE METRICS
            </div>
          </div>

          {/* Dummy visual blocks simulating complex institutional workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-mint/20 transition-all duration-300">
              <span className="text-xs text-alabaster/40 font-mono tracking-wider block mb-1">CAPACITÉ D'EXTRACTION</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">1 200 req</span>
                <span className="text-xs text-mint font-mono">/ sec</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-mint h-full rounded-full transition-all duration-500" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-mint/20 transition-all duration-300">
              <span className="text-xs text-alabaster/40 font-mono tracking-wider block mb-1">PRÉCISION OCR SÉMANTIQUE</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-goldSable font-mono">99.2%</span>
                <span className="text-xs text-goldSable font-mono">Modèle NER</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-goldSable h-full rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-mint/20 transition-all duration-300">
              <span className="text-xs text-alabaster/40 font-mono tracking-wider block mb-1">TEMPS DE RÉPONSE IA</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">&lt; 0.8s</span>
                <span className="text-xs text-mint font-mono">Explicable</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-mint h-full rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2 : LE PROCÉDÉ INTERACTIF (TIMELINE) --- */}
        <section id="process" className="w-full max-w-5xl mb-32 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-mint font-mono text-xs uppercase tracking-widest font-semibold block mb-3">CONTRÔLE & EXÉCUTION</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Notre procédé d'intégration</h2>
            <p className="text-alabaster/60 font-light">
              Nous appliquons un protocole rigoureux en 4 étapes majeures, garantissant une intégration technologique transparente sans perturber vos équipes administratives.
            </p>
          </div>

          {/* Interactive Steps selection buttons */}
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 mb-10">
            {[
              { id: 1, num: '01', title: 'Cadrage Institutionnel' },
              { id: 2, num: '02', title: 'Architecture & Sécurité' },
              { id: 3, num: '03', title: 'Intégration IA Appliquée' },
              { id: 4, num: '04', title: 'Recette & Autonomie' }
            ].map((step) => (
              <button
                key={step.id}
                onClick={() => setSelectedProcessStep(step.id)}
                className={`flex-1 min-w-[200px] px-6 py-4 rounded-2xl border text-left transition-all duration-300 ${
                  selectedProcessStep === step.id 
                    ? 'bg-mint/5 border-mint text-white shadow-[0_0_15px_rgba(0,230,153,0.1)]' 
                    : 'bg-black/20 border-white/5 text-alabaster/50 hover:bg-white/5'
                }`}
              >
                <span className={`text-xs font-mono font-bold block mb-1 ${selectedProcessStep === step.id ? 'text-mint' : 'text-alabaster/30'}`}>{step.num}</span>
                <span className="text-sm font-semibold tracking-wide block">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Selected Step Detail Panel */}
          <div className="glass-panel rounded-3xl border border-white/10 p-8 md:p-10 relative overflow-hidden transition-all duration-500">
            <div className="absolute right-[-5%] bottom-[-5%] text-[10rem] font-bold text-white/[0.02] select-none font-mono">
              0{selectedProcessStep}
            </div>

            {selectedProcessStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-mint/10 border border-mint/20 text-mint flex items-center justify-center mb-6">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">01. Cadrage Institutionnel & Cartographie</h3>
                  <p className="text-alabaster/70 font-light mb-6 leading-relaxed">
                    Nous débutons par une étude approfondie de vos processus internes de dépôt et de traitement. Nos équipes cartographient les grilles réglementaires de vos appels à projets et documentent les goulots d'étranglement administratifs.
                  </p>
                  <ul className="space-y-3.5 text-sm text-alabaster/80">
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-mint flex-shrink-0" /> Audit complet des flux de travail actuels</li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-mint flex-shrink-0" /> Alignement réglementaire et institutionnel</li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-mint flex-shrink-0" /> Définition des indicateurs clés (KPIs) de succès</li>
                  </ul>
                </div>
                <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-xs text-alabaster/60 space-y-4">
                  <span className="text-mint font-bold block">// PROCESS LOG: CADRAGE</span>
                  <div>
                    <span className="text-white block font-semibold">&gt; Analysing administrative constraints...</span>
                    <span>14 criteria mapped including financial thresholds & organizational eligibility.</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <span className="text-white block font-semibold">&gt; Objective defined:</span>
                    <span>Accelerate the document evaluation workflow while maintaining absolute compliance and trace-auditing.</span>
                  </div>
                </div>
              </div>
            )}

            {selectedProcessStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-goldSable/10 border border-goldSable/20 text-goldSable flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">02. Architecture & Sécurité Souveraine</h3>
                  <p className="text-alabaster/70 font-light mb-6 leading-relaxed">
                    Toutes nos plateformes sont sécurisées par défaut. Nous mettons en œuvre un chiffrement asymétrique de pointe (AES-256) pour garantir la confidentialité absolue des dossiers soumis par les candidates et candidats, en parfaite conformité avec le RGPD.
                  </p>
                  <ul className="space-y-3.5 text-sm text-alabaster/80">
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-goldSable flex-shrink-0" /> Isolement étanche des bases de données</li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-goldSable flex-shrink-0" /> Chiffrement des flux (HTTPS, TLS 1.3)</li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-goldSable flex-shrink-0" /> Authentification par rôle avec traçabilité complète</li>
                  </ul>
                </div>
                <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-xs text-alabaster/60 space-y-4">
                  <span className="text-goldSable font-bold block">// SECURITY LOG: COMPLIANCE</span>
                  <div>
                    <span className="text-white block font-semibold">&gt; Encryption standards:</span>
                    <span>Database: encrypted using AES-GCM 256. Connections restricted.</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <span className="text-white block font-semibold">&gt; RGPD Checklist:</span>
                    <span>Consent logging, user data exportability, immediate destruction protocols. STATUS: VALIDATED.</span>
                  </div>
                </div>
              </div>
            )}

            {selectedProcessStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-mint/10 border border-mint/20 text-mint flex items-center justify-center mb-6">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">03. Intégration IA Appliquée</h3>
                  <p className="text-alabaster/70 font-light mb-6 leading-relaxed">
                    Nous déployons notre moteur d'Intelligence Artificielle d'analyse sémantique multilingue. Il procède à la lecture assistée, extrait les informations clés des dossiers (statuts, budgets, pièces d'identité) et calcule un score d'éligibilité pour les instructeurs.
                  </p>
                  <ul className="space-y-3.5 text-sm text-alabaster/80">
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-mint flex-shrink-0" /> OCR robuste de documents manuscrits/scannés</li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-mint flex-shrink-0" /> Évaluation objective sans biais d'origine</li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-mint flex-shrink-0" /> Explicabilité complète de chaque résultat</li>
                  </ul>
                </div>
                <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-xs text-alabaster/60 space-y-4">
                  <span className="text-mint font-bold block">// IA PIPELINE STATUS</span>
                  <div className="flex items-center justify-between">
                    <span>Moteur IA Actif</span>
                    <span className="text-mint font-bold font-mono">ONLINE</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded overflow-hidden">
                    <div className="bg-mint h-full" style={{ width: '92%' }}></div>
                  </div>
                  <div className="text-[10px] text-alabaster/40 font-mono">
                    NER extraction model loaded. Threshold config value: 0.85
                  </div>
                </div>
              </div>
            )}

            {selectedProcessStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-goldSable/10 border border-goldSable/20 text-goldSable flex items-center justify-center mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">04. Recette, Souveraineté & Transfert</h3>
                  <p className="text-alabaster/70 font-light mb-6 leading-relaxed">
                    La réussite d'un projet réside dans son appropriation par ses utilisateurs. Nous assurons un transfert technologique total. Nous fournissons des documentations claires, animons des webinaires de prise en main et assurons le support technique.
                  </p>
                  <ul className="space-y-3.5 text-sm text-alabaster/80">
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-goldSable flex-shrink-0" /> Formation et ateliers pratiques pour vos agents</li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-goldSable flex-shrink-0" /> Transfert des compétences techniques et codes sources</li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-goldSable flex-shrink-0" /> Maintenance évolutive et support 5 ans garanti</li>
                  </ul>
                </div>
                <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-xs text-alabaster/60 space-y-4">
                  <span className="text-goldSable font-bold block">// KNOWLEDGE TRANSFER</span>
                  <div className="flex items-center justify-between">
                    <span>Documentation compilée</span>
                    <span className="text-mint">100% OK</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Webinaires programmés</span>
                    <span className="text-white">Actif</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Autonomie opérationnelle</span>
                    <span className="text-mint">Assurée</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- Section 3 : SOLUTIONS & EXPERTISES (INTERACTIVE CARDS) --- */}
        <section id="expertises" className="w-full max-w-5xl mb-32 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-mint font-mono text-xs uppercase tracking-widest font-semibold block mb-3">ARTEFACTS TECHNOLOGIQUES</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Nos solutions sur-mesure</h2>
            <p className="text-alabaster/60 font-light">
              Des technologies robustes et auditées, développées pour répondre aux enjeux de traitement à grande échelle des ministères et organisations mondiales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Interactive Workflow Simulator */}
            <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative group min-h-[460px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono text-mint border border-mint/30 px-2 py-0.5 rounded bg-mint/5 uppercase tracking-wider">MODULE ACTIF</span>
                  <Layers className="w-5 h-5 text-mint" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Gestion intelligente des workflows</h3>
                <p className="text-alabaster/60 text-sm font-light mb-6">
                  Suivi dynamique des dossiers de candidature par étape. Idéal pour piloter l'éligibilité de milliers d'ONG simultanément.
                </p>

                {/* Micro simulator widget inside card */}
                <div className="bg-black/50 border border-white/5 rounded-2xl p-4 font-mono text-[11px] text-alabaster/70 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span>ID_Dossier: #AMTF-22</span>
                    <span className="text-goldSable">En Cours</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-alabaster/40">
                      <span>Vérification administrative</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded overflow-hidden">
                      <div className="bg-mint h-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-mint">
                    <Check className="w-3 h-3" /> Statuts & Pièces valides
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <span className="text-xs text-mint font-semibold hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  Découvrir le module <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 2: Simulated AI Text Télémétrie */}
            <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative group min-h-[460px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono text-goldSable border border-goldSable/30 px-2 py-0.5 rounded bg-goldSable/5 uppercase tracking-wider">MOTEUR COGNITIF</span>
                  <Terminal className="w-5 h-5 text-goldSable" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Traitement Documentaire IA</h3>
                <p className="text-alabaster/60 text-sm font-light mb-6">
                  Extraction et pré-analyse textuelle sémantique de toutes vos pièces administratives (statuts, rapports, pièces d'identité).
                </p>

                {/* Console widget for telemetry analysis simulation */}
                <div className="bg-black/60 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-alabaster/60 h-44 overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-1.5 scrollbar-thin">
                    {workflowOutput.length === 0 ? (
                      <span className="text-alabaster/40 block">// Console prête. Cliquez sur Démarrer ci-dessous pour simuler l'analyse de documents.</span>
                    ) : (
                      workflowOutput.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {log}
                        </div>
                      ))
                    )}
                  </div>

                  {workflowState === 'complete' && (
                    <div className="flex justify-between items-center bg-mint/5 border border-mint/20 rounded px-2 py-1 mt-2 text-mint font-bold font-mono">
                      <span>SCORE GLOBALE:</span>
                      <span>{aiScore}% (CONFORME)</span>
                    </div>
                  )}

                  {workflowState !== 'scanning' && workflowState !== 'analyzing' && (
                    <button 
                      onClick={startSimulation}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded py-2 transition-all mt-2 active:scale-95 font-semibold text-[10px]"
                    >
                      Démarrer Simulation IA
                    </button>
                  )}
                  {(workflowState === 'scanning' || workflowState === 'analyzing') && (
                    <div className="flex items-center justify-center gap-2 py-2 mt-2 text-mint font-mono font-bold animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Traitement IA en cours...
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <span className="text-xs text-goldSable font-semibold hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  Découvrir le module <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 3: Security & Sovereign check */}
            <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative group min-h-[460px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono text-mint border border-mint/30 px-2 py-0.5 rounded bg-mint/5 uppercase tracking-wider">GARANTIE SÉCURITÉ</span>
                  <Shield className="w-5 h-5 text-mint" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Souveraineté & Conformité RGPD</h3>
                <p className="text-alabaster/60 text-sm font-light mb-6">
                  Isolation totale de vos serveurs de base de données. Garantit que les données restent au sein de l'espace francophone.
                </p>

                {/* Checklist UI */}
                <div className="bg-black/50 border border-white/5 rounded-2xl p-4 space-y-3 text-xs text-alabaster/80">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-mint flex-shrink-0" />
                    <span>Chiffrement asymétrique (AES-256)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-mint flex-shrink-0" />
                    <span>Zéro transfert hors UE / Afrique de l'Ouest</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-mint flex-shrink-0" />
                    <span>Moteur IA explicable sans boîte noire</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-mint flex-shrink-0" />
                    <span>Suppression immédiate des données sur demande</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <span className="text-xs text-mint font-semibold hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  Consulter les spécifications <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* --- Section 4 : SHOWCASE/PORTFOLIO (HONEST & HIGH-VALUE REALISATIONS) --- */}
        <section id="showcase" className="w-full max-w-5xl mb-32 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-mint font-mono text-xs uppercase tracking-widest font-semibold block mb-3">SHOWCASE & RÉALISATIONS DÉMO</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Notre récit de réalisations</h2>
            <p className="text-alabaster/60 font-light">
              Découvrez les projets pilotes fonctionnels menés à bien par nos ingénieurs fondateurs au service de la gestion d'activités et d'impact.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <button 
              onClick={() => setSelectedPilotProject('msf')}
              className={`px-6 py-2.5 rounded-full border text-sm font-semibold transition-all ${
                selectedPilotProject === 'msf' 
                  ? 'bg-mint text-obsidian border-mint shadow-[0_0_15px_rgba(0,230,153,0.2)]' 
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              Projet Pilote MSF-Ops
            </button>
            <button 
              onClick={() => setSelectedPilotProject('amtf')}
              className={`px-6 py-2.5 rounded-full border text-sm font-semibold transition-all ${
                selectedPilotProject === 'amtf' 
                  ? 'bg-mint text-obsidian border-mint shadow-[0_0_15px_rgba(0,230,153,0.2)]' 
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              Plateforme AMTF Connect
            </button>
          </div>

          {/* Project Details Box */}
          <div className="glass-panel rounded-3xl border border-white/10 p-6 md:p-10">
            {selectedPilotProject === 'msf' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-xs font-mono text-goldSable uppercase tracking-wider mb-2 block">// PILOTE OPÉRATIONNEL HUMANITAIRE</span>
                  <h3 className="text-3xl font-extrabold text-white mb-4">MSF-Ops : Outils de suivi d'activités & ressources</h3>
                  <p className="text-alabaster/70 font-light mb-6 leading-relaxed">
                    Une application complexe d'organisation et de reporting d'activités médicales sur le terrain. Conçue pour simplifier la vie des coordinateurs de projets, elle centralise les rapports opérationnels d'urgence et valide le bon dimensionnement logistique.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                      <span className="text-[10px] font-mono text-alabaster/40 block">BANC D'ESSAI CHARGE</span>
                      <span className="text-xl font-bold text-white font-mono">10 000+ logs</span>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                      <span className="text-[10px] font-mono text-alabaster/40 block">VITESSE DE GÉNÉRATION</span>
                      <span className="text-xl font-bold text-mint font-mono">&lt; 1.5s</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">NodeJS</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">React 19</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">PostgreSQL</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">Docker</span>
                  </div>
                </div>
                <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  {/* Mock Screenshot representation */}
                  <div className="bg-slate-900 aspect-video flex flex-col p-4 font-mono text-[10px] text-alabaster/60 select-none">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                      <span className="text-white font-bold tracking-wide">MSF-Ops // Dashboard principal</span>
                      <span className="text-mint font-bold">• CONNECTÉ</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-slate-800/80 p-2.5 rounded border border-white/5">
                        <span className="block text-[8px] text-alabaster/40">URGENCES SIGNALÉES</span>
                        <span className="text-xs text-white font-bold">12 Régions</span>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded border border-white/5">
                        <span className="block text-[8px] text-alabaster/40">STAFF DEPLOYÉ</span>
                        <span className="text-xs text-white font-bold">142 Actifs</span>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded border border-white/5">
                        <span className="block text-[8px] text-alabaster/40">LIVRAISONS LOGS</span>
                        <span className="text-xs text-mint font-bold">Conforme</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-black/40 rounded p-3 border border-white/5 flex flex-col justify-between">
                      <span className="text-white font-semibold block mb-2">&gt; Opérations récentes (Dakar, Sénégal) :</span>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] text-white/50">
                          <span>• Approvisionnement pharmacie centrale</span>
                          <span className="text-mint font-bold">EFFECTUÉ</span>
                        </div>
                        <div className="flex justify-between text-[8px] text-white/50">
                          <span>• Répartition cliniques mobiles - Secteur Est</span>
                          <span className="text-mint font-bold">EN COURS</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded overflow-hidden mt-2">
                        <div className="bg-mint h-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-xs font-mono text-goldSable uppercase tracking-wider mb-2 block">// SYSTEME DE GESTION COMMUNAUTAIRE</span>
                  <h3 className="text-3xl font-extrabold text-white mb-4">AMTF Connect : Adhésions & Workflow</h3>
                  <p className="text-alabaster/70 font-light mb-6 leading-relaxed">
                    Une plateforme de gestion d'adhésions de masse et de pilotage d'activités internes développée pour l'Association des Médecins du Tiers Monde (AMTF). Elle intègre la validation automatisée des justificatifs professionnels et simplifie la communication inter-membres.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                      <span className="text-[10px] font-mono text-alabaster/40 block">INDEXATION REGISTRE</span>
                      <span className="text-xl font-bold text-white font-mono">5 000 fiches/s</span>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                      <span className="text-[10px] font-mono text-alabaster/40 block">TEMPS DE DÉCRYPTAGE</span>
                      <span className="text-xl font-bold text-mint font-mono">&lt; 2.0s</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">TailwindCSS</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">React 19</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">Python Fast-API</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">MongoDB</span>
                  </div>
                </div>
                <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  {/* Mock Screenshot representation */}
                  <div className="bg-slate-900 aspect-video flex flex-col p-4 font-mono text-[10px] text-alabaster/60 select-none">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                      <span className="text-white font-bold tracking-wide">AMTF Connect // Gestion des Membres</span>
                      <span className="text-goldSable font-bold">• SECURE</span>
                    </div>
                    <div className="flex-1 bg-black/40 rounded p-3 border border-white/5 flex flex-col justify-between">
                      <span className="text-white font-semibold block mb-2">&gt; Justificatifs professionnels à instruire :</span>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                          <span>Dr. Fatou Diop (Médecin - Dakar)</span>
                          <span className="px-2 py-0.5 rounded bg-mint/10 text-mint text-[8px] font-bold">VÉRIFIÉ</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                          <span>Dr. Jean-Marc Leduc (Pédiatre - Lyon)</span>
                          <span className="px-2 py-0.5 rounded bg-mint/10 text-mint text-[8px] font-bold">VÉRIFIÉ</span>
                        </div>
                      </div>
                      <div className="text-[9px] text-alabaster/40 mt-2 font-mono">
                        Statut global du registre : Mis à jour il y a 3 min.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- Section 5 : SECURITE, RGPD & SOUVERAINETÉ (RASSURANCE) --- */}
        <section id="commitments" className="w-full max-w-5xl mb-32 scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-gradient-to-tr from-mint/[0.02] to-transparent p-8 md:p-12 rounded-[2.5rem] border border-white/10">
            <div className="lg:col-span-7">
              <span className="text-mint font-mono text-xs uppercase tracking-widest font-semibold block mb-3">NORME DE CONFIANCE</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Un engagement souverain au service de l'écosystème francophone</h2>
              <p className="text-alabaster/70 font-light mb-6 leading-relaxed">
                Toutes nos infrastructures logicielles respectent strictement la réglementation générale sur la protection des données (RGPD). Nous garantissons que l'hébergement de vos dossiers de candidatures sensibles est opéré au sein de l'espace francophone européen ou ouest-africain, à l'abri de toute ingérence extra-territoriale.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-mint shadow-[0_0_8px_#00E699]"></div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Hébergement en Union Européenne</h4>
                    <p className="text-xs text-alabaster/50 font-light">Opéré sur des infrastructures souveraines cryptées.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-mint shadow-[0_0_8px_#00E699]"></div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Explicabilité de l'IA (No Black-Box)</h4>
                    <p className="text-xs text-alabaster/50 font-light">Chaque suggestion de décision est traçable et modifiable.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 rounded-full border border-mint/20 flex items-center justify-center bg-mint/5 shadow-[0_0_30px_rgba(0,230,153,0.05)]">
                <div className="absolute inset-4 rounded-full border border-white/5 flex items-center justify-center bg-black/40">
                  <Shield className="w-16 h-16 text-mint" />
                </div>
                <div className="absolute inset-10 rounded-full border border-mint/10 animate-spin" style={{ animationDuration: '20s' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 6 : PORTAL ÉVALUATEUR MULTI-TENANT SIMULATION --- */}
        <section id="demo-portal" className="w-full max-w-5xl mb-32 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-goldSable font-mono text-xs uppercase tracking-widest font-semibold block mb-3">ESPACE CONFIDENTIEL</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Simulateur de Portails Clients</h2>
            <p className="text-alabaster/60 font-light">
              Entrez le code d'accès sécurisé fourni dans notre dossier technique ou d'offre de services pour déverrouiller la simulation et le tableau de bord pré-paramétré.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-black/40 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-goldSable/5 border-b border-l border-goldSable/20 px-4 py-1.5 text-[9px] font-mono text-goldSable uppercase rounded-bl-xl tracking-wider">
              ZONE DE SÉCURITÉ CONFORME
            </div>

            {!activeTenantKey ? (
              <form onSubmit={handlePortalUnlock} className="flex flex-col items-center py-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-goldSable/10 border border-goldSable/20 text-goldSable flex items-center justify-center mb-2">
                  <Lock className="w-8 h-8" />
                </div>
                
                <div className="w-full max-w-sm text-center">
                  <label className="block text-xs font-mono text-alabaster/40 uppercase tracking-widest mb-3">CODE D'ACCÈS PORTAIL SIMULATEUR</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Ex: OIF-2026, MSF-2026..."
                      className={`flex-1 bg-white/5 border rounded-full px-5 py-3 text-center text-white focus:outline-none font-mono text-sm tracking-widest transition-all ${
                        portalError ? 'border-red-500 bg-red-500/5 text-red-400' : 'border-white/10 focus:border-goldSable'
                      }`}
                    />
                    <button 
                      type="submit" 
                      className="bg-goldSable hover:bg-[#c9a84c] text-obsidian px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center gap-2"
                    >
                      DÉVERROUILLER
                    </button>
                  </div>
                  {portalError && (
                    <span className="text-[10px] text-red-500 font-mono block mt-2 animate-pulse">Code erroné. Veuillez saisir un code valide (ex: OIF-2026, MSF-2026, DEMO-2026).</span>
                  )}
                </div>

                <div className="text-center text-xs text-alabaster/40 font-mono">
                  🔑 Saisissez <span className="text-goldSable font-bold">OIF-2026</span>, <span className="text-mint font-bold">MSF-2026</span> ou <span className="text-mint font-bold">DEMO-2026</span> pour tester l'interface de pré-évaluation en direct.
                </div>
              </form>
            ) : (
              <div className="space-y-8 animate-fade-in">
                {/* Custom Personalized Dashboard header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6">
                  <div>
                    <span className="text-[10px] text-goldSable font-mono uppercase tracking-widest block mb-1">
                      {TENANTS[activeTenantKey].headerText}
                    </span>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Unlock className="text-mint w-5 h-5" /> {TENANTS[activeTenantKey].name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => { setActiveTenantKey(null); setAccessCode(''); setAnalysisResult(null); }}
                    className="mt-3 sm:mt-0 bg-white/5 hover:bg-white/10 border border-white/10 text-alabaster/70 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all active:scale-95"
                  >
                    Fermer la session sécurisée
                  </button>
                </div>

                <div className="bg-mint/5 border border-mint/20 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <Award className="text-mint w-8 h-8 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">Message Spécial aux Évaluateurs :</h4>
                      <p className="text-xs text-alabaster/80 leading-relaxed font-light font-sans">
                        {TENANTS[activeTenantKey].welcomeMessage}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live simulation inside unlocked portal */}
                <div className="border border-white/10 rounded-2xl bg-black/60 p-6">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Terminal className="text-mint w-4 h-4" /> Simulateur de Pré-Évaluation Documentaire IA
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] text-alabaster/40 font-mono uppercase tracking-wider mb-2">Simuler le dépôt d'une pièce administrative :</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select 
                          value={simulatedDocText}
                          onChange={(e) => setSimulatedDocText(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-mint font-mono"
                        >
                          {TENANTS[activeTenantKey].docs.map((doc, idx) => (
                            <option key={idx} value={doc} className="bg-obsidian">
                              {doc}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handlePortalScan}
                          disabled={isScanning}
                          className="bg-mint hover:bg-emeraldCustom text-obsidian px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 animate-pulse"
                        >
                          {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                          {isScanning ? 'ANALYSE EN COURS...' : 'LANCER L\'ANALYSE'}
                        </button>
                      </div>
                    </div>

                    {isScanning && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-alabaster/40">
                          <span>Lecture OCR & Classification sémantique...</span>
                          <span>{scanProgress}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded overflow-hidden">
                          <div className="bg-mint h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {analysisResult && (
                      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-xl space-y-4 animate-fade-in text-xs">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
                          <div>
                            <span className="text-[10px] text-alabaster/40 font-mono block">ORGANISATION DÉTECTÉE</span>
                            <span className="font-semibold text-white">{analysisResult.detectedOrg}</span>
                          </div>
                          <div className="bg-mint/10 border border-mint/30 rounded px-2.5 py-1 text-mint font-mono font-bold text-center">
                            SCORE IA D'ÉLIGIBILITÉ : {analysisResult.score}%
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <span className="text-[10px] text-alabaster/40 font-mono block uppercase tracking-wider">CRITÈRES VÉRIFIÉS PAR LE MOTEUR AVENITECH</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[10px]">
                            {analysisResult.criteria.map((crit, idx) => (
                              <div key={idx} className="bg-black/40 p-2.5 rounded border border-white/5 flex justify-between items-center">
                                <div>
                                  <span className="block text-white font-medium">{crit.name}</span>
                                  <span className="text-alabaster/40">{crit.note}</span>
                                </div>
                                <span className="text-mint font-bold">{crit.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 bg-mint/[0.01] p-3 rounded">
                          <span className="text-[10px] text-mint font-mono block mb-1 font-bold">📄 COMPTE-RENDU EXPLICABLE DE L'IA</span>
                          <p className="text-alabaster/70 text-[11px] leading-relaxed font-light">
                            {analysisResult.aiSummary}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- Section 7 : FORMULAIRE DE CONTACT --- */}
        <section id="contact" className="w-full max-w-3xl mb-24 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-mint font-mono text-xs uppercase tracking-widest font-semibold block mb-3">COLLABORATION B2B</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Initialiser le protocole</h2>
            <p className="text-alabaster/60 font-light">
              Entrons en contact pour concevoir, sécuriser et déployer vos infrastructures intelligentes et souveraines.
            </p>
          </div>

          <div className="glass-panel border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
            {formSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-mint/10 border border-mint/20 text-mint flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Protocole envoyé avec succès !</h3>
                <p className="text-sm text-alabaster/60 max-w-sm mx-auto">
                  Nos équipes d'ingénieurs analysent votre message. Nous vous répondrons sous 24 heures ouvrées.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-left">
                  {/* Rôle */}
                  <div className="space-y-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-white">
                      Quel est votre rôle dans l'entreprise ? <span className="text-[#a3a3a3] text-xs ml-1">•</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formValues.role}
                      onChange={(e) => setFormValues({...formValues, role: e.target.value})}
                      placeholder="Saisissez votre rôle"
                      className="w-full bg-[#161616] border border-white/5 focus:border-mint/30 focus:outline-none rounded-md px-4 py-3 text-sm text-[#dfdfdf] placeholder:text-[#4b4b4b] transition-all"
                    />
                  </div>
                  
                  {/* Spacer to keep it single column half-width on md */}
                  <div className="hidden md:block"></div>

                  {/* Nom Entreprise */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Nom Entreprise <span className="text-[#a3a3a3] text-xs ml-1">•</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formValues.companyName}
                      onChange={(e) => setFormValues({...formValues, companyName: e.target.value})}
                      placeholder="Saisissez le nom de l'entreprise"
                      className="w-full bg-[#161616] border border-white/5 focus:border-mint/30 focus:outline-none rounded-md px-4 py-3 text-sm text-[#dfdfdf] placeholder:text-[#4b4b4b] transition-all"
                    />
                  </div>

                  {/* Site web Entreprise */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Site web Entreprise <span className="text-[#a3a3a3] text-xs ml-1">•</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formValues.companyWebsite}
                      onChange={(e) => setFormValues({...formValues, companyWebsite: e.target.value})}
                      placeholder="Saisissez le site web de l'entreprise"
                      className="w-full bg-[#161616] border border-white/5 focus:border-mint/30 focus:outline-none rounded-md px-4 py-3 text-sm text-[#dfdfdf] placeholder:text-[#4b4b4b] transition-all"
                    />
                  </div>

                  {/* Taille de l'entreprise */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Taille de l'entreprise <span className="text-[#a3a3a3] text-xs ml-1">•</span>
                    </label>
                    <select 
                      required
                      value={formValues.companySize}
                      onChange={(e) => setFormValues({...formValues, companySize: e.target.value})}
                      className="w-full bg-[#161616] border border-white/5 focus:border-mint/30 focus:outline-none rounded-md px-4 py-3 text-sm text-[#dfdfdf] transition-all appearance-none cursor-pointer pr-10"
                      style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="" className="bg-[#161616] text-gray-500">Sélectionnez la taille de l'entreprise</option>
                      <option value="1-10" className="bg-[#161616]">1-10 employés</option>
                      <option value="11-50" className="bg-[#161616]">11-50 employés</option>
                      <option value="51-200" className="bg-[#161616]">51-200 employés</option>
                      <option value="201-500" className="bg-[#161616]">201-500 employés</option>
                      <option value="500+" className="bg-[#161616]">500+ employés</option>
                    </select>
                  </div>

                  {/* Chiffre d'affaires annuel */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Chiffre d'affaires annuel <span className="text-[#a3a3a3] text-xs ml-1">•</span>
                    </label>
                    <select 
                      required
                      value={formValues.annualRevenue}
                      onChange={(e) => setFormValues({...formValues, annualRevenue: e.target.value})}
                      className="w-full bg-[#161616] border border-white/5 focus:border-mint/30 focus:outline-none rounded-md px-4 py-3 text-sm text-[#dfdfdf] transition-all appearance-none cursor-pointer pr-10"
                      style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="" className="bg-[#161616] text-gray-500">Sélectionnez une fourchette de revenus</option>
                      <option value="<100k" className="bg-[#161616]">Moins de 100k€</option>
                      <option value="100k-500k" className="bg-[#161616]">100k€ - 500k€</option>
                      <option value="500k-1M" className="bg-[#161616]">500k€ - 1M€</option>
                      <option value="1M-5M" className="bg-[#161616]">1M€ - 5M€</option>
                      <option value="5M+" className="bg-[#161616]">Plus de 5M€</option>
                    </select>
                  </div>

                  {/* Budget du projet */}
                  <div className="space-y-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-white">
                      Budget du projet <span className="text-[#a3a3a3] text-xs ml-1">•</span>
                    </label>
                    <select 
                      required
                      value={formValues.projectBudget}
                      onChange={(e) => setFormValues({...formValues, projectBudget: e.target.value})}
                      className="w-full bg-[#161616] border border-white/5 focus:border-mint/30 focus:outline-none rounded-md px-4 py-3 text-sm text-[#dfdfdf] transition-all appearance-none cursor-pointer pr-10"
                      style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="" className="bg-[#161616] text-gray-500">Sélectionnez votre budget</option>
                      <option value="<10k" className="bg-[#161616]">Moins de 10 000 €</option>
                      <option value="10k-30k" className="bg-[#161616]">10 000 € - 30 000 €</option>
                      <option value="30k-50k" className="bg-[#161616]">30 000 € - 50 000 €</option>
                      <option value="50k-100k" className="bg-[#161616]">50 000 € - 100 000 €</option>
                      <option value="100k+" className="bg-[#161616]">Plus de 100 000 €</option>
                    </select>
                  </div>
                  <div className="hidden md:block"></div>

                  {/* Quels services vous intéressent ? */}
                  <div className="space-y-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-white">
                      Quels services vous intéressent ? <span className="text-[#a3a3a3] text-xs ml-1">•</span>
                    </label>
                    <select 
                      required
                      value={formValues.servicesOfInterest}
                      onChange={(e) => setFormValues({...formValues, servicesOfInterest: e.target.value})}
                      className="w-full bg-[#161616] border border-white/5 focus:border-mint/30 focus:outline-none rounded-md px-4 py-3 text-sm text-[#dfdfdf] transition-all appearance-none cursor-pointer pr-10"
                      style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="" className="bg-[#161616] text-gray-500">Sélectionnez un service</option>
                      <option value="ia-metier" className="bg-[#161616]">Intégration d'IA Métier</option>
                      <option value="ocr-nlp" className="bg-[#161616]">Traitement Documentaire (OCR/NLP)</option>
                      <option value="security" className="bg-[#161616]">Audit & Sécurité Souveraine</option>
                      <option value="training" className="bg-[#161616]">Formation & Accompagnement</option>
                    </select>
                  </div>
                  <div className="hidden md:block"></div>

                  {/* Message */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-white">
                      Message <span className="text-[#a3a3a3] text-xs ml-1">•</span>
                    </label>
                    <textarea 
                      rows={4}
                      required
                      value={formValues.message}
                      onChange={(e) => setFormValues({...formValues, message: e.target.value})}
                      placeholder="Décrivez vos besoins IA"
                      className="w-full bg-[#161616] border border-white/5 focus:border-mint/30 focus:outline-none rounded-md px-4 py-3 text-sm text-[#dfdfdf] placeholder:text-[#4b4b4b] transition-all resize-none animate-none"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2 flex justify-start">
                  <button 
                    type="submit" 
                    className="bg-[#0c4a24] hover:bg-[#093d1d] text-white font-semibold px-5 py-2.5 rounded text-sm transition-all active:scale-[0.98] flex items-center gap-2 border border-emerald-950/20 shadow-md"
                  >
                    Envoyer la demande <span className="text-xs">➔</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/5 bg-black/60 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="space-y-4">
            <span className="font-bold text-lg text-white flex items-center gap-2">
              <Cpu className="text-mint w-5 h-5" /> Aveni<span className="text-mint">Tech</span>
            </span>
            <p className="text-xs text-alabaster/40 leading-relaxed font-light">
              Solutions IA sécurisées, souveraines et conformes, dédiées aux institutions internationales et organisations à impact.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-mint font-mono font-bold bg-mint/5 border border-mint/20 rounded-full px-3 py-1 w-max">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mint"></span>
              </span>
              SYSTEM STATUS : OPERATIONAL
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4 font-mono">// EXCELLENCE</h4>
            <ul className="space-y-2.5 text-xs text-alabaster/50 font-light">
              <li><a href="#process" className="hover:text-mint transition-colors">Notre Procédé</a></li>
              <li><a href="#expertises" className="hover:text-mint transition-colors">Plateforme Documentaire IA</a></li>
              <li><a href="#commitments" className="hover:text-mint transition-colors">Contrôle & Sécurité</a></li>
              <li><a href="#showcase" className="hover:text-mint transition-colors">Récit Pilote MSF</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4 font-mono">// JURIDIQUE & PAYS</h4>
            <ul className="space-y-2.5 text-xs text-alabaster/50 font-light">
              <li>AveniTech Enterprise</li>
              <li>Dakar, Sénégal</li>
              <li>Zone UMOA / Espace OHADA</li>
              <li>Responsable : Gérant Associé</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4 font-mono">// RÉSEAUX COLLECTIF</h4>
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-xs text-alabaster/50">
                <Mail className="w-4 h-4 text-mint" /> contact@avenitech.sn
              </div>
              <div className="flex items-center gap-2 text-xs text-alabaster/50">
                <Globe className="w-4 h-4 text-mint" /> Dakar, Sénégal (Diaspora)
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-alabaster/40 font-mono">
          <span>&copy; 2026 AVENITECH. TOUS DROITS RÉSERVÉS.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-mint transition-colors">CONFORMITÉ RGPD</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-mint transition-colors">MENTIONS LÉGALES</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
