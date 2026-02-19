export const metadata = {
  title: "Pricing",
};

// This simple page explains that there is currently no paid tier. All functionality
// is free to use because login and payment flows have been removed.
export default function PricingPage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Pricing</h1>
      <p className="text-sm text-zinc-700">
        At the moment there is no paid version of AI Homework Helper. All features are
        available for free with a daily usage limit. If we introduce a premium tier in
        the future we will update this page with details.
      </p>
    </div>
  );
}