import React, { useEffect } from 'react';
import { PolicyDocumentView } from '../components/legal/PolicyDocumentView';
import { PRIVACY_POLICY_DOCUMENT } from '../content/legalPolicies';

export function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <PolicyDocumentView document={PRIVACY_POLICY_DOCUMENT} />;
}
