import RegistrationForm from "./RegistrationForm";

export default function PageantRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Miss Groovy December Registration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your application to join the most prestigious beauty pageant 
            celebrating African excellence and empowerment.
          </p>
        </div>

        {/* Registration Form */}
        <RegistrationForm />
      </div>
    </div>
  );
}