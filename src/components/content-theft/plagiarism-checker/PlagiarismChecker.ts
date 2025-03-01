
// Re-export types and functionality from the separate modules
export type { AuthenticityCheck } from './AuthenticityVerifier';
export { verifyContentAuthenticity } from './AuthenticityVerifier';
export type { PlagiarismMatch, PlagiarismResult } from './PlagiarismDetector';
export { checkPlagiarism } from './PlagiarismDetector';
