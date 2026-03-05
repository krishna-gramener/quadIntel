/**
 * Data Module - Cluster Based Theme Ontology
 * Corrected mapping between internal and external themes
 */

const INTERNAL_AUDITS = [

    {
        id: "IA-EMQ-2024-011",
        title: "Global System Audit – External Manufacturing Quality",
        document_path: "data/internal/global_system_audit_emq.pdf",
        themes: [
            "Desktop Audit Overuse",
            "CMO Oversight Gap",
            "Supplier Qualification Weakness",
            "Vendor Audit Frequency Gap",
            "Supplier Risk Visibility Gap",
            "Vendor Documentation Completeness Gap",
            "Supplier Quality Agreement Gap",
            "API Source Verification Gap"
        ],
        summary: "Corporate audit identified systemic over-reliance on desktop audits and limited verification of contract manufacturing organizations.",
        recommendations: [
            "Mandate physical supplier audits",
            "Strengthen vendor oversight program",
            "Implement supplier risk scoring",
            "Improve vendor documentation review"
        ]
    },

    {
        id: "IA-LATINA-2024-044",
        title: "Site Audit – Latina Sterile Operations",
        document_path: "data/internal/site_audit_latina_italy.pdf",
        themes: [
            "Media Fill Contamination",
            "Aseptic Intervention Risk",
            "Environmental Monitoring Excursion",
            "Sterility Investigation Weakness",
            "Aseptic Operator Handling Risk",
            "Cleanroom Classification Failure",
            "Particulate Monitoring Gap",
            "Aseptic Process Validation Gap"
        ],
        summary: "Sterile manufacturing audit identified media fill contamination events and environmental monitoring excursions.",
        recommendations: [
            "Improve contamination investigation procedures",
            "Strengthen aseptic operator training",
            "Implement enhanced monitoring protocols"
        ]
    },

    {
        id: "IA-BRASSICA-2023-112",
        title: "Supplier Audit – Brassica Pharma",
        document_path: "data/internal/supplier_audit_brassica_pharma.pdf",
        themes: [
            "Aseptic Validation Documentation Gap",
            "Raw Data Transparency Issue",
            "Supplier Self Assessment Reliance",
            "Third Party Laboratory Dependence",
            "Supplier Validation Weakness",
            "Vendor Documentation Completeness Gap",
            "Supplier Quality Data Gap"
        ],
        summary: "Supplier qualification relied heavily on documentation review without verifying raw validation data.",
        recommendations: [
            "Require raw validation datasets",
            "Conduct onsite supplier verification",
            "Implement supplier data integrity checks"
        ]
    },

    {
        id: "IA-FORT-2023-219",
        title: "Site Audit – Fort Washington",
        document_path: "data/internal/site_audit_fort_washington.pdf",
        themes: [
            "OOS Retesting Practice",
            "OOS Investigation Weakness",
            "DEG Testing Waiver",
            "Benzene Testing Waiver",
            "COA Reliance Without Verification",
            "Impurity Testing Gap",
            "Laboratory Control Weakness",
            "Analytical Method Validation Gap"
        ],
        summary: "Audit identified repeated OOS retesting practices and inadequate impurity testing verification.",
        recommendations: [
            "Reinstate confirmatory impurity testing",
            "Strengthen investigation protocols",
            "Improve laboratory oversight"
        ]
    },

    {
        id: "IA-ENG-2023-088",
        title: "Global Engineering Review – Water Systems",
        document_path: "data/internal/global_engineering_review_water_systems.pdf",
        themes: [
            "Sanitization Postponement",
            "Biofilm Formation Risk",
            "Burkholderia Detection",
            "Water System Microbial Drift",
            "Maintenance Deferral Risk",
            "Water System Design Flaw",
            "Microbial Alert Level Exceedance"
        ],
        summary: "Engineering review identified microbial drift trends and sanitization postponements in purified water systems.",
        recommendations: [
            "Implement early microbial warning thresholds",
            "Improve sanitization scheduling",
            "Conduct water system design review"
        ]
    }

];


const EXTERNAL_DOCUMENTS = [

    {
        id: "WL-ACME-2025",
        company: "Acme United Corp",
        document_path: "data/external/acme_united_corp_10_10_2025.pdf",
        themes: [
            "Water System Contamination",
            "Burkholderia Cepacia Detection",
            "Inadequate Sanitization Control",
            "Microbial Monitoring Failure",
            "Water System Design Deficiency"
        ],
        summary: "FDA cited contamination in the purified water system due to inadequate sanitization controls.",
        key_findings: [
            "Burkholderia contamination detected",
            "Sanitization program inadequate"
        ]
    },

    {
        id: "WL-ACELLA-2020",
        company: "Acella Pharmaceuticals",
        document_path: "data/external/acella_pharma_08_14_2020.pdf",
        themes: [
            "Data Integrity Failure",
            "Audit Trail Manipulation",
            "Electronic Record Integrity Gap",
            "Laboratory Data Governance Failure"
        ],
        summary: "FDA warning letter cited data integrity failures and manipulation of electronic laboratory records.",
        key_findings: [
            "Audit trails manipulated",
            "Inadequate data governance"
        ]
    },

    {
        id: "WL-ACCUPACK-2024",
        company: "Accupack Midwest",
        document_path: "data/external/accupack_midwest_08_15_2024.pdf",
        themes: [
            "Inadequate Laboratory Controls",
            "Water System Monitoring Failure",
            "Process Validation Failure",
            "Manufacturing Control Failure"
        ],
        summary: "FDA cited inadequate laboratory and manufacturing controls including water monitoring failures.",
        key_findings: [
            "Laboratory controls insufficient",
            "Process validation incomplete"
        ]
    },

    {
        id: "WL-ACCUBIO-2022",
        company: "Accu Bio Laboratories",
        document_path: "data/external/accu_bio_laboratories_02_24_2022.pdf",
        themes: [
            "OOS Investigation Failure",
            "OOS Retesting Violations",
            "Laboratory Investigation Weakness",
            "Analytical Method Validation Gap"
        ],
        summary: "FDA warning letter cited systemic failures in OOS investigation procedures.",
        key_findings: [
            "OOS results invalidated through retesting"
        ]
    },

    {
        id: "WL-ACCRAPAC-2023",
        company: "Accra Pac",
        document_path: "data/external/accra_pac_04_20_2023.pdf",
        themes: [
            "Benzene Contamination",
            "Propellant Impurity Failure",
            "Raw Material Testing Failure",
            "Supplier Qualification Failure"
        ],
        summary: "FDA cited benzene contamination caused by inadequate propellant testing.",
        key_findings: [
            "Benzene detected in product batches"
        ]
    },

    {
        id: "WL-ABSARA-2021",
        company: "Absara Cosmetics",
        document_path: "data/external/absara_cosmetics_02_18_2021.pdf",
        themes: [
            "Subpotent Drug Product",
            "Product Quality Failure",
            "Inadequate Test Methods",
            "Finished Product Testing Gap"
        ],
        summary: "FDA warning letter cited subpotent product due to inadequate test methods.",
        key_findings: [
            "Finished product potency below specification"
        ]
    },

    {
        id: "WL-ABRAXIS-2022",
        company: "Abraxis Bioscience",
        document_path: "data/external/abraxis_bioscience_llc_10_31_2022.pdf",
        themes: [
            "Media Fill Failure",
            "Aseptic Technique Deficiency",
            "Sterility Assurance Breakdown",
            "Aseptic Process Validation Gap"
        ],
        summary: "FDA cited repeated media fill failures and sterility assurance issues.",
        key_findings: [
            "Media fill contamination events observed"
        ]
    },

    {
        id: "WL-AACE-2025",
        company: "AACE Pharmaceuticals",
        document_path: "data/external/aace_pharmaceuticals_05_13_2025.pdf",
        themes: [
            "Supplier Qualification Failure",
            "CMO Oversight Failure",
            "Contract Manufacturing Compliance Gap"
        ],
        summary: "FDA warning letter cited inadequate oversight of contract manufacturer Brassica Pharma.",
        key_findings: [
            "Supplier oversight inadequate"
        ]
    }

];



const THEME_CLUSTERS = [

    {
        cluster_id: "cluster_water",
        parent_category: "Water System Contamination",
        similarity_score: 0.93,
        similarity_reason: "Internal engineering review identified Burkholderia detection and sanitization postponement while FDA cited water system contamination and inadequate sanitization controls.",
        themes: [
            "Sanitization Postponement",
            "Biofilm Formation Risk",
            "Burkholderia Detection",
            "Water System Contamination",
            "Burkholderia Cepacia Detection",
            "Inadequate Sanitization Control"
        ],
        internal_docs: ["IA-ENG-2023-088"],
        external_docs: ["WL-ACME-2025", "WL-ACCUPACK-2024"]
    },

    {
        cluster_id: "cluster_oos",
        parent_category: "OOS Investigation Failure",
        similarity_score: 0.91,
        similarity_reason: "Internal audit cited OOS retesting practices while FDA warning letters cited nearly identical failures involving invalid OOS investigations.",
        themes: [
            "OOS Retesting Practice",
            "OOS Investigation Weakness",
            "OOS Investigation Failure",
            "OOS Retesting Violations"
        ],
        internal_docs: ["IA-FORT-2023-219"],
        external_docs: ["WL-ACCUBIO-2022"]
    },

    {
        cluster_id: "cluster_sterility",
        parent_category: "Sterility Assurance Failure",
        similarity_score: 0.92,
        similarity_reason: "Internal sterile manufacturing audit identified media fill contamination and aseptic handling risks while FDA warning letters cited media fill failures.",
        themes: [
            "Media Fill Contamination",
            "Aseptic Intervention Risk",
            "Media Fill Failure",
            "Aseptic Technique Deficiency",
            "Aseptic Process Validation Gap"
        ],
        internal_docs: ["IA-LATINA-2024-044"],
        external_docs: ["WL-ABRAXIS-2022"]
    },

    {
        cluster_id: "cluster_supplier",
        parent_category: "Supplier Oversight Deficiency",
        similarity_score: 0.89,
        similarity_reason: "Internal supplier audits identified reliance on documentation and lack of vendor oversight which aligns with FDA warning letters citing supplier qualification failures.",
        themes: [
            "Supplier Qualification Weakness",
            "Supplier Self Assessment Reliance",
            "Vendor Documentation Completeness Gap",
            "Supplier Qualification Failure",
            "CMO Oversight Failure"
        ],
        internal_docs: ["IA-BRASSICA-2023-112", "IA-EMQ-2024-011"],
        external_docs: ["WL-AACE-2025", "WL-ACCRAPAC-2023"]
    },

    {
        cluster_id: "cluster_impurity",
        parent_category: "Impurity Testing Failure",
        similarity_score: 0.88,
        similarity_reason: "Internal audit identified benzene testing waivers while FDA warning letters cited benzene contamination due to inadequate impurity testing.",
        themes: [
            "Benzene Testing Waiver",
            "Impurity Testing Gap",
            "Benzene Contamination",
            "Propellant Impurity Failure"
        ],
        internal_docs: ["IA-FORT-2023-219"],
        external_docs: ["WL-ACCRAPAC-2023"]
    },

    {
        cluster_id: "cluster_product_quality",
        parent_category: "Product Quality Failure",
        similarity_score: 0.85,
        similarity_reason: "External warning letters cited subpotent product quality failures due to inadequate testing methods.",
        themes: [
            "Subpotent Drug Product",
            "Product Quality Failure",
            "Finished Product Testing Gap"
        ],
        internal_docs: ["IA-FORT-2023-219"],
        external_docs: ["WL-ABSARA-2021"]
    }

];