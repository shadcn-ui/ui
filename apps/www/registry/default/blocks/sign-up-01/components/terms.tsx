import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { Checkbox } from "@/registry/default/ui/checkbox"

export function Terms(props: { onCloseClick: () => void }) {
  return (
    <div className="max-w-3xl mb-2 p-6 rounded-lg shadow-lg h-full">
      <Button
        type="button"
        className="bg-gray-300 p-1 m-0 h-fit"
        onClick={props.onCloseClick}
      >
        <ArrowLeftIcon />
      </Button>

      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 mt-5">
        Terms of Service
      </h1>

      <p className="text-gray-600 mb-6">
        Welcome to our website! Please read these Terms of Service carefully
        before using our services. By accessing or using our services, you agree
        to these terms.
      </p>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        1. Acceptance of Terms
      </h2>
      <p className="text-gray-600 mb-6">
        By accessing or using our services, you agree to comply with and be
        bound by these Terms of Service, including any amendments we may make
        from time to time. If you do not agree with these terms, please do not
        use our services.
      </p>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        2. Modifications to the Terms
      </h2>
      <p className="text-gray-600 mb-6">
        We reserve the right to modify, alter, or update these Terms of Service
        at any time. Changes will be posted on this page, and the effective date
        will be updated. It is your responsibility to periodically review the
        Terms of Service to be aware of any changes.
      </p>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        3. Use of Services
      </h2>
      <p className="text-gray-600 mb-6">
        You agree to use our services in compliance with all applicable laws and
        regulations. You may not use our services for illegal, harmful, or
        offensive activities.
      </p>
      <ul className="list-disc pl-6 text-gray-600 mb-6">
        <li>You shall not transmit viruses or other harmful content.</li>
        <li>
          You shall not use the services for commercial purposes without our
          express permission.
        </li>
        <li>
          You shall not interfere with or attempt to bypass security systems of
          the service.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        4. Intellectual Property
      </h2>
      <p className="text-gray-600 mb-6">
        All intellectual property rights in our services, including but not
        limited to content, design, trademarks, and software, are owned by us or
        licensed to us. No intellectual property rights are transferred to you
        through the use of our services.
      </p>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        5. Limitation of Liability
      </h2>
      <p className="text-gray-600 mb-6">
        While we strive to provide high-quality services, we do not guarantee
        that our services will be error-free or uninterrupted. We are not liable
        for any direct or indirect damage caused by the use or inability to use
        our services.
      </p>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        6. Privacy Policy
      </h2>
      <p className="text-gray-600 mb-6">
        We are committed to protecting your privacy. To learn how we collect,
        use, and protect your personal information, please review our{" "}
        <a href="#" className="text-blue-500 hover:text-blue-700">
          Privacy Policy
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        7. Termination
      </h2>
      <p className="text-gray-600 mb-6">
        We may suspend or terminate your account at any time, without notice, if
        we believe you have violated these Terms of Service.
      </p>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        8. General Provisions
      </h2>
      <p className="text-gray-600 mb-6">
        These Terms of Service are governed by the laws of the United States. If
        any provision of these terms is deemed invalid or unenforceable, the
        remaining provisions will remain in full force and effect.
      </p>

      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>© 2025 Company Name. All rights reserved.</p>
      </footer>

      <div className="flex justify-center space-x-2 mt-5 p-2">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>
    </div>
  )
}
