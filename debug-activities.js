// Debug script to check activities data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xradhqxopmrtnenivixw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYWRocXhvcG1ydG5lbml2aXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTE5NzAsImV4cCI6MjA3MTA4Nzk3MH0.1XOxMLdCsH8Co7ahLFlMlHIzBB1LjxNm44jrYDhi_ms';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugActivities() {
  console.log('🔍 Checking activities data...');

  // Check if activities table has data
  const { data: activities, error: activitiesError } = await supabase
    .from('enterprise_activities')
    .select('*')
    .limit(5);

  if (activitiesError) {
    console.error('❌ Error fetching activities:', activitiesError);
  } else {
    console.log(`✅ Found ${activities.length} activities:`);
    activities.forEach(activity => {
      console.log(`  - Enterprise ${activity.enterprise_id}: ${activity.description}`);
    });
  }

  // Check enterprises with activities relationship
  const { data: enterprisesWithActivities, error: relationError } = await supabase
    .from('enterprises')
    .select(`
      id,
      enterprise_name,
      enterprise_activities (
        id,
        nic_5digit_id,
        description
      )
    `)
    .limit(3);

  if (relationError) {
    console.error('❌ Error fetching enterprises with activities:', relationError);
  } else {
    console.log(`\n✅ Enterprises with activities relationship:`);
    enterprisesWithActivities.forEach(enterprise => {
      console.log(`📌 ${enterprise.enterprise_name}:`);
      if (enterprise.enterprise_activities && enterprise.enterprise_activities.length > 0) {
        enterprise.enterprise_activities.forEach(activity => {
          console.log(`   - ${activity.nic_5digit_id}: ${activity.description}`);
        });
      } else {
        console.log(`   - No activities found`);
      }
    });
  }

  // Test specific enterprise
  console.log('\n🔍 Testing specific enterprise with state/slug format...');
  const { data: testEnterprise, error: testError } = await supabase
    .from('enterprises')
    .select(`
      *,
      enterprise_activities (
        id,
        nic_5digit_id,
        description
      )
    `)
    .eq('enterprise_name', 'Shree Kastbhanjan Motors')
    .single();

  if (testError) {
    console.error('❌ Error testing enterprise:', testError);
  } else {
    console.log(`✅ Test enterprise: ${testEnterprise.enterprise_name}`);
    if (testEnterprise.enterprise_activities && testEnterprise.enterprise_activities.length > 0) {
      console.log(`   Activities count: ${testEnterprise.enterprise_activities.length}`);
      testEnterprise.enterprise_activities.forEach(activity => {
        console.log(`   - ${activity.nic_5digit_id}: ${activity.description}`);
      });
    } else {
      console.log('   - No activities found for this enterprise');
    }
  }
}

debugActivities().then(() => {
  console.log('\n🎉 Debug completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Debug failed:', error);
  process.exit(1);
});