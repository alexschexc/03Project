import Header from "../components/Header";

export default function Account() {
  return (
    <>
      <div className="min-h-screen bg-pink-100 pt-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-semibold mb-4">Welcome back!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Checking Account</h2>
                <p className="text-3xl font-bold">$2,547.23</p>
                <p className="text-sm text-gray-500">Available Balance</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Savings Account</h2>
                <p className="text-3xl font-bold">$10,847.65</p>
                <p className="text-sm text-gray-500">Available Balance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
