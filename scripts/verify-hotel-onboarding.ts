import { supabase } from '@/lib/supabaseClient'

interface TestResults {
  name: string
  success: boolean
  error?: string
}

async function runTests() {
  const results: TestResults[] = []
  
  try {
    // Test 1: Verify hotel profiles exist
    const { data: hotelProfiles, error: profileError } = await supabase
      .from('hotel_profiles')
      .select('*')
      .in('email', ['owner1@test.com', 'owner2@test.com'])

    results.push({
      name: 'Hotel Profiles Exist',
      success: hotelProfiles?.length === 2 && !profileError,
      error: profileError?.message
    })

    // Test 2: Verify hotels exist with different statuses
    const { data: hotels, error: hotelError } = await supabase
      .from('hotels')
      .select('*')

    const hasAllStatuses = !!(hotels?.some(h => h.status === 'pending') &&
      hotels?.some(h => h.status === 'approved') &&
      hotels?.some(h => h.status === 'rejected')) || false

    results.push({
      name: 'Hotels with Different Statuses',
      success: hasAllStatuses && !hotelError,
      error: hotelError?.message
    })

    // Test 3: Verify admin access controls
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'admin@test.com')
      .single()

    results.push({
      name: 'Admin Exists',
      success: !!admin && !adminError,
      error: adminError?.message
    })

    // Test 4: Verify hotel data completeness
    const validHotel = hotels?.find(h => h.status === 'approved')
    const hasRequiredFields = validHotel &&
      validHotel.name &&
      validHotel.description &&
      validHotel.address &&
      validHotel.city &&
      validHotel.state &&
      validHotel.country &&
      validHotel.phone &&
      validHotel.email &&
      validHotel.check_in_time &&
      validHotel.check_out_time &&
      Array.isArray(validHotel.amenities) &&
      Array.isArray(validHotel.images)

    results.push({
      name: 'Hotel Data Complete',
      success: !!hasRequiredFields,
      error: !hasRequiredFields ? 'Missing required fields' : undefined
    })

    // Log results
    console.log('\nTest Results:')
    results.forEach(result => {
      console.log(`\n${result.success ? '✅' : '❌'} ${result.name}`)
      if (result.error) console.log(`   Error: ${result.error}`)
    })

    const allPassed = results.every(r => r.success)
    console.log(`\n${allPassed ? '🎉' : '⚠️'} ${allPassed ? 'All tests passed!' : 'Some tests failed.'}`)

  } catch (err: any) {
    console.error('Test execution error:', err)
  }
}

runTests()