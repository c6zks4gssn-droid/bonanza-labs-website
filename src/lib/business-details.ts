export const businessDetails = {
  tradeName: process.env.NEXT_PUBLIC_LEGAL_NAME || "BonanzaLabs",
  legalForm: process.env.NEXT_PUBLIC_LEGAL_FORM || "Eenmanszaak",
  kvkNumber: process.env.NEXT_PUBLIC_KVK_NUMBER || "88564517",
  branchNumber: process.env.NEXT_PUBLIC_BRANCH_NUMBER || "000054418089",
  streetAddress: process.env.NEXT_PUBLIC_STREET_ADDRESS || "Bloedkoraalstraat 49",
  postalCode: process.env.NEXT_PUBLIC_POSTAL_CODE || "9743 KB",
  city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "Groningen",
  country: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || "Nederland",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@bonanza-labs.com",
} as const;

export const fullBusinessAddress = [
  businessDetails.streetAddress,
  `${businessDetails.postalCode} ${businessDetails.city}`,
  businessDetails.country,
].join(", ");
