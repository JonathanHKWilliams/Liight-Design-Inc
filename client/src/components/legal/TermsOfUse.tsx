import React from 'react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-8 font-poppins">
      <h1 className="text-3xl font-bold text-primary mb-6">Terms of Use</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using LIIGHT DESIGN INC's website and services, you agree to be bound by these Terms of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Use License</h2>
          <p>
            Permission is granted to temporarily view the materials on LIIGHT DESIGN INC's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          <p className="mt-2">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by LIIGHT DESIGN INC at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Disclaimer</h2>
          <p>
            The materials on LIIGHT DESIGN INC's website are provided on an 'as is' basis. LIIGHT DESIGN INC makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="mt-2">
            Further, LIIGHT DESIGN INC does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Limitations</h2>
          <p>
            In no event shall LIIGHT DESIGN INC or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LIIGHT DESIGN INC's website, even if LIIGHT DESIGN INC or a LIIGHT DESIGN INC authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on LIIGHT DESIGN INC's website could include technical, typographical, or photographic errors. LIIGHT DESIGN INC does not warrant that any of the materials on its website are accurate, complete, or current. LIIGHT DESIGN INC may make changes to the materials contained on its website at any time without notice. However, LIIGHT DESIGN INC does not make any commitment to update the materials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Links</h2>
          <p>
            LIIGHT DESIGN INC has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LIIGHT DESIGN INC of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Modifications</h2>
          <p>
            LIIGHT DESIGN INC may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us at liightdesigninc@gmail.com.
          </p>
        </section>
      </div>
      
      <div className="mt-8 text-gray-500 text-sm">
        Last updated: June 25, 2025
      </div>
    </div>
  );
};

export default TermsOfUse;
