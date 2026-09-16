/**
 * © 2026 AcreDesk™. All Rights Reserved.
 *
 * Statutory Copyright Registration Deposit Generator
 *
 * This script compiles a redacted, standardized representation of the AcreDesk
 * source code (first and last portions of the computer program) suitable for
 * submission to copyright registration authorities (e.g., US Copyright Office,
 * Indian Copyright Office) under computer program deposit guidelines.
 */

const fs = require("fs");
const path = require("path");

const SOURCE_FILES = [
  // First representative portion (App entry, navigation, routing, auth logic)
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/proxy.ts",
  "src/components/Navbar.tsx",
  "src/components/Footer.tsx",
  "src/app/actions/auth.ts",
  "src/app/actions/properties.ts",
  "src/app/actions/leads.ts",
  "src/lib/validations/index.ts",
  // Last representative portion (CRM console, data tables, detail views, styling)
  "src/components/DashboardLayout.tsx",
  "src/app/admin/dashboard/page.tsx",
  "src/app/admin/inventory/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx"
];

function generateDeposit() {
  const rootDir = path.resolve(__dirname, "..");
  const outputFile = path.join(rootDir, "acredesk_copyright_deposit.txt");

  let content = "";
  content += "================================================================================\n";
  content += "OFFICIAL STATUTORY COPYRIGHT REGISTRATION DEPOSIT\n";
  content += "TITLE OF WORK: AcreDesk Real Estate Management Platform\n";
  content += "AUTHOR / CLAIMANT: AcreDesk\n";
  content += "YEAR OF FIRST PUBLICATION: 2026\n";
  content += "NATURE OF WORK: Computer Program / Source Code Architecture\n";
  content += "COPYRIGHT NOTICE: © 2026 AcreDesk™. All Rights Reserved.\n";
  content += "================================================================================\n\n";

  let totalLines = 0;

  for (const relativePath of SOURCE_FILES) {
    const fullPath = path.join(rootDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`[WARN] File not found: ${relativePath}`);
      continue;
    }

    let fileData = fs.readFileSync(fullPath, "utf8");

    // Redact any potential secrets or sensitive tokens
    fileData = fileData.replace(/(SUPABASE_SERVICE_ROLE_KEY|JWT_SECRET|API_KEY)\s*[:=]\s*["'][^"']+["']/gi, "$1: [REDACTED FOR TRADE SECRET PROTECTION]");
    fileData = fileData.replace(/password\s*[:=]\s*["'][^"']+["']/gi, "password: [REDACTED]");

    const lines = fileData.split("\n");
    totalLines += lines.length;

    content += `\n/* -------------------------------------------------------------------------- */\n`;
    content += `/* FILE: ${relativePath} (${lines.length} lines) */\n`;
    content += `/* -------------------------------------------------------------------------- */\n\n`;

    lines.forEach((line, index) => {
      const lineNum = String(index + 1).padStart(5, " ");
      content += `${lineNum} | ${line}\n`;
    });
  }

  fs.writeFileSync(outputFile, content, "utf8");
  console.log(`[SUCCESS] Copyright deposit generated successfully!`);
  console.log(`Output: ${outputFile}`);
  console.log(`Total Source Files Included: ${SOURCE_FILES.length}`);
  console.log(`Total Lines of Code: ${totalLines}`);
  console.log(`You can print or convert this file to PDF for your copyright office filing.`);
}

generateDeposit();
