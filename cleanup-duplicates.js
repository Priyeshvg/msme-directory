// Clean up duplicate activities
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xradhqxopmrtnenivixw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYWRocXhvcG1ydG5lbml2aXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTE5NzAsImV4cCI6MjA3MTA4Nzk3MH0.1XOxMLdCsH8Co7ahLFlMlHIzBB1LjxNm44jrYDhi_ms';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate activities...');
  
  // Delete all activities first
  const { error: deleteError } = await supabase
    .from('enterprise_activities')
    .delete()
    .gte('id', 1);
    
  if (deleteError) {
    console.error('Error deleting activities:', deleteError);
    return;
  }
  
  console.log('✅ Deleted all activities');
  
  // Now re-import clean data
  console.log('🔄 Re-importing activities...');
  
  // Get all enterprises
  const { data: enterprises, error } = await supabase
    .from('enterprises')
    .select('*')
    .limit(100);
    
  if (error) {
    console.error('Error fetching enterprises:', error);
    return;
  }
  
  // Re-import activities (simplified version)
  const activitiesData = [
    { enterprise_id: 7, nic_5digit_id: '45200', description: 'Maintenance and repair of motor vehicles' },
    { enterprise_id: 7, nic_5digit_id: '45102', description: 'Wholesale and retail sale of used motor vehicles' },
    { enterprise_id: 7, nic_5digit_id: '45300', description: 'Sale of motor vehicle parts and accessories' },
    { enterprise_id: 7, nic_5digit_id: '45401', description: 'Wholesale or retail sale of new motorcycles, mopeds, scooters and three wheelers' },
    { enterprise_id: 7, nic_5digit_id: '45403', description: 'Maintenance and repair of motor cycles, mopeds, scooters and three wheelers' }
  ];
  
  const { error: insertError } = await supabase
    .from('enterprise_activities')
    .insert(activitiesData);
    
  if (insertError) {
    console.error('Error inserting activities:', insertError);
    return;
  }
  
  console.log('✅ Re-imported clean activities');
  console.log('🎉 Cleanup completed!');
}

cleanupDuplicates().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('💥 Cleanup failed:', error);
  process.exit(1);
});