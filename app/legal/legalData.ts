export const LEGAL_VERSION = "1.0";
export const LEGAL_EFFECTIVE_DATE = "25 July 2026";
export const LEGAL_CONTACT_EMAIL = "okaung717@gmail.com";
export const LEGAL_CONTACT_PHONE = "+95 9 671 010 011";

export type LegalDocumentKey =
  | "legal"
  | "privacy"
  | "terms"
  | "project"
  | "ai-ip"
  | "acceptable-use"
  | "copyright";

export type LegalLanguage = "EN" | "MM";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  eyebrow: string;
  summary: string;
  sections: LegalSection[];
};

export const legalLinks: Array<{ key: LegalDocumentKey; href: string; labelEN: string; labelMM: string }> = [
  { key: "legal", href: "/legal", labelEN: "Legal & Policies", labelMM: "ဥပဒေနှင့် မူဝါဒများ" },
  { key: "privacy", href: "/privacy", labelEN: "Privacy Policy", labelMM: "ကိုယ်ရေးအချက်အလက် မူဝါဒ" },
  { key: "terms", href: "/terms", labelEN: "Terms of Service", labelMM: "ဝန်ဆောင်မှု စည်းကမ်းချက်များ" },
  { key: "project", href: "/project-policy", labelEN: "Project & Payment Policy", labelMM: "Project နှင့် ငွေပေးချေမှု မူဝါဒ" },
  { key: "ai-ip", href: "/ai-ip-policy", labelEN: "AI & Intellectual Property", labelMM: "AI နှင့် မူပိုင်ခွင့် မူဝါဒ" },
  { key: "acceptable-use", href: "/acceptable-use", labelEN: "Acceptable Use", labelMM: "လက်ခံနိုင်သော အသုံးပြုမှု" },
  { key: "copyright", href: "/copyright", labelEN: "Copyright & Content Complaints", labelMM: "မူပိုင်ခွင့်နှင့် Content တိုင်ကြားမှု" },
];

const EN: Record<LegalDocumentKey, LegalDocument> = {
  legal: {
    title: "Legal & Policies",
    eyebrow: "BURMA AI STUDIO · LEGAL CENTER",
    summary: "These policies apply to the Burma AI Studio website, mobile app and creative-service workflow. They are designed to make project scope, data handling, AI use, payments, rights and client responsibilities clear before production begins.",
    sections: [
      {
        title: "1. How this legal center works",
        paragraphs: [
          "Burma AI Studio is a creative-service brand providing AI-assisted video production and related services. This legal center combines the rules that govern use of our website and app with the rules that govern paid creative projects.",
          "A project inquiry does not by itself create a production commitment. A project becomes commercially agreed when the parties confirm the scope, price, delivery expectations and any project-specific terms through an accepted quote, order, message confirmation, invoice or equivalent written record.",
        ],
      },
      {
        title: "2. Documents included",
        bullets: [
          "Privacy Policy — explains what information we collect, why we use it, how analytics consent works, and how to request deletion.",
          "Terms of Service — governs use of the website, app and Burma AI Studio services.",
          "Project & Payment Policy — explains scope, revisions, cancellations, delivery, refunds and client-caused delays.",
          "AI & Intellectual Property Policy — covers AI generation, client assets, likeness/voice permission, final deliverables and third-party rights.",
          "Acceptable Use Policy — defines content and project requests we may reject or stop.",
          "Copyright & Content Complaints — provides a process for reporting allegedly infringing or unauthorized content.",
        ],
      },
      {
        title: "3. Mandatory law prevails",
        paragraphs: [
          "Nothing in these policies is intended to remove a right or remedy that cannot legally be excluded. Where a mandatory law or app-store rule gives a user greater protection, that requirement prevails to the extent it applies.",
          "These policies are a practical business framework and may be updated as Burma AI Studio services, technology providers, legal requirements or store requirements change.",
        ],
      },
      {
        title: "4. Contact",
        paragraphs: [
          `Questions about these policies can be sent to ${LEGAL_CONTACT_EMAIL} or ${LEGAL_CONTACT_PHONE}.`,
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "WEBSITE + ANDROID + iOS",
    summary: "This Privacy Policy explains how Burma AI Studio handles information when you browse the website, use the mobile app, contact us or submit a project inquiry.",
    sections: [
      {
        title: "1. Who we are and scope",
        paragraphs: [
          "Burma AI Studio is a Myanmar-based creative-service brand. This policy applies to burmaaistudio.com, the Burma AI Studio mobile app and related project-intake features operated by Burma AI Studio.",
          "The current service does not require a customer account or sign-in. If account features are added later, this policy will be updated before those features are relied on for personal-data processing.",
        ],
      },
      {
        title: "2. Information you provide",
        bullets: [
          "Contact information such as first name, last name, email address, phone number when supplied, and other contact details you choose to provide.",
          "Project information such as your brief, product or service details, deadlines, references, script ideas and messages.",
          "Creative assets you voluntarily provide for a project, such as logos, images, video, audio, voice material, brand assets or reference files.",
          "Rights and legal confirmations connected to a project inquiry, including confirmation that you have permission to use submitted materials and whether you allow portfolio display.",
        ],
      },
      {
        title: "3. Usage and technical information",
        paragraphs: [
          "When analytics is allowed, Burma AI Studio may collect usage information to understand how the website and app perform and how visitors interact with them.",
        ],
        bullets: [
          "A locally generated visitor identifier that is hashed before our custom analytics event is stored.",
          "Pages and paths visited, event type, traffic source and portfolio-video interactions.",
          "General device category, browser language, time zone and country-level location derived from request information.",
          "Performance and diagnostic information through analytics and performance-measurement providers when enabled.",
          "User-agent and ordinary technical request information needed to receive, secure and troubleshoot project inquiries and service requests.",
        ],
      },
      {
        title: "4. Analytics consent and privacy choices",
        paragraphs: [
          "The website and app provide a privacy choice before optional analytics components are enabled on that device. You may choose “Allow analytics” or “Essential only.” Choosing Essential only does not stop core website or app functions such as browsing policies or sending a project inquiry.",
          "You may change the stored analytics choice from the Privacy Choices page. Hosting, security and network providers may still process technical request information that is reasonably necessary to deliver and protect the service.",
        ],
      },
      {
        title: "5. How we use information",
        bullets: [
          "To receive and respond to project inquiries and customer-support requests.",
          "To prepare quotes, creative direction, scripts, project plans and deliverables.",
          "To operate, secure, debug and improve the website, mobile app and service workflow.",
          "To measure product interaction and performance when analytics consent has been given.",
          "To prevent abuse, enforce service rules and protect Burma AI Studio, clients and third parties.",
          "To comply with applicable legal, regulatory, tax, accounting or dispute-resolution obligations when required.",
        ],
      },
      {
        title: "6. Service providers and international processing",
        paragraphs: [
          "We use service providers to host and operate the service. Depending on the feature used, information may be processed by providers such as Supabase for database services, Vercel for hosting/analytics/performance services, YouTube or Google for embedded video, and communication platforms you choose to open such as Telegram, Facebook, Viber or email providers.",
          "For paid creative work, client-provided project material may also be processed with AI, media-generation, editing, storage or delivery providers that are reasonably required to produce the requested work. Those providers may operate outside Myanmar.",
          "We do not sell personal information. We do not authorize service providers to use client project material for unrelated purposes beyond their applicable service terms and the functions required to provide the service to us.",
        ],
      },
      {
        title: "7. Data retention",
        paragraphs: [
          "We retain information only for as long as reasonably necessary for project communication, service delivery, business records, security, dispute handling and legal obligations. Different categories may have different retention periods.",
          "Analytics records may be retained for operational trend analysis and may be aggregated or de-identified. Project records may be retained longer when needed to document scope, payment, permissions, delivery or legal claims.",
        ],
      },
      {
        title: "8. Deletion, correction and withdrawal",
        paragraphs: [
          `You may request access, correction or deletion of personal information that Burma AI Studio controls by emailing ${LEGAL_CONTACT_EMAIL}. Please provide enough information for us to identify the relevant inquiry or project without sending unnecessary sensitive data.`,
          "You may withdraw optional analytics consent at any time from the Privacy Choices page. Withdrawal applies prospectively and does not make earlier lawful processing invalid.",
          "We may retain limited information where retention is required by law, necessary for security or fraud prevention, or needed to establish, exercise or defend legal claims.",
        ],
      },
      {
        title: "9. Security",
        paragraphs: [
          "We use reasonable technical and organizational safeguards appropriate to the size and nature of the service. No internet or storage system can be guaranteed completely secure, so users should avoid sending passwords, payment-card secrets, government credentials or other unnecessary sensitive information in a project brief.",
        ],
      },
      {
        title: "10. Children",
        paragraphs: [
          "Burma AI Studio is a business and creative-production service and is not directed to children under 13. We do not knowingly seek personal information from children under 13 through the project-intake flow. A person entering a paid project must have legal capacity to do so or appropriate authority from a parent, guardian or organization.",
        ],
      },
      {
        title: "11. Changes and contact",
        paragraphs: [
          `We may update this policy as the service changes. The current version and effective date appear on this page. Privacy questions and deletion requests can be sent to ${LEGAL_CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "BURMA AI STUDIO SERVICES",
    summary: "These Terms govern access to the Burma AI Studio website and mobile app and the use of AI-assisted creative services provided by Burma AI Studio.",
    sections: [
      {
        title: "1. Acceptance and eligibility",
        paragraphs: [
          "By using the website or app, submitting a project inquiry, or confirming a paid project, you agree to these Terms and the policies incorporated by reference. If you act for a company, brand or other organization, you confirm that you have authority to act for that organization.",
          "A paid project is also subject to the specific scope, price, timeline and delivery terms confirmed for that project. Project-specific written terms control over these general Terms where they clearly conflict.",
        ],
      },
      {
        title: "2. Services",
        paragraphs: [
          "Burma AI Studio provides creative services that may include AI presenter videos, product videos, advertising creatives, social-media shorts, cinematic brand videos, image generation, script development, concept development, editing and related production work.",
          "AI and third-party creative tools may be used as part of production. The precise workflow is selected by Burma AI Studio unless the project agreement states otherwise.",
        ],
      },
      {
        title: "3. Quotes, orders and scope",
        paragraphs: [
          "Prices, delivery estimates, revision allowances and deliverables are defined in the accepted project scope or quote. A casual inquiry or preliminary discussion is not a guarantee that Burma AI Studio has accepted the project.",
          "Material changes to an approved script, concept, duration, character, presenter, visual direction, format, platform requirement or deliverable may be treated as a scope change and may require additional fees or time.",
        ],
      },
      {
        title: "4. Client responsibilities",
        bullets: [
          "Provide accurate project instructions and timely feedback.",
          "Provide only materials you own or have sufficient permission to use.",
          "Obtain appropriate permission for identifiable people, voices, trademarks, products, music, footage and other protected material supplied to us.",
          "Review factual, legal, medical, financial, regulatory, pricing and promotional claims before publication.",
          "Use final deliverables only for lawful purposes and in accordance with applicable platform rules.",
        ],
      },
      {
        title: "5. AI-generated content",
        paragraphs: [
          "Generative systems can produce variation in faces, hands, movement, lip synchronization, voice characteristics, text, logos, physical details and other elements. Burma AI Studio will use commercially reasonable creative review, but does not promise that an AI-generated result will be mathematically exact, identical across generations or free from every artifact.",
          "Unless expressly agreed, the client is responsible for final review of names, prices, claims, contact details, subtitles, trademarks and other publication-critical facts.",
        ],
      },
      {
        title: "6. Payments, revisions, cancellations and refunds",
        paragraphs: [
          "Project payments, milestones, cancellation handling and refunds are governed by the Project & Payment Policy and the accepted quote or project agreement. We do not use a blanket rule that removes mandatory consumer remedies where applicable.",
        ],
      },
      {
        title: "7. Intellectual property and client materials",
        paragraphs: [
          "The client retains rights it already owns in client-supplied materials. Rights in final deliverables are governed by the AI & Intellectual Property Policy and the project agreement. Transfer or commercial-use permission for a final deliverable is effective only after required payment has been made, unless we agree otherwise in writing.",
          "Burma AI Studio retains its pre-existing tools, know-how, templates, workflows, prompt methods, reusable production techniques and internal systems. Raw prompts, source files and internal working materials are not included unless specifically listed as deliverables.",
        ],
      },
      {
        title: "8. Portfolio use",
        paragraphs: [
          "Burma AI Studio will not treat portfolio display permission as automatic when the project-intake flow provides a separate portfolio choice. If the client has not opted in or later agrees separately, confidential or unpublished client work will not be intentionally displayed as public portfolio material by Burma AI Studio.",
        ],
      },
      {
        title: "9. Prohibited and regulated projects",
        paragraphs: [
          "Burma AI Studio may refuse, suspend or stop content that violates the Acceptable Use Policy or presents an unreasonable legal, safety, rights or platform risk. For regulated sectors, we may request proof that the requested promotion is lawful and appropriately authorized.",
        ],
      },
      {
        title: "10. Third-party services and platform outcomes",
        paragraphs: [
          "The service may rely on third-party AI models, cloud providers, video platforms and communication services. Availability, moderation decisions, licensing restrictions or policy changes by those providers are outside Burma AI Studio's complete control.",
          "We do not guarantee sales, revenue, views, followers, virality, ad approval, app-store approval, social-platform approval or any specific business result from a creative deliverable.",
        ],
      },
      {
        title: "11. Confidentiality and publicity",
        paragraphs: [
          "We will use reasonable care with non-public project information supplied for production. The client should clearly identify particularly sensitive confidential material and should not provide secrets that are unnecessary for the project.",
        ],
      },
      {
        title: "12. Disclaimers and liability",
        paragraphs: [
          "Services are provided with reasonable skill and care appropriate to the agreed creative scope. To the maximum extent permitted by applicable law, Burma AI Studio is not responsible for indirect, speculative or consequential business losses caused by platform changes, client-supplied inaccuracies, unauthorized client materials, or uses of a deliverable outside the agreed scope.",
          "Nothing in these Terms excludes liability or consumer rights that cannot lawfully be excluded or limited.",
        ],
      },
      {
        title: "13. Suspension, termination and governing rules",
        paragraphs: [
          "We may suspend a project for non-payment, abusive conduct, illegal instructions, rights concerns or material breach. The financial effect of a stopped project is handled under the Project & Payment Policy and applicable law.",
          "These Terms are governed by laws applicable in Myanmar, subject to mandatory protections or rules that apply based on the user's location or the relevant transaction.",
        ],
      },
      {
        title: "14. Contact",
        paragraphs: [`Questions about these Terms can be sent to ${LEGAL_CONTACT_EMAIL}.`],
      },
    ],
  },
  project: {
    title: "Project & Payment Policy",
    eyebrow: "SCOPE · REVISIONS · DELIVERY · REFUNDS",
    summary: "This policy explains how Burma AI Studio handles project scope, revisions, payments, client delays, cancellations, refunds and delivery.",
    sections: [
      {
        title: "1. Project confirmation",
        paragraphs: [
          "A project begins when Burma AI Studio and the client confirm the essential commercial terms, which may include deliverables, duration, format, platform, creative direction, price, payment milestone, expected delivery timing and included revisions.",
          "Messages, quotes, invoices or other written confirmations may form part of the project record. Clients should review the confirmed scope before production starts.",
        ],
      },
      {
        title: "2. Fees and payment milestones",
        paragraphs: [
          "The amount due and any deposit or milestone arrangement are set by the individual quote or project agreement. Burma AI Studio may wait for an agreed payment before reserving production time, starting paid generation or releasing final files.",
        ],
      },
      {
        title: "3. Revisions versus scope changes",
        paragraphs: [
          "A revision is a reasonable adjustment within the approved direction. A scope change changes a material part of the approved project, such as the script concept, total duration, main character, presenter identity, platform format, product, visual direction or number of deliverables.",
          "Scope changes may require a new quote, additional payment or a revised delivery estimate. We will seek confirmation before charging an additional fee that was not already agreed.",
        ],
      },
      {
        title: "4. Client feedback and delays",
        paragraphs: [
          "Delivery estimates depend on timely client information, assets, approvals and feedback. A delay caused by missing instructions, late feedback, changed requirements or unavailable client assets may move the delivery date without being treated as a studio failure.",
        ],
      },
      {
        title: "5. Cancellation before production",
        paragraphs: [
          "If a client cancels before material production work or non-recoverable third-party spending begins, Burma AI Studio will determine any refundable amount based on work already performed, reserved production time and non-recoverable costs. Where no cost has been incurred and no contrary project-specific term applies, we will act reasonably in considering a refund.",
        ],
      },
      {
        title: "6. Cancellation after production starts",
        paragraphs: [
          "After script development, generation, editing, paid media processing, asset preparation or other material production work has begun, charges may be retained for completed work, committed production time and non-recoverable third-party costs. Any remaining refundable balance will be handled according to the project facts and applicable law.",
        ],
      },
      {
        title: "7. If Burma AI Studio cannot complete the agreed service",
        paragraphs: [
          "If Burma AI Studio cannot provide a material agreed deliverable and the issue cannot reasonably be cured or replaced, we will work with the client on an appropriate remedy, which may include re-performance, a replacement deliverable, a credit, a partial refund or a full refund depending on what was paid and what was delivered.",
        ],
      },
      {
        title: "8. Delivery and approval",
        paragraphs: [
          "Delivery is made through the communication channel or file-delivery method agreed for the project. The client should review the deliverable promptly and report objective errors or included-revision requests within the review period communicated for that project.",
          "Silence does not waive mandatory rights, but extended client inactivity may pause the project and affect scheduling or availability for later revisions.",
        ],
      },
      {
        title: "9. Platform rejection or campaign performance",
        paragraphs: [
          "A platform's refusal to approve an advertisement, post, account or campaign does not automatically make a creative service defective. Where the rejection is caused by a correctable production issue within the agreed scope, we will reasonably review it. Business performance and platform approval are not guaranteed.",
        ],
      },
      {
        title: "10. Payment disputes",
        paragraphs: [
          `Clients should contact ${LEGAL_CONTACT_EMAIL} before initiating a payment dispute so that the project record, delivered work and any refund issue can be reviewed in good faith. This does not remove any lawful right to use a payment-provider or legal dispute process.`,
        ],
      },
    ],
  },
  "ai-ip": {
    title: "AI & Intellectual Property Policy",
    eyebrow: "AI GENERATION · CLIENT ASSETS · RIGHTS",
    summary: "This policy explains how Burma AI Studio handles AI-generated work, client-provided assets, likeness and voice permission, commercial-use rights and third-party restrictions.",
    sections: [
      {
        title: "1. AI-assisted production",
        paragraphs: [
          "Burma AI Studio may use generative AI, video models, image models, voice tools, editing systems and other software as part of the creative process. AI is a production tool; final creative decisions may also involve human direction, selection, editing and quality review.",
        ],
      },
      {
        title: "2. Rights to client-provided assets",
        paragraphs: [
          "When you provide a logo, image, video, audio file, music, trademark, script, character, photograph, voice sample or other asset, you represent that you own it or have sufficient permission to provide it for the requested production and intended use.",
          "You must tell us about restrictions that affect how an asset may be used, edited, generated, displayed, published or licensed.",
        ],
      },
      {
        title: "3. Identifiable people, face and voice",
        paragraphs: [
          "Clients must have appropriate authorization before requesting realistic generation, animation, cloning, transformation or synthetic reproduction of an identifiable person's face, body, voice or identity. Burma AI Studio may request proof of permission and may refuse a request when consent or authority is uncertain.",
          "Non-consensual impersonation, deceptive identity manipulation and unauthorized face or voice cloning are prohibited.",
        ],
      },
      {
        title: "4. AI output limitations and similarity",
        paragraphs: [
          "AI outputs are probabilistic and may contain artifacts or similarities to general patterns seen in other content. Unless expressly agreed and legally available, Burma AI Studio does not guarantee that an AI-generated element is unique, registrable, exclusive or capable of receiving intellectual-property protection in every jurisdiction.",
        ],
      },
      {
        title: "5. Final deliverable rights",
        paragraphs: [
          "After full payment, the client receives the ownership interest or commercial-use permission in the final deliverable that Burma AI Studio is legally able and contractually authorized to provide, subject to the accepted project agreement and third-party restrictions.",
          "Client-supplied materials remain subject to the client's existing rights. Stock media, music, fonts, AI-platform outputs, software assets and other third-party material may remain subject to their own licenses or terms and are not transferred beyond what those terms allow.",
        ],
      },
      {
        title: "6. Studio tools and working materials",
        paragraphs: [
          "Burma AI Studio retains its pre-existing know-how, prompts and prompt methods, templates, reusable workflows, internal tools, production systems, research, test generations and general creative techniques. Source files, editable project files, raw generations and prompts are deliverables only when specifically included in writing.",
        ],
      },
      {
        title: "7. Portfolio permission",
        paragraphs: [
          "Where the project-intake flow presents a separate portfolio option, public portfolio use is opt-in. A client may also provide or withdraw portfolio permission by written request, subject to reasonable steps for material already lawfully published or distributed before withdrawal.",
        ],
      },
      {
        title: "8. Rights concerns and corrections",
        paragraphs: [
          "If you believe a deliverable or displayed portfolio item infringes a right or uses an identifiable person without authorization, use the Copyright & Content Complaints process. Burma AI Studio may temporarily restrict access while a credible claim is reviewed.",
        ],
      },
    ],
  },
  "acceptable-use": {
    title: "Acceptable Use Policy",
    eyebrow: "SAFE + LAWFUL CREATIVE SERVICES",
    summary: "Burma AI Studio may reject or stop projects that create material legal, safety, rights, fraud or platform-compliance risks.",
    sections: [
      {
        title: "1. General rule",
        paragraphs: [
          "You may not use Burma AI Studio to request, create, publish or distribute content that is unlawful or that materially violates the rights or safety of others. We may ask for additional context, proof of authorization or licensing before accepting higher-risk work.",
        ],
      },
      {
        title: "2. Prohibited requests",
        bullets: [
          "Fraud, scams, deceptive impersonation, identity theft, forged evidence or intentionally false representations designed to cause harm or obtain money or access.",
          "Non-consensual face cloning, voice cloning, realistic impersonation or misleading identity manipulation of an identifiable person.",
          "Sexual exploitation, sexual content involving minors, non-consensual intimate imagery or exploitative sexual content.",
          "Credible threats, targeted harassment, hateful abuse or content intended to facilitate violence against protected or identifiable people.",
          "Material copyright, trademark, privacy, publicity or other rights infringement where the client lacks sufficient authorization.",
          "Instructions primarily intended to facilitate malware, credential theft, unauthorized access or other malicious cyber activity.",
          "Other content that Burma AI Studio reasonably believes would create an unlawful or serious safety risk.",
        ],
      },
      {
        title: "3. Regulated or high-risk sectors",
        paragraphs: [
          "Projects involving gambling or betting, financial products, healthcare claims, political or election-related promotion, age-restricted products, regulated professional services or other controlled sectors may require proof of lawful authorization, accurate disclaimers or platform eligibility. Burma AI Studio may decline the work if the client cannot provide sufficient assurance that the requested promotion is lawful and properly authorized.",
          "Burma AI Studio does not independently license or certify a client's regulated business. The client remains responsible for the legality of its business, offers, claims and distribution channels.",
        ],
      },
      {
        title: "4. Enforcement",
        paragraphs: [
          "We may refuse a request, pause production, request changes, remove public portfolio material, or terminate a project when necessary to apply this policy. Payment consequences are handled under the Project & Payment Policy and applicable law, taking into account work already completed and the reason the project was stopped.",
        ],
      },
    ],
  },
  copyright: {
    title: "Copyright & Content Complaints",
    eyebrow: "RIGHTS REPORTING PROCESS",
    summary: "Use this process to report content hosted or publicly displayed by Burma AI Studio that you believe infringes copyright, trademark, privacy, publicity or other protected rights.",
    sections: [
      {
        title: "1. What to send",
        bullets: [
          "Your name and reliable contact information.",
          "A clear description of the protected work, identity, trademark or other right you believe is affected.",
          "The exact Burma AI Studio page, portfolio item, URL or other location of the content you are reporting.",
          "A short explanation of why the use is unauthorized or infringing.",
          "Information showing that you are the rights holder or are authorized to act for the rights holder.",
          "A good-faith statement that the information in your notice is accurate to the best of your knowledge.",
        ],
      },
      {
        title: "2. Where to send a complaint",
        paragraphs: [
          `Send the notice to ${LEGAL_CONTACT_EMAIL} with the subject “Rights Complaint — Burma AI Studio.” Do not send passwords, payment-card information or unrelated sensitive documents.`,
        ],
      },
      {
        title: "3. Review and interim action",
        paragraphs: [
          "Burma AI Studio may request additional information and may temporarily hide or restrict public content while reviewing a credible complaint. We may notify the client or person who supplied the content so they can provide relevant authorization or context, except where doing so would create an unreasonable safety or legal risk.",
        ],
      },
      {
        title: "4. Response by the content provider",
        paragraphs: [
          "A client who believes content was restricted by mistake may provide evidence of ownership, consent, license, fair-use or other lawful authority. Burma AI Studio may restore, modify or keep content restricted after reviewing the available information and applicable obligations.",
        ],
      },
      {
        title: "5. Abuse of the complaint process",
        paragraphs: [
          "Knowingly false or abusive rights complaints may themselves violate these Terms. This reporting process is not a substitute for legal advice or a court process and does not limit rights that a party may have under applicable law.",
        ],
      },
    ],
  },
};

const MM: Record<LegalDocumentKey, LegalDocument> = {
  legal: {
    title: "ဥပဒေနှင့် မူဝါဒများ",
    eyebrow: "BURMA AI STUDIO · LEGAL CENTER",
    summary: "ဒီမူဝါဒတွေက Burma AI Studio website၊ mobile app နဲ့ creative-service project workflow အားလုံးအတွက် သက်ဆိုင်ပါတယ်။ Project scope၊ data အသုံးပြုပုံ၊ AI အသုံးပြုမှု၊ payment၊ မူပိုင်ခွင့်နဲ့ client တာဝန်တွေကို production မစခင် ရှင်းလင်းအောင် ဖော်ပြထားပါတယ်။",
    sections: [
      { title: "1. ဒီ Legal Center ကို ဘယ်လိုအသုံးပြုမလဲ", paragraphs: ["Burma AI Studio ဟာ AI အကူအညီသုံး creative video production နဲ့ ဆက်စပ်ဝန်ဆောင်မှုတွေ ပေးတဲ့ creative-service brand ဖြစ်ပါတယ်။ Website/app အသုံးပြုမှုဆိုင်ရာ စည်းကမ်းနဲ့ paid project ဆိုင်ရာ စည်းကမ်းတွေကို ဒီ Legal Center ထဲမှာ တစ်နေရာတည်း စုစည်းထားပါတယ်။", "Project inquiry ပို့လိုက်တာတစ်ခုတည်းနဲ့ production contract အလိုအလျောက် မဖြစ်ပါဘူး။ Scope၊ price၊ delivery နဲ့ project-specific terms တွေကို quote၊ invoice၊ message confirmation သို့မဟုတ် အလားတူ written record နဲ့ သဘောတူပြီးမှ paid project ကို အတည်ပြုထားတယ်လို့ သတ်မှတ်ပါတယ်။"] },
      { title: "2. ပါဝင်တဲ့ မူဝါဒများ", bullets: ["Privacy Policy — ဘာ data စုဆောင်းတယ်၊ ဘာကြောင့်သုံးတယ်၊ analytics consent နဲ့ deletion request ကို ဘယ်လိုလုပ်ရမလဲ ရှင်းပြထားတယ်။", "Terms of Service — website၊ app နဲ့ Burma AI Studio services အသုံးပြုမှု စည်းကမ်း။", "Project & Payment Policy — scope၊ revision၊ cancellation၊ delivery၊ refund နဲ့ client delay စည်းကမ်း။", "AI & Intellectual Property Policy — AI generation၊ client assets၊ face/voice permission၊ final deliverable rights နဲ့ third-party rights။", "Acceptable Use Policy — လက်မခံနိုင်တဲ့ content/project request များ။", "Copyright & Content Complaints — မူပိုင်ခွင့် သို့မဟုတ် ခွင့်ပြုချက်မရှိတဲ့ content အတွက် တိုင်ကြားနည်း။"] },
      { title: "3. မဖြုတ်နိုင်သော ဥပဒေအခွင့်အရေး", paragraphs: ["ဥပဒေအရ မဖြုတ်နိုင်တဲ့ consumer right သို့မဟုတ် remedy ကို ဒီ policy တွေက မဖယ်ရှားပါဘူး။ Mandatory law သို့မဟုတ် app-store requirement က ပိုမြင့်တဲ့ protection ပေးထားရင် အဲဒီ requirement က ဦးစားပေးသက်ရောက်ပါတယ်။", "Service၊ technology provider၊ ဥပဒေ သို့မဟုတ် store requirement ပြောင်းလဲလာတဲ့အခါ ဒီ policy တွေကို update လုပ်နိုင်ပါတယ်။"] },
      { title: "4. ဆက်သွယ်ရန်", paragraphs: [`Policy မေးခွန်းများကို ${LEGAL_CONTACT_EMAIL} သို့မဟုတ် ${LEGAL_CONTACT_PHONE} ကို ဆက်သွယ်နိုင်ပါတယ်။`] },
    ],
  },
  privacy: {
    title: "ကိုယ်ရေးအချက်အလက် မူဝါဒ",
    eyebrow: "WEBSITE + ANDROID + iOS",
    summary: "Burma AI Studio website၊ mobile app၊ contact form နဲ့ project inquiry အသုံးပြုတဲ့အခါ data ကို ဘယ်လိုစုဆောင်း၊ အသုံးပြု၊ သိမ်းဆည်းပြီး control ပေးထားတယ်ဆိုတာ ဒီ Privacy Policy မှာ ဖော်ပြထားပါတယ်။",
    sections: [
      { title: "1. ကျွန်ုပ်တို့နဲ့ ဒီ Policy ရဲ့အကျုံးဝင်မှု", paragraphs: ["Burma AI Studio ဟာ Myanmar အခြေစိုက် creative-service brand ဖြစ်ပြီး burmaaistudio.com၊ Burma AI Studio mobile app နဲ့ ဆက်စပ် project-intake features တွေမှာ ဒီ policy သက်ဆိုင်ပါတယ်။", "လက်ရှိ service မှာ customer account သို့မဟုတ် sign-in မလိုပါဘူး။ နောင် account feature ထည့်မယ်ဆိုရင် personal-data processing အသစ်စတင်မီ ဒီ policy ကို update လုပ်ပါမယ်။"] },
      { title: "2. မင်းကိုယ်တိုင်ပေးတဲ့ အချက်အလက်", bullets: ["First name၊ last name၊ email၊ phone နဲ့ မင်းရွေးချယ်ပေးတဲ့ contact details။", "Project brief၊ product/service details၊ deadline၊ references၊ script ideas နဲ့ messages။", "Project အတွက် မင်းပေးတဲ့ logo၊ image၊ video၊ audio၊ voice၊ brand asset နဲ့ reference files။", "Submitted materials ကို အသုံးပြုခွင့်ရှိကြောင်း confirmation နဲ့ portfolio display ခွင့်ပြု/မပြု ရွေးချယ်မှု။"] },
      { title: "3. Usage နဲ့ technical information", paragraphs: ["Analytics ကို မင်းခွင့်ပြုထားတဲ့အခါ website/app performance နဲ့ usage ကိုနားလည်ဖို့ usage data အချို့ကို စုဆောင်းနိုင်ပါတယ်။"], bullets: ["Device ထဲမှာ locally ဖန်တီးထားတဲ့ visitor identifier ကို custom analytics record မသိမ်းခင် hash လုပ်ထားပါတယ်။", "ကြည့်ခဲ့တဲ့ page/path၊ event type၊ traffic source နဲ့ portfolio video interaction။", "Device category၊ browser language၊ time zone နဲ့ request information ကနေ ရရှိတဲ့ country-level location။", "Analytics/performance provider တွေကပေးတဲ့ performance နဲ့ diagnostic information။", "Project inquiry ကို receive၊ secure၊ troubleshoot လုပ်ဖို့ လိုအပ်တဲ့ user-agent နဲ့ ordinary request information။"] },
      { title: "4. Analytics consent နဲ့ Privacy Choices", paragraphs: ["Optional analytics component တွေ မဖွင့်ခင် website/app က privacy choice ပေးပါတယ်။ “Allow analytics” သို့မဟုတ် “Essential only” ကို ရွေးနိုင်ပါတယ်။ Essential only ကိုရွေးလည်း website/app ရဲ့အဓိကလုပ်ဆောင်ချက်တွေ ဆက်သုံးနိုင်ပါတယ်။", "Privacy Choices page ကနေ analytics choice ကို နောက်မှပြောင်းနိုင်ပါတယ်။ Service ကို deliver နဲ့ protect လုပ်ဖို့ hosting/security/network provider တွေက လိုအပ်တဲ့ technical request information ကို process လုပ်နိုင်ပါတယ်။"] },
      { title: "5. Data ကို ဘာကြောင့်သုံးသလဲ", bullets: ["Project inquiry နဲ့ customer-support request ကို receive နဲ့ reply လုပ်ဖို့။", "Quote၊ creative direction၊ script၊ project plan နဲ့ deliverable ပြင်ဆင်ဖို့။", "Website/app ကို run၊ secure၊ debug နဲ့ improve လုပ်ဖို့။", "Analytics consent ရှိတဲ့အခါ product interaction နဲ့ performance ကို တိုင်းတာဖို့။", "Abuse ကာကွယ်ဖို့နဲ့ service rules enforce လုပ်ဖို့။", "လိုအပ်တဲ့ legal၊ regulatory၊ accounting သို့မဟုတ် dispute obligations ကို လိုက်နာဖို့။"] },
      { title: "6. Service providers နဲ့ နိုင်ငံခြား processing", paragraphs: ["Service run ဖို့ Supabase database services၊ Vercel hosting/analytics/performance၊ YouTube/Google embedded video နဲ့ မင်းရွေးချယ်ဖွင့်တဲ့ Telegram၊ Facebook၊ Viber၊ email provider လို third-party services တွေကို သုံးနိုင်ပါတယ်။", "Paid creative project အတွက် မင်းပေးတဲ့ project material ကို လိုအပ်သလို AI generation၊ editing၊ storage နဲ့ delivery providers တွေနဲ့ process လုပ်နိုင်ပြီး အဲဒီ provider တွေ Myanmar ပြင်ပမှာရှိနိုင်ပါတယ်။", "Personal information ကို မရောင်းပါဘူး။ Provider ရဲ့ applicable terms နဲ့ Burma AI Studio အတွက်လိုအပ်တဲ့ service function ပြင်ပ unrelated purpose အတွက် client project material ကို အသုံးပြုခွင့်ပေးတာ မဟုတ်ပါဘူး။"] },
      { title: "7. Data retention", paragraphs: ["Project communication၊ service delivery၊ business record၊ security၊ dispute နဲ့ legal obligation အတွက် လိုအပ်သလောက်သာ data ကို ထိန်းသိမ်းပါတယ်။ Data အမျိုးအစားတစ်ခုနဲ့တစ်ခု retention period မတူနိုင်ပါတယ်။", "Analytics data ကို trend analysis အတွက် retain လုပ်နိုင်ပြီး aggregate/de-identify လုပ်နိုင်ပါတယ်။ Project record ကို scope၊ payment၊ permission၊ delivery သို့မဟုတ် legal claim သက်သေအတွက် ပိုကြာကြာထိန်းထားနိုင်ပါတယ်။"] },
      { title: "8. Delete၊ correct နဲ့ consent ပြန်ရုပ်သိမ်းခြင်း", paragraphs: [`Burma AI Studio ထိန်းချုပ်တဲ့ personal data ကို access၊ correct သို့မဟုတ် delete လုပ်ဖို့ ${LEGAL_CONTACT_EMAIL} ကို email ပို့နိုင်ပါတယ်။ Relevant inquiry/project ကိုသိရှိနိုင်လောက်တဲ့အချက်အလက်ပဲ ပေးပါ။ မလိုအပ်တဲ့ sensitive data မပို့ပါနဲ့။`, "Privacy Choices page ကနေ optional analytics consent ကို အချိန်မရွေးပြောင်းနိုင်ပါတယ်။ Consent ပြန်ရုပ်သိမ်းတာက နောင် processing အတွက် သက်ရောက်ပြီး အရင်က lawful processing ဖြစ်ခဲ့တာကို အလိုအလျောက် မပျက်စေပါဘူး။", "ဥပဒေလိုအပ်ချက်၊ security/fraud prevention သို့မဟုတ် legal claim အတွက် မဖြစ်မနေလိုတဲ့ limited information ကို ဆက် retain လုပ်နိုင်ပါတယ်။"] },
      { title: "9. Security", paragraphs: ["Service ရဲ့အရွယ်အစားနဲ့ သဘောသဘာဝအလိုက် reasonable technical/organizational safeguards သုံးပါတယ်။ Internet/storage system တစ်ခုလုံးကို 100% secure လို့ အာမခံမရတာကြောင့် project brief ထဲ password၊ payment-card secret၊ government credential နဲ့ မလိုအပ်တဲ့ sensitive information မပို့သင့်ပါဘူး။"] },
      { title: "10. ကလေးများ", paragraphs: ["Burma AI Studio ဟာ business/creative-production service ဖြစ်ပြီး အသက် 13 နှစ်အောက်ကလေးတွေကို ရည်ရွယ်ထားတာမဟုတ်ပါဘူး။ Paid project သဘောတူမယ့်သူက ဥပဒေအရ contract လုပ်နိုင်တဲ့အရည်အချင်း သို့မဟုတ် parent/guardian/organization ရဲ့ အာဏာရှိရပါမယ်။"] },
      { title: "11. Update နဲ့ ဆက်သွယ်ရန်", paragraphs: [`Service ပြောင်းလဲလာတဲ့အခါ ဒီ policy ကို update လုပ်နိုင်ပါတယ်။ Current version နဲ့ effective date ကို ဒီ page မှာပြထားပါတယ်။ Privacy/deletion request များကို ${LEGAL_CONTACT_EMAIL} သို့ ပို့နိုင်ပါတယ်။`] },
    ],
  },
  terms: {
    title: "ဝန်ဆောင်မှု စည်းကမ်းချက်များ",
    eyebrow: "BURMA AI STUDIO SERVICES",
    summary: "ဒီ Terms က Burma AI Studio website/app အသုံးပြုမှုနဲ့ Burma AI Studio ရဲ့ AI-assisted creative services အသုံးပြုမှုကို အုပ်ချုပ်ပါတယ်။",
    sections: [
      { title: "1. သဘောတူခြင်းနဲ့ အရည်အချင်း", paragraphs: ["Website/app ကိုသုံးခြင်း၊ project inquiry ပို့ခြင်း သို့မဟုတ် paid project ကို confirm လုပ်ခြင်းနဲ့ ဒီ Terms နဲ့ referenced policies တွေကို သဘောတူတယ်လို့ သတ်မှတ်ပါတယ်။ Company/brand/organization ကိုယ်စားလုပ်ရင် အဲဒီအဖွဲ့အစည်းကို ကိုယ်စားပြုခွင့်ရှိကြောင်း အတည်ပြုရပါမယ်။", "Paid project တစ်ခုချင်းစီအတွက် scope၊ price၊ timeline နဲ့ delivery terms ကို သီးခြား confirm လုပ်ထားတာလည်း သက်ဆိုင်ပါတယ်။ Project-specific written term က ဒီ general Terms နဲ့ တိတိကျကျ conflict ဖြစ်ရင် project-specific term က ဦးစားပေးပါတယ်။"] },
      { title: "2. ဝန်ဆောင်မှုများ", paragraphs: ["AI presenter video၊ product video၊ advertising creative၊ social short၊ cinematic brand video၊ image generation၊ script/concept development၊ editing နဲ့ ဆက်စပ် production services တွေကို ပေးနိုင်ပါတယ်။", "Production ထဲမှာ AI နဲ့ third-party creative tools သုံးနိုင်ပြီး သီးခြားသဘောတူထားတာမရှိရင် workflow ကို Burma AI Studio က project လိုအပ်ချက်အလိုက် ရွေးချယ်ပါတယ်။"] },
      { title: "3. Quote၊ order နဲ့ scope", paragraphs: ["Price၊ delivery estimate၊ revision allowance နဲ့ deliverable ကို accepted scope/quote မှာ သတ်မှတ်ပါတယ်။ စုံစမ်းမေးမြန်းထားရုံနဲ့ project ကို Burma AI Studio က လက်ခံပြီးပြီလို့ မယူဆပါဘူး။", "Approved script၊ concept၊ duration၊ character/presenter၊ visual direction၊ format၊ platform requirement သို့မဟုတ် deliverable ကို အဓိကပြောင်းတာ scope change ဖြစ်နိုင်ပြီး fee/time ထပ်လိုနိုင်ပါတယ်။"] },
      { title: "4. Client တာဝန်", bullets: ["မှန်ကန်တဲ့ project instruction နဲ့ timely feedback ပေးရန်။", "မိမိပိုင် သို့မဟုတ် သုံးခွင့်ရှိတဲ့ material ပဲပေးရန်။", "Identifiable person၊ voice၊ trademark၊ product၊ music၊ footage စတဲ့ protected material အတွက် လိုအပ်တဲ့ permission ရယူထားရန်။", "Fact၊ law၊ medical၊ financial၊ regulatory၊ price နဲ့ promotional claim တွေကို publish မလုပ်ခင် review လုပ်ရန်။", "Final deliverable ကို lawful purpose နဲ့ applicable platform rules အတိုင်းသုံးရန်။"] },
      { title: "5. AI-generated content", paragraphs: ["Generative system တွေမှာ face၊ hand၊ movement၊ lip-sync၊ voice၊ text၊ logo နဲ့ physical detail တချို့ မတူညီမှု/artifact ဖြစ်နိုင်ပါတယ်။ Burma AI Studio က reasonable creative review လုပ်ပေမယ့် generation တစ်ကြိမ်နဲ့တစ်ကြိမ် အတိအကျတူမယ် သို့မဟုတ် artifact လုံးဝမရှိဘူးလို့ မအာမခံပါဘူး။", "သီးခြားသဘောတူထားတာမရှိရင် name၊ price၊ claim၊ contact details၊ subtitle၊ trademark စတဲ့ publication-critical facts ကို final review လုပ်ဖို့ client မှာတာဝန်ရှိပါတယ်။"] },
      { title: "6. Payment၊ revision၊ cancellation၊ refund", paragraphs: ["Project payment၊ milestone၊ cancellation နဲ့ refund ကို Project & Payment Policy နဲ့ accepted quote/project agreement အတိုင်း ကိုင်တွယ်ပါတယ်။ ဥပဒေအရ မဖြုတ်နိုင်တဲ့ consumer remedy ကို blanket no-refund rule နဲ့မဖယ်ရှားပါဘူး။"] },
      { title: "7. မူပိုင်ခွင့်နဲ့ client material", paragraphs: ["Client ပေးတဲ့ material ပေါ် client ရဲ့ရှိပြီးသား rights ကို client ဆက်ထိန်းထားပါတယ်။ Final deliverable rights ကို AI & Intellectual Property Policy နဲ့ project agreement က သတ်မှတ်ပါတယ်။ သီးခြားသဘောတူထားတာမရှိရင် final commercial-use right/transfer က agreed payment ပြည့်ပြီးမှ သက်ရောက်ပါတယ်။", "Burma AI Studio ရဲ့ tools၊ know-how၊ templates၊ workflows၊ prompt methods၊ reusable techniques နဲ့ internal systems ကို Burma AI Studio ဆက်ထိန်းထားပါတယ်။ Raw prompt/source/editable working file တွေဟာ deliverable အဖြစ် အတိအကျထည့်ထားမှ ပေးရမယ့်အရာ ဖြစ်ပါတယ်။"] },
      { title: "8. Portfolio", paragraphs: ["Project-intake မှာ portfolio permission ကို သီးခြားရွေးခွင့်ပေးထားတဲ့အခါ default အဖြစ် public portfolio ထဲမသုံးပါဘူး။ Client opt-in သို့မဟုတ် နောက်မှ written permission ပေးမှ public showcase လုပ်နိုင်ပါတယ်။"] },
      { title: "9. မလက်ခံနိုင်တဲ့/regulated project", paragraphs: ["Acceptable Use Policy ချိုးဖောက်တာ သို့မဟုတ် legal/safety/rights/platform risk အလွန်များတဲ့ project ကို refuse၊ pause သို့မဟုတ် stop လုပ်နိုင်ပါတယ်။ Regulated sector များအတွက် lawful authorization သက်သေကို တောင်းနိုင်ပါတယ်။"] },
      { title: "10. Third-party service နဲ့ result guarantee", paragraphs: ["AI model၊ cloud provider၊ video platform နဲ့ communication service တို့ရဲ့ availability၊ moderation၊ license restriction နဲ့ policy change ကို Burma AI Studio က အပြည့်အဝမထိန်းချုပ်နိုင်ပါဘူး။", "Creative deliverable တစ်ခုကြောင့် sales၊ revenue၊ views၊ followers၊ viral result၊ ad approval၊ app-store approval သို့မဟုတ် platform approval တိတိကျကျရမယ်လို့ မအာမခံပါဘူး။"] },
      { title: "11. Confidentiality", paragraphs: ["Production အတွက်ပေးတဲ့ non-public project information ကို reasonable care နဲ့ကိုင်တွယ်ပါတယ်။ အထူး confidential material ရှိရင် client ကရှင်းရှင်းလင်းလင်းပြောသင့်ပြီး project အတွက် မလိုအပ်တဲ့ secret မပေးသင့်ပါဘူး။"] },
      { title: "12. Disclaimer နဲ့ liability", paragraphs: ["Agreed creative scope အတွက် reasonable skill/care နဲ့ service ပေးပါတယ်။ Applicable law ခွင့်ပြုသလောက် platform change၊ client ပေးတဲ့အမှား၊ unauthorized client material သို့မဟုတ် agreed scope ပြင်ပအသုံးပြုမှုကြောင့်ဖြစ်တဲ့ indirect/speculative/consequential business loss အတွက် Burma AI Studio ရဲ့တာဝန်ကို ကန့်သတ်နိုင်ပါတယ်။", "ဥပဒေအရ မဖြုတ်နိုင်တဲ့ liability နဲ့ consumer right ကို ဒီ Terms က မဖယ်ရှားပါဘူး။"] },
      { title: "13. Suspension၊ termination နဲ့ governing rules", paragraphs: ["Non-payment၊ abusive conduct၊ illegal instruction၊ rights concern သို့မဟုတ် material breach ဖြစ်ရင် project ကို pause/terminate လုပ်နိုင်ပါတယ်။ Financial consequence ကို Project & Payment Policy နဲ့ applicable law အတိုင်းတွက်ချက်ပါတယ်။", "ဒီ Terms ကို Myanmar မှာသက်ဆိုင်တဲ့ laws အတိုင်းအခြေခံထားပြီး user location သို့မဟုတ် transaction ကြောင့် mandatory protection ပိုသက်ရောက်ရင် အဲဒါက ဆက်သက်ရောက်ပါတယ်။"] },
      { title: "14. ဆက်သွယ်ရန်", paragraphs: [`Terms မေးခွန်းများကို ${LEGAL_CONTACT_EMAIL} သို့ပို့နိုင်ပါတယ်။`] },
    ],
  },
  project: {
    title: "Project နှင့် ငွေပေးချေမှု မူဝါဒ",
    eyebrow: "SCOPE · REVISIONS · DELIVERY · REFUNDS",
    summary: "Scope၊ revision၊ payment၊ client delay၊ cancellation၊ refund နဲ့ delivery ကို Burma AI Studio ဘယ်လိုကိုင်တွယ်တယ်ဆိုတာ ဒီ policy မှာ သတ်မှတ်ထားပါတယ်။",
    sections: [
      { title: "1. Project confirmation", paragraphs: ["Deliverable၊ duration၊ format၊ platform၊ creative direction၊ price၊ payment milestone၊ expected delivery နဲ့ included revisions စတဲ့ အဓိက commercial terms တွေကို Burma AI Studio နဲ့ client confirm လုပ်ပြီးမှ project စတင်ပါတယ်။", "Message၊ quote၊ invoice နဲ့ written confirmation တွေကို project record အဖြစ် အသုံးပြုနိုင်ပါတယ်။ Production မစခင် client က scope ကို review လုပ်သင့်ပါတယ်။"] },
      { title: "2. Fee နဲ့ payment milestone", paragraphs: ["Project တစ်ခုချင်းစီအတွက် amount due နဲ့ deposit/milestone arrangement ကို quote/project agreement က သတ်မှတ်ပါတယ်။ Agreed payment မရသေးရင် production time reserve မလုပ်ခြင်း၊ paid generation မစခြင်း သို့မဟုတ် final file မrelease လုပ်ခြင်း ဖြစ်နိုင်ပါတယ်။"] },
      { title: "3. Revision နဲ့ scope change", paragraphs: ["Revision ဆိုတာ approved direction အတွင်း reasonable adjustment ဖြစ်ပါတယ်။ Script concept၊ total duration၊ main character/presenter၊ platform format၊ product၊ visual direction သို့မဟုတ် deliverable count အဓိကပြောင်းတာ scope change ဖြစ်ပါတယ်။", "Scope change ဖြစ်ရင် quote အသစ်၊ additional payment သို့မဟုတ် delivery estimate အသစ် လိုနိုင်ပါတယ်။ မသဘောတူရသေးတဲ့ additional fee ကို charge မလုပ်ခင် confirmation တောင်းပါမယ်။"] },
      { title: "4. Client feedback နဲ့ delay", paragraphs: ["Delivery estimate က client info၊ asset၊ approval နဲ့ feedback အချိန်မီရရှိခြင်းပေါ် မူတည်ပါတယ်။ Missing instruction၊ late feedback၊ requirement change သို့မဟုတ် client asset မရခြင်းကြောင့် delay ဖြစ်ရင် delivery date ရွှေ့နိုင်ပြီး studio failure လို့မယူဆပါဘူး။"] },
      { title: "5. Production မစခင် cancellation", paragraphs: ["Material production work သို့မဟုတ် non-recoverable third-party cost မစခင် cancel လုပ်ရင် work already done၊ reserved time နဲ့ non-recoverable cost အပေါ်မူတည်ပြီး refundable amount ကို reasonableness နဲ့တွက်ချက်ပါမယ်။"] },
      { title: "6. Production စပြီးနောက် cancellation", paragraphs: ["Script development၊ generation၊ editing၊ paid media processing သို့မဟုတ် material production work စပြီးရင် completed work၊ committed production time နဲ့ non-recoverable third-party cost အတွက် fee ကို retain လုပ်နိုင်ပါတယ်။ ကျန် refundable balance ရှိရင် project facts နဲ့ applicable law အတိုင်း ကိုင်တွယ်ပါတယ်။"] },
      { title: "7. Burma AI Studio က agreed service မပြီးနိုင်ရင်", paragraphs: ["Material deliverable ကို မပေးနိုင်ဘဲ reasonable fix/replacement မလုပ်နိုင်ရင် re-performance၊ replacement deliverable၊ credit၊ partial refund သို့မဟုတ် full refund စတဲ့ သင့်တော်တဲ့ remedy ကို paid/delivered status အလိုက် ဆွေးနွေးပါမယ်။"] },
      { title: "8. Delivery နဲ့ approval", paragraphs: ["Project အတွက်သဘောတူထားတဲ့ communication/file-delivery channel နဲ့ deliver လုပ်ပါတယ်။ Objective error သို့မဟုတ် included revision request ရှိရင် communicated review period အတွင်း ပြောသင့်ပါတယ်။", "Silent ဖြစ်နေရုံနဲ့ mandatory right မပျောက်ပေမယ့် client inactivity ကြာရင် project ကို pause လုပ်နိုင်ပြီး နောက်ပိုင်း scheduling/revision availability ပြောင်းနိုင်ပါတယ်။"] },
      { title: "9. Platform rejection / campaign performance", paragraphs: ["Ad/post/account/campaign ကို platform က approve မလုပ်တာတစ်ခုတည်းနဲ့ creative service defective ဖြစ်တယ်လို့ မယူဆပါဘူး။ Agreed scope အတွင်း correctable production issue ကြောင့် rejection ဖြစ်ရင် reasonable review လုပ်ပါမယ်။ Platform approval နဲ့ business performance ကို မအာမခံပါဘူး။"] },
      { title: "10. Payment dispute", paragraphs: [`Payment dispute မစခင် project record၊ delivered work နဲ့ refund issue ကို good faith နဲ့ review လုပ်နိုင်ဖို့ ${LEGAL_CONTACT_EMAIL} ကို ဆက်သွယ်ဖို့ အကြံပြုပါတယ်။ ဒါက lawful payment-provider/legal dispute right ကို မဖယ်ရှားပါဘူး။`] },
    ],
  },
  "ai-ip": {
    title: "AI နှင့် မူပိုင်ခွင့် မူဝါဒ",
    eyebrow: "AI GENERATION · CLIENT ASSETS · RIGHTS",
    summary: "AI-generated work၊ client asset၊ face/voice permission၊ commercial-use rights နဲ့ third-party restriction ကို ဒီ policy က သတ်မှတ်ပါတယ်။",
    sections: [
      { title: "1. AI-assisted production", paragraphs: ["Generative AI၊ video/image model၊ voice tool၊ editing system နဲ့ အခြား software တွေကို creative workflow ထဲ သုံးနိုင်ပါတယ်။ AI ဟာ production tool တစ်ခုဖြစ်ပြီး final result မှာ human direction၊ selection၊ editing နဲ့ quality review ပါနိုင်ပါတယ်။"] },
      { title: "2. Client asset rights", paragraphs: ["Logo၊ image၊ video၊ audio၊ music၊ trademark၊ script၊ character၊ photo၊ voice sample သို့မဟုတ် အခြား asset ပေးတဲ့အခါ မိမိပိုင် သို့မဟုတ် requested production/use အတွက် လုံလောက်တဲ့ permission ရှိတယ်လို့ client ကအတည်ပြုရပါမယ်။", "Asset အသုံးပြုမှု၊ edit၊ generate၊ display၊ publish သို့မဟုတ် license ပေါ် restriction ရှိရင် Burma AI Studio ကို ကြိုပြောရပါမယ်။"] },
      { title: "3. Identifiable person၊ face နဲ့ voice", paragraphs: ["တကယ့်လူတစ်ယောက်ရဲ့ face/body/voice/identity ကို realistic generation၊ animation၊ cloning သို့မဟုတ် synthetic reproduction လုပ်ခိုင်းမယ်ဆိုရင် သင့်တော်တဲ့ authorization ရှိရပါမယ်။ Consent မရှင်းရင် proof တောင်းနိုင်သလို request ကို refuse လုပ်နိုင်ပါတယ်။", "Non-consensual impersonation၊ deceptive identity manipulation နဲ့ unauthorized face/voice cloning ကို မလက်ခံပါဘူး။"] },
      { title: "4. AI output limitation နဲ့ similarity", paragraphs: ["AI output ဟာ probabilistic ဖြစ်ပြီး artifact သို့မဟုတ် အခြား content နဲ့ general pattern similarity ရှိနိုင်ပါတယ်။ သီးခြားသဘောတူပြီး ဥပဒေအရဖြစ်နိုင်တာမရှိရင် AI element တစ်ခုက 100% unique၊ registrable၊ exclusive သို့မဟုတ် jurisdiction တိုင်းမှာ IP protection ရမယ်လို့ မအာမခံပါဘူး။"] },
      { title: "5. Final deliverable rights", paragraphs: ["Full payment ပြီးရင် Burma AI Studio က ဥပဒေအရ/contract အရ ပေးနိုင်တဲ့ ownership interest သို့မဟုတ် commercial-use permission ကို accepted project agreement နဲ့ third-party restriction အတိုင်း client ရရှိပါတယ်။", "Stock media၊ music၊ font၊ AI-platform output၊ software asset နဲ့ third-party material တွေက သူတို့ရဲ့ own license/terms အောက်မှာ ဆက်ရှိနိုင်ပြီး အဲဒီ terms ခွင့်ပြုသလောက်ပဲ transfer/use လုပ်နိုင်ပါတယ်။"] },
      { title: "6. Studio tools နဲ့ working materials", paragraphs: ["Burma AI Studio ရဲ့ know-how၊ prompt methods၊ templates၊ workflows၊ internal tools၊ production system၊ test generations နဲ့ general techniques ကို Burma AI Studio ဆက်ထိန်းထားပါတယ်။ Source/editable files၊ raw generations နဲ့ prompts ကို deliverable အဖြစ် ရေးသားထားမှ ပါဝင်ပါတယ်။"] },
      { title: "7. Portfolio permission", paragraphs: ["Project-intake မှာ portfolio option သီးခြားရှိရင် public portfolio use က opt-in ဖြစ်ပါတယ်။ Written request နဲ့ permission ကို နောက်မှပြောင်းနိုင်ပေမယ့် withdrawal မတိုင်ခင် lawful publish/distribution လုပ်ပြီးသား material ကို reasonable steps အတိုင်း ကိုင်တွယ်ပါမယ်။"] },
      { title: "8. Rights concern", paragraphs: ["Deliverable သို့မဟုတ် portfolio item က right တစ်ခုချိုးဖောက်တယ်၊ identifiable person ကို authorization မရှိဘဲသုံးတယ်လို့ ယုံကြည်ရင် Copyright & Content Complaints process ကို သုံးပါ။ Credible claim review လုပ်နေချိန် access ကို temporary restrict လုပ်နိုင်ပါတယ်။"] },
    ],
  },
  "acceptable-use": {
    title: "လက်ခံနိုင်သော အသုံးပြုမှု မူဝါဒ",
    eyebrow: "SAFE + LAWFUL CREATIVE SERVICES",
    summary: "ဥပဒေ၊ လုံခြုံရေး၊ rights၊ fraud သို့မဟုတ် platform compliance risk ကြီးမားတဲ့ project ကို Burma AI Studio က refuse သို့မဟုတ် stop လုပ်နိုင်ပါတယ်။",
    sections: [
      { title: "1. အခြေခံစည်းကမ်း", paragraphs: ["ဥပဒေချိုးဖောက်တဲ့ သို့မဟုတ် အခြားသူရဲ့ rights/safety ကို အဓိကထိခိုက်စေတဲ့ content ကို request၊ create၊ publish သို့မဟုတ် distribute လုပ်ဖို့ Burma AI Studio ကို မသုံးရပါဘူး။ High-risk work များအတွက် authorization/license proof တောင်းနိုင်ပါတယ်။"] },
      { title: "2. မလက်ခံနိုင်သော request", bullets: ["Fraud၊ scam၊ deceptive impersonation၊ identity theft၊ forged evidence သို့မဟုတ် ပိုက်ဆံ/access ရဖို့ ရည်ရွယ်ထားတဲ့ အန္တရာယ်ရှိ false representation။", "Identifiable person အပေါ် non-consensual face/voice cloning၊ realistic impersonation သို့မဟုတ် misleading identity manipulation။", "Child sexual exploitation၊ non-consensual intimate imagery နဲ့ exploitative sexual content။", "Credible threat၊ targeted harassment၊ hateful abuse သို့မဟုတ် လူ/အဖွဲ့တစ်ခုအပေါ် violence လွယ်ကူစေတဲ့ content။", "Client မှာ authorization မရှိတဲ့ material copyright/trademark/privacy/publicity rights infringement။", "Malware၊ credential theft၊ unauthorized access သို့မဟုတ် malicious cyber activity ကို အဓိကကူညီတဲ့ instruction။", "အခြား unlawful သို့မဟုတ် serious safety risk ရှိတယ်လို့ reasonable belief ရှိတဲ့ content။"] },
      { title: "3. Regulated / high-risk sector", paragraphs: ["Gambling/betting၊ financial product၊ healthcare claim၊ political/election promotion၊ age-restricted product၊ regulated professional service စတဲ့ sector တွေအတွက် lawful authorization၊ disclaimer သို့မဟုတ် platform eligibility proof လိုနိုင်ပါတယ်။ လုံလောက်တဲ့ lawful assurance မပေးနိုင်ရင် project ကို decline လုပ်နိုင်ပါတယ်။", "Client business ကို Burma AI Studio က independently license/certify လုပ်ပေးတာ မဟုတ်ပါဘူး။ Business legality၊ offer၊ claim နဲ့ distribution channel အတွက် client မှာတာဝန်ရှိပါတယ်။"] },
      { title: "4. Enforcement", paragraphs: ["Policy apply လုပ်ဖို့ request refuse၊ production pause၊ change တောင်း၊ public portfolio remove သို့မဟုတ် project terminate လုပ်နိုင်ပါတယ်။ Payment consequence ကို completed work၊ stop reason နဲ့ applicable law ကိုကြည့်ပြီး Project & Payment Policy အတိုင်း ကိုင်တွယ်ပါတယ်။"] },
    ],
  },
  copyright: {
    title: "မူပိုင်ခွင့်နှင့် Content တိုင်ကြားမှု",
    eyebrow: "RIGHTS REPORTING PROCESS",
    summary: "Burma AI Studio က host သို့မဟုတ် public display လုပ်ထားတဲ့ content တစ်ခုက copyright၊ trademark၊ privacy၊ publicity သို့မဟုတ် အခြား protected right ချိုးဖောက်တယ်လို့ ယုံကြည်ရင် ဒီ process ကို သုံးနိုင်ပါတယ်။",
    sections: [
      { title: "1. တိုင်ကြားရာမှာ ပေးရမယ့်အချက်", bullets: ["မင်းရဲ့ name နဲ့ reliable contact information။", "ထိခိုက်တယ်လို့ ယုံကြည်တဲ့ protected work၊ identity၊ trademark သို့မဟုတ် right ကို ရှင်းလင်းဖော်ပြချက်။", "Report လုပ်နေတဲ့ exact Burma AI Studio page၊ portfolio item သို့မဟုတ် URL။", "ဘာကြောင့် unauthorized/infringing ဖြစ်တယ်လို့ ယုံကြည်ရသလဲဆိုတဲ့ အကျဉ်းချုပ်။", "Rights holder ဖြစ်ကြောင်း သို့မဟုတ် rights holder ကိုယ်စားလုပ်ခွင့်ရှိကြောင်း သက်သေ။", "Notice ထဲက information ကို best knowledge အရ accurate ဖြစ်ကြောင်း good-faith statement။"] },
      { title: "2. ဘယ်ကိုပို့ရမလဲ", paragraphs: [`${LEGAL_CONTACT_EMAIL} ကို subject “Rights Complaint — Burma AI Studio” နဲ့ပို့ပါ။ Password၊ payment-card information နဲ့ မလိုအပ်တဲ့ sensitive document မပို့ပါနဲ့။`] },
      { title: "3. Review နဲ့ temporary action", paragraphs: ["Credible complaint ကို review လုပ်နေချိန် additional information တောင်းနိုင်ပြီး public content ကို temporary hide/restrict လုပ်နိုင်ပါတယ်။ Safety/legal risk မရှိရင် content ပေးခဲ့တဲ့ client/person ကို authorization/context ပေးနိုင်ဖို့ notice ပေးနိုင်ပါတယ်။"] },
      { title: "4. Content provider response", paragraphs: ["Content ကို mistake နဲ့ restrict လုပ်ထားတယ်လို့ client ယုံကြည်ရင် ownership၊ consent၊ license သို့မဟုတ် အခြား lawful authority evidence ပေးနိုင်ပါတယ်။ Available information နဲ့ applicable obligation ကို review ပြီး restore၊ modify သို့မဟုတ် restricted ဆက်ထားနိုင်ပါတယ်။"] },
      { title: "5. Complaint process ကို အလွဲသုံးစားလုပ်ခြင်း", paragraphs: ["သိသိသာသာ false/abusive rights complaint လုပ်တာလည်း Terms ချိုးဖောက်နိုင်ပါတယ်။ ဒီ process ဟာ legal advice သို့မဟုတ် court process အစားထိုးတာမဟုတ်သလို applicable law အောက်ရှိ rights ကိုလည်း မကန့်သတ်ပါဘူး။"] },
    ],
  },
};

export function getLegalDocument(key: LegalDocumentKey, language: LegalLanguage) {
  return (language === "MM" ? MM : EN)[key];
}
