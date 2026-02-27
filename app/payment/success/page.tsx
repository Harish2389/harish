export default function SuccessPage({ searchParams }: any) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Payment Success</h1>
      <p>Order: {searchParams?.order_id}</p>
    </div>
  );
}