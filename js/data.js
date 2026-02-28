/**
 * Data Module - Normalized & Fully Cross-Mapped Version
 * Regulatory Risk Correlation System
 */


/* =====================================================
   INTERNAL AUDIT DOCUMENTS (5)
===================================================== */

const INTERNAL_AUDITS = [

    {
        id: "IA-EMQ-2024-011",
        title: "Global System Audit – External Manufacturing Quality (EMQ)",
        function: "Corporate Quality Oversight",
        overall_rating: "Critical Vulnerability Identified",
        findings: [
            {
                severity: "Critical",
                risk_category: "Supplier Management",
                themes: [
                    "Supplier Oversight Failure"
                ]
            },
            {
                severity: "Major",
                risk_category: "Laboratory Control",
                themes: [
                    "Laboratory Control Failure",
                    "Inadequate Validation"
                ]
            }
        ],
        internal_summary:
            "Corporate EMQ audit identified systemic over-reliance on desktop audits and insufficient physical verification of high-risk CMOs. Stability data oversight depended on summary documentation without raw analytical review.",
        external_pattern_alignment:
            "Strong alignment with FDA enforcement involving supplier oversight deficiencies, inadequate laboratory control, and insufficient validation oversight.",
        discrepancies_vs_enforcement:
            "FDA cases often escalate similar oversight failures into broader data integrity investigations or import alerts. Internal audit did not assess retrospective batch impact.",
        recommendations: [
            "Mandate physical audits for all high-risk CMOs.",
            "Require raw stability data review.",
            "Strengthen supplier risk scoring framework."
        ]
    },
    
    
    {
        id: "IA-LATINA-2024-044",
        title: "Site Audit – Latina Italy (Sterile Operations)",
        function: "Site Quality – Sterile Manufacturing",
        overall_rating: "Acceptable with Major Observations",
        findings: [
            {
                severity: "Major",
                risk_category: "Sterility Assurance",
                themes: [
                    "Sterility Assurance Failure",
                    "Environmental Monitoring Failure"
                ]
            },
            {
                severity: "Major",
                risk_category: "Investigations",
                themes: [
                    "OOS Investigation Failure"
                ]
            }
        ],
        internal_summary:
            "Media fill contamination event was closed using statistical allowance without teardown. Environmental monitoring review revealed investigation depth gaps.",
        external_pattern_alignment:
            "High alignment with FDA warning letters involving sterility failures and insufficient investigation of contamination events.",
        discrepancies_vs_enforcement:
            "FDA enforcement in similar cases often requires facility-wide sterility reassessment and expanded product impact review.",
        recommendations: [
            "Mandate teardown following media fill contamination.",
            "Strengthen sterility investigation SOP requirements.",
            "Requalify aseptic operators."
        ]
    },
    
    
    {
        id: "IA-BRASSICA-2023-112",
        title: "Supplier Audit – Brassica Pharma",
        function: "Supplier Quality – APAC",
        overall_rating: "Conditionally Approved",
        findings: [
            {
                severity: "Major",
                risk_category: "Supplier Management",
                themes: [
                    "Supplier Oversight Failure"
                ]
            },
            {
                severity: "Major",
                risk_category: "Data Integrity",
                themes: [
                    "Data Integrity Failure"
                ]
            },
            {
                severity: "Major",
                risk_category: "Validation",
                themes: [
                    "Inadequate Validation"
                ]
            }
        ],
        internal_summary:
            "Desktop requalification revealed incomplete aseptic validation documentation and limited raw data transparency from supplier.",
        external_pattern_alignment:
            "High alignment with FDA enforcement patterns involving incomplete validation, third-party lab oversight deficiencies, and data integrity concerns.",
        discrepancies_vs_enforcement:
            "FDA enforcement frequently escalates similar documentation gaps into broader data integrity reviews and operational restrictions.",
        recommendations: [
            "Require raw validation data submission.",
            "Conduct on-site verification audit.",
            "Strengthen supplier quality agreement clauses."
        ]
    },
    
    
    {
        id: "IA-FORT-2023-219",
        title: "Site Audit – Fort Washington",
        function: "Site QA/QC – Consumer Health",
        overall_rating: "Needs Improvement",
        findings: [
            {
                severity: "Critical",
                risk_category: "Raw Material Testing",
                themes: [
                    "Impurity Testing Failure"
                ]
            },
            {
                severity: "Major",
                risk_category: "Investigations",
                themes: [
                    "OOS Investigation Failure",
                    "Laboratory Control Failure"
                ]
            }
        ],
        internal_summary:
            "Waiver of DEG and benzene testing combined with OOS retesting practices created elevated adulteration risk.",
        external_pattern_alignment:
            "Very high alignment with FDA warning letters involving DEG contamination, benzene contamination, and improper OOS retesting practices.",
        discrepancies_vs_enforcement:
            "FDA enforcement in similar cases often results in recalls, consent decrees, or facility shutdown.",
        recommendations: [
            "Reinstate confirmatory impurity testing.",
            "Eliminate preliminary OOS retesting.",
            "Conduct retrospective batch review."
        ]
    },
    
    
    {
        id: "IA-ENG-2023-088",
        title: "Global Engineering Review – Water Systems",
        function: "Engineering & Facilities",
        overall_rating: "Adequate with Major Concerns",
        findings: [
            {
                severity: "Major",
                risk_category: "Water Systems",
                themes: [
                    "Water System Contamination",
                    "Environmental Monitoring Failure"
                ]
            },
            {
                severity: "Major",
                risk_category: "Governance",
                themes: [
                    "Inadequate CAPA"
                ]
            }
        ],
        internal_summary:
            "Repeated sanitization postponements and upward microbial drift trends indicate increasing contamination risk in legacy water systems.",
        external_pattern_alignment:
            "Very high alignment with FDA enforcement involving water system contamination and microbial control breakdown.",
        discrepancies_vs_enforcement:
            "FDA enforcement typically escalates once microbial action limits are breached or CAPA is deemed ineffective.",
        recommendations: [
            "Restrict sanitization override usage.",
            "Implement microbial early-warning thresholds.",
            "Strengthen CAPA triggers for repeated drift."
        ]
    }
    
    ];
    
    
    /* =====================================================
       EXTERNAL WARNING LETTERS (8)
    ===================================================== */
    
    const EXTERNAL_DOCUMENTS = [
    
    {
        id: "WL-ACME-2025",
        company: "Acme United Corp.",
        date: "2025-10-10",
        allegations: [
            {
                risk_category: "Water Systems",
                themes: [
                    "Water System Contamination",
                    "OOS Investigation Failure",
                    "Environmental Monitoring Failure"
                ]
            }
        ],
        cfr_violations: ["21 CFR 211.63", "21 CFR 211.192"]
    },
    
    {
        id: "WL-ACCUPACK-2024",
        company: "Accupack Midwest",
        date: "2024-08-15",
        allegations: [
            {
                risk_category: "Raw Materials",
                themes: [
                    "Impurity Testing Failure",
                    "Supplier Oversight Failure"
                ]
            }
        ],
        cfr_violations: ["21 CFR 211.84"]
    },
    
    {
        id: "WL-ACCUBIO-2022",
        company: "Accu Bio Laboratories",
        date: "2022-02-24",
        allegations: [
            {
                risk_category: "Investigations",
                themes: [
                    "OOS Investigation Failure",
                    "Data Integrity Failure",
                    "Laboratory Control Failure"
                ]
            }
        ],
        cfr_violations: ["21 CFR 211.192"]
    },
    
    {
        id: "WL-ABRAXIS-2022",
        company: "Abraxis Bioscience",
        date: "2022-10-31",
        allegations: [
            {
                risk_category: "Sterility",
                themes: [
                    "Sterility Assurance Failure",
                    "Environmental Monitoring Failure",
                    "Inadequate Validation"
                ]
            }
        ],
        cfr_violations: ["21 CFR 211.113"]
    },
    
    {
        id: "WL-ABSARA-2021",
        company: "Absara Cosmetics",
        date: "2021-02-18",
        allegations: [
            {
                risk_category: "Contamination",
                themes: [
                    "Water System Contamination"
                ]
            }
        ],
        cfr_violations: ["21 CFR 211.67"]
    },
    
    {
        id: "WL-ACELLA-2020",
        company: "Acella Pharmaceuticals",
        date: "2020-08-14",
        allegations: [
            {
                risk_category: "Data Integrity",
                themes: [
                    "Data Integrity Failure",
                    "Laboratory Control Failure"
                ]
            }
        ],
        cfr_violations: ["21 CFR Part 11"]
    },
    
    {
        id: "WL-AACE-2025",
        company: "AACE Pharmaceuticals",
        date: "2025-05-13",
        allegations: [
            {
                risk_category: "Laboratory Control",
                themes: [
                    "Laboratory Control Failure",
                    "Inadequate Validation",
                    "Data Integrity Failure"
                ]
            }
        ],
        cfr_violations: ["21 CFR 211.160"]
    },
    
    {
        id: "WL-ACCRAPAC-2023",
        company: "Accra-Pac",
        date: "2023-04-20",
        allegations: [
            {
                risk_category: "Raw Materials",
                themes: [
                    "Impurity Testing Failure",
                    "Supplier Oversight Failure"
                ]
            }
        ],
        cfr_violations: ["21 CFR 211.84"]
    }
    
    ];
    
    
    /* =====================================================
       ONTOLOGY
    ===================================================== */
    
    const ONTOLOGY = {
        risk_categories: [
            "Water Systems",
            "Sterility",
            "Supplier Management",
            "Raw Materials",
            "Investigations",
            "Data Integrity",
            "Laboratory Control",
            "Governance"
        ],
        standardized_themes: [
            "Water System Contamination",
            "Sterility Assurance Failure",
            "OOS Investigation Failure",
            "Supplier Oversight Failure",
            "Impurity Testing Failure",
            "Data Integrity Failure",
            "Inadequate Validation",
            "Inadequate CAPA",
            "Environmental Monitoring Failure",
            "Laboratory Control Failure"
        ]
    };
    
    
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            INTERNAL_AUDITS,
            EXTERNAL_DOCUMENTS,
            ONTOLOGY
        };
    }