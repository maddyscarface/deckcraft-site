"use client";
export function PrivacyChoicesLink() {
  return <button type="button" className="underline" onClick={() => window.dispatchEvent(new Event("dc:privacy-choices"))}>Change your cookie choices.</button>;
}
