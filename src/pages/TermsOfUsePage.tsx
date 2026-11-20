import React, { useEffect } from 'react';
import { PolicyDocumentView } from '../components/legal/PolicyDocumentView';
import { TERMS_OF_USE_DOCUMENT } from '../content/legalPolicies';

export function TermsOfUsePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <PolicyDocumentView document={TERMS_OF_USE_DOCUMENT} />;
}
