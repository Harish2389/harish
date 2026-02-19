import SupportClient from "./support-client";

// Support page no longer requires authentication. Simply render the support form
// without redirecting to a login page since the app has no login functionality.
export default function SupportPage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Support</h1>
      <p className="text-sm text-zinc-600">
        Send a message to support. We'll respond on your email.
      </p>
      <SupportClient />
    </div>
  );
}
