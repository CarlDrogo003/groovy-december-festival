export default function AdminRafflePage() {
  const nextDrawDate = () => {
    const now = new Date()
    const next = new Date(now)
    next.setDate(now.getDate() + (2 - (now.getDate() % 2)))
    return next.toLocaleDateString()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🛺 KEKE Raffle Information</h1>
        <p className="text-gray-600">Manual raffle draw information and details</p>
      </div>

      {/* Next Draw Info */}
      <div className="bg-gradient-to-r from-green-600 to-red-600 text-white p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">🎯 Next Scheduled Draw</h2>
        <p className="text-2xl mb-2">📅 {nextDrawDate()}</p>
        <p className="text-lg opacity-90">KEKE draws happen every 2 days during the festival</p>
        <p className="text-sm opacity-75 mt-4">December 15-31, 2025 • Manual draws conducted by festival team</p>
      </div>

      {/* Prize Information */}
      <div className="bg-white rounded-lg shadow-lg border p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🛺</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">BRAND NEW KEKE</h3>
          <p className="text-lg text-gray-600">Auto Rickshaw/Tricycle</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-900">Prize Features:</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Brand new auto rickshaw</li>
              <li>• Fuel efficient design</li>
              <li>• Perfect for commercial use</li>
              <li>• Immediate business opportunity</li>
              <li>• Durable and reliable</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-900">Draw Schedule:</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Every 2 days during festival</li>
              <li>• December 15-31, 2025</li>
              <li>• Manual draws by festival team</li>
              <li>• Winners announced live</li>
              <li>• Multiple KEKE prizes to win</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Participation Requirements */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">📋 How to Participate</h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-yellow-800">1</span>
            </div>
            <div className="font-semibold">Visit ATM</div>
            <div className="text-gray-600">Use any bank ATM</div>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-yellow-800">2</span>
            </div>
            <div className="font-semibold">Get Festival Pass</div>
            <div className="text-gray-600">Obtain entry qualification</div>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-yellow-800">3</span>
            </div>
            <div className="font-semibold">Attend Draw</div>
            <div className="text-gray-600">Be present for selection</div>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-yellow-800">4</span>
            </div>
            <div className="font-semibold">Win KEKE!</div>
            <div className="text-gray-600">Take home your prize</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📞 Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Phone Numbers:</h4>
            <p className="text-gray-700">📱 08067469060</p>
            <p className="text-gray-700">📱 08030596162</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Online:</h4>
            <p className="text-gray-700">🌐 www.groovydecember.ng</p>
            <p className="text-gray-700">📧 hello@groovydecember.ng</p>
          </div>
        </div>
      </div>
    </div>
  )
}