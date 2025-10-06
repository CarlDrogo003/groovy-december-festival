"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FormData {
  // Personal Information
  full_name: string;
  stage_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  current_address: string;
  social_media_handles: string;
  
  // Emergency Contact
  emergency_contact_name: string;
  emergency_contact_phone: string;
  
  // Physical Attributes
  height: string;
  bust_chest: string;
  waist: string;
  hips: string;
  dress_size: string;
  
  // Background
  languages: string;
  biography: string;
  why: string;
  platform: string;
  achievements: string;
  hobbies_skills: string;
  medical_conditions: string;
  
  // Files
  headshot_file: File | null;
  full_body_file: File | null;
  proof_of_payment_file: File | null;
  
  // Agreement
  declaration_agreed: boolean;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    stage_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    place_of_birth: '',
    nationality: '',
    current_address: '',
    social_media_handles: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    height: '',
    bust_chest: '',
    waist: '',
    hips: '',
    dress_size: '',
    languages: '',
    biography: '',
    why: '',
    platform: '',
    achievements: '',
    hobbies_skills: '',
    medical_conditions: '',
    headshot_file: null,
    full_body_file: null,
    proof_of_payment_file: null,
    declaration_agreed: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
        if (!formData.current_address.trim()) newErrors.current_address = 'Current address is required';
        
        // Age validation
        if (formData.date_of_birth) {
          const age = new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear();
          if (age < 18 || age > 27) {
            newErrors.date_of_birth = 'You must be between 18-27 years old to participate';
          }
        }
        break;

      case 2: // Emergency Contact & Physical
        if (!formData.emergency_contact_name.trim()) newErrors.emergency_contact_name = 'Emergency contact name is required';
        if (!formData.emergency_contact_phone.trim()) newErrors.emergency_contact_phone = 'Emergency contact phone is required';
        if (!formData.height.trim()) newErrors.height = 'Height is required';
        break;

      case 3: // Background & Platform
        if (!formData.biography.trim()) newErrors.biography = 'Biography is required';
        if (!formData.why.trim()) newErrors.why = 'Please explain why you want to participate';
        if (!formData.platform.trim()) newErrors.platform = 'Platform/cause is required';
        break;

      case 4: // File Uploads
        if (!formData.headshot_file) newErrors.headshot_file = 'Professional headshot is required';
        if (!formData.full_body_file) newErrors.full_body_file = 'Full body photo is required';
        if (!formData.proof_of_payment_file) newErrors.proof_of_payment_file = 'Proof of payment is required';
        break;

      case 5: // Final Agreement
        if (!formData.declaration_agreed) newErrors.declaration_agreed = 'You must agree to the terms and conditions';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: 'headshot_file' | 'full_body_file' | 'proof_of_payment_file', file: File | null) => {
    if (file) {
      // Validate file type
      const validTypes = field === 'proof_of_payment_file' 
        ? ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
        : ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          [field]: field === 'proof_of_payment_file' 
            ? 'Please select a valid image or PDF file' 
            : 'Please select a valid image file (JPEG, PNG, or WebP)'
        }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [field]: 'File must be smaller than 5MB' }));
        return;
      }
    }

    handleInputChange(field, file);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitApplication = async () => {
    if (!validateStep(5)) return;

    setLoading(true);

    try {
      // Upload files
      const uploadFile = async (file: File, folder: string, label: string) => {
        const filePath = `contestants/${formData.email}/${folder}/${label}_${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from("pageant-files")
          .upload(filePath, file);

        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from("pageant-files")
          .getPublicUrl(data.path);

        return publicUrl.publicUrl;
      };

      const headshotUrl = formData.headshot_file 
        ? await uploadFile(formData.headshot_file, 'headshots', 'headshot')
        : null;

      const fullBodyUrl = formData.full_body_file 
        ? await uploadFile(formData.full_body_file, 'fullbody', 'fullbody')
        : null;

      const proofUrl = formData.proof_of_payment_file 
        ? await uploadFile(formData.proof_of_payment_file, 'payments', 'proof')
        : null;

      // Submit to database
      const { error } = await supabase.from("pageant_contestants").insert([{
        full_name: formData.full_name,
        stage_name: formData.stage_name || null,
        email: formData.email,
        phone: formData.phone || null,
        date_of_birth: formData.date_of_birth || null,
        place_of_birth: formData.place_of_birth || null,
        nationality: formData.nationality || null,
        current_address: formData.current_address || null,
        social_media_handles: formData.social_media_handles || null,
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
        height: formData.height || null,
        bust_chest: formData.bust_chest || null,
        waist: formData.waist || null,
        hips: formData.hips || null,
        dress_size: formData.dress_size || null,
        languages: formData.languages || null,
        biography: formData.biography || null,
        why: formData.why || null,
        platform: formData.platform || null,
        achievements: formData.achievements || null,
        hobbies_skills: formData.hobbies_skills || null,
        medical_conditions: formData.medical_conditions || null,
        headshot_url: headshotUrl,
        full_body_url: fullBodyUrl,
        proof_of_payment_url: proofUrl,
        declaration_agreed: formData.declaration_agreed,
        status: 'pending',
        payment_status: 'pending',
        payment_amount: 50.00,
      }]);

      if (error) throw error;

      // Success
      alert("🎉 Registration submitted successfully! You will receive a confirmation email shortly.");
      
      // Reset form
      setFormData({
        full_name: '', stage_name: '', email: '', phone: '', date_of_birth: '',
        place_of_birth: '', nationality: '', current_address: '', social_media_handles: '',
        emergency_contact_name: '', emergency_contact_phone: '', height: '', bust_chest: '',
        waist: '', hips: '', dress_size: '', languages: '', biography: '', why: '',
        platform: '', achievements: '', hobbies_skills: '', medical_conditions: '',
        headshot_file: null, full_body_file: null, proof_of_payment_file: null,
        declaration_agreed: false,
      });
      setCurrentStep(1);

    } catch (err: any) {
      console.error("Submission error:", err);
      alert("❌ Error submitting registration: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Your full legal name"
                  error={errors.full_name}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage Name (Optional)
                </label>
                <Input
                  value={formData.stage_name}
                  onChange={(e) => handleInputChange('stage_name', e.target.value)}
                  placeholder="Preferred stage name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  error={errors.email}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  error={errors.phone}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth * (Ages 18-27 eligible)
                </label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  error={errors.date_of_birth}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place of Birth
                </label>
                <Input
                  value={formData.place_of_birth}
                  onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality *
              </label>
              <Input
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="Your nationality"
                error={errors.nationality}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Address *
              </label>
              <textarea
                value={formData.current_address}
                onChange={(e) => handleInputChange('current_address', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.current_address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your current residential address"
              />
              {errors.current_address && <p className="text-sm text-red-600 mt-1">{errors.current_address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Social Media Handles
              </label>
              <Input
                value={formData.social_media_handles}
                onChange={(e) => handleInputChange('social_media_handles', e.target.value)}
                placeholder="@instagram @twitter @facebook"
              />
              <p className="text-xs text-gray-500 mt-1">Include your main social media handles</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Emergency Contact & Physical Information</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Emergency Contact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
                  </label>
                  <Input
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                    placeholder="Emergency contact full name"
                    error={errors.emergency_contact_name}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone *
                  </label>
                  <Input
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    error={errors.emergency_contact_phone}
                  />
                </div>
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-900 mb-2">Physical Attributes</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height * (e.g., 5'6")
                  </label>
                  <Input
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="5'6\" or 168cm"
                    error={errors.height}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bust/Chest
                  </label>
                  <Input
                    value={formData.bust_chest}
                    onChange={(e) => handleInputChange('bust_chest', e.target.value)}
                    placeholder="e.g. 34\""
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waist
                  </label>
                  <Input
                    value={formData.waist}
                    onChange={(e) => handleInputChange('waist', e.target.value)}
                    placeholder="e.g. 26\""
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hips
                  </label>
                  <Input
                    value={formData.hips}
                    onChange={(e) => handleInputChange('hips', e.target.value)}
                    placeholder="e.g. 36\""
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dress Size
                  </label>
                  <Input
                    value={formData.dress_size}
                    onChange={(e) => handleInputChange('dress_size', e.target.value)}
                    placeholder="e.g. Size 8"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages Spoken
              </label>
              <Input
                value={formData.languages}
                onChange={(e) => handleInputChange('languages', e.target.value)}
                placeholder="English, French, Spanish, etc."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Background & Platform</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biography * (Tell us about yourself)
              </label>
              <textarea
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.biography ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Share your background, education, career, and what makes you unique..."
              />
              {errors.biography && <p className="text-sm text-red-600 mt-1">{errors.biography}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why do you want to participate? *
              </label>
              <textarea
                value={formData.why}
                onChange={(e) => handleInputChange('why', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.why ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="What motivates you to compete in Miss Groovy December?"
              />
              {errors.why && <p className="text-sm text-red-600 mt-1">{errors.why}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform/Cause * (What cause would you champion as Miss Groovy December?)
              </label>
              <textarea
                value={formData.platform}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.platform ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the cause or platform you would promote..."
              />
              {errors.platform && <p className="text-sm text-red-600 mt-1">{errors.platform}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achievements & Awards
              </label>
              <textarea
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List any relevant achievements, awards, or recognitions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hobbies & Special Skills
              </label>
              <textarea
                value={formData.hobbies_skills}
                onChange={(e) => handleInputChange('hobbies_skills', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dancing, singing, sports, instruments, arts, etc..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Conditions (if any)
              </label>
              <textarea
                value={formData.medical_conditions}
                onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any medical conditions we should be aware of? (Optional)"
              />
              <p className="text-xs text-gray-500 mt-1">This information is confidential and used for safety purposes only</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Photo & Document Upload</h2>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Photo Requirements</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>High resolution (minimum 1080px width)</li>
                      <li>Professional quality and well-lit</li>
                      <li>Maximum file size: 5MB each</li>
                      <li>Formats: JPEG, PNG, or WebP</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Headshot *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('headshot_file', e.target.files?.[0] || null)}
                    className="w-full"
                  />
                  {formData.headshot_file && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.headshot_file.name}
                    </p>
                  )}
                  {errors.headshot_file && <p className="text-sm text-red-600 mt-1">{errors.headshot_file}</p>}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Professional headshot showing face and shoulders
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Body Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('full_body_file', e.target.files?.[0] || null)}
                    className="w-full"
                  />
                  {formData.full_body_file && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.full_body_file.name}
                    </p>
                  )}
                  {errors.full_body_file && <p className="text-sm text-red-600 mt-1">{errors.full_body_file}</p>}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Full body photo in elegant attire
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proof of Payment * ($50 Registration Fee)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange('proof_of_payment_file', e.target.files?.[0] || null)}
                  className="w-full"
                />
                {formData.proof_of_payment_file && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.proof_of_payment_file.name}
                  </p>
                )}
                {errors.proof_of_payment_file && <p className="text-sm text-red-600 mt-1">{errors.proof_of_payment_file}</p>}
              </div>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Payment Instructions:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Send $50 via PayPal to: payments@groovydecember.com</li>
                  <li>• Or Venmo: @GroovyDecember</li>
                  <li>• Include your full name in the payment note</li>
                  <li>• Upload screenshot or receipt as proof</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Terms & Agreement</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 max-h-64 overflow-y-auto">
              <h3 className="font-semibold">Miss Groovy December Terms and Conditions</h3>
              
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Eligibility Requirements:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Must be between 18-27 years of age</li>
                  <li>Must be single and never married</li>
                  <li>Must not have children</li>
                  <li>Must be of African heritage or descent</li>
                  <li>Must be available for the full reign period</li>
                </ul>

                <p><strong>Competition Commitment:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Participate in all required events and appearances</li>
                  <li>Maintain professional conduct at all times</li>
                  <li>Follow all pageant rules and guidelines</li>
                  <li>Be available for winner's responsibilities if crowned</li>
                </ul>

                <p><strong>Photo and Media Release:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Grant permission for use of photos and videos for promotional purposes</li>
                  <li>Understand that participation may be broadcast or streamed</li>
                  <li>Accept that all media becomes property of Miss Groovy December</li>
                </ul>

                <p><strong>Code of Conduct:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Maintain high moral standards and positive public image</li>
                  <li>No inappropriate behavior or controversial activities</li>
                  <li>Represent the pageant with dignity and grace</li>
                  <li>Follow all social media guidelines</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex">
                <input
                  id="declaration"
                  type="checkbox"
                  checked={formData.declaration_agreed}
                  onChange={(e) => handleInputChange('declaration_agreed', e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="declaration" className="ml-3 text-sm">
                  <span className="font-medium text-gray-900">
                    I declare that all information provided is true and accurate. *
                  </span>
                  <span className="block text-gray-700 mt-1">
                    I understand and agree to all terms and conditions listed above. I consent to background verification and understand that any false information may result in disqualification.
                  </span>
                </label>
              </div>
              {errors.declaration_agreed && <p className="text-sm text-red-600 mt-2 ml-7">{errors.declaration_agreed}</p>}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ You'll receive a confirmation email within 24 hours</li>
                <li>✓ Our team will review your application</li>
                <li>✓ Selected candidates will be contacted for interviews</li>
                <li>✓ Final contestants will be announced by December 1st</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            Previous
          </Button>

          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} disabled={loading}>
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={submitApplication} 
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}