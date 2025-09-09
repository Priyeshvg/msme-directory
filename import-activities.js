// Script to import activities for existing enterprises
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xradhqxopmrtnenivixw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYWRocXhvcG1ydG5lbml2aXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTE5NzAsImV4cCI6MjA3MTA4Nzk3MH0.1XOxMLdCsH8Co7ahLFlMlHIzBB1LjxNm44jrYDhi_ms';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importActivitiesData() {
  const filePath = '/Users/priyeshgandhi/Downloads/All_state_data/GUJARAT/GUJARAT_part1.csv';
  let count = 0;
  const maxRecords = 100; // Import activities for first 100 records

  console.log('Starting activities import...');

  // Get existing enterprises first
  const { data: existingEnterprises, error: fetchError } = await supabase
    .from('enterprises')
    .select('id, enterprise_name, pincode, state_name')
    .limit(maxRecords);

  if (fetchError) {
    console.error('Error fetching enterprises:', fetchError);
    return;
  }

  console.log(`Found ${existingEnterprises.length} existing enterprises`);

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        if (count >= maxRecords) return;

        try {
          // Find matching enterprise
          const matchingEnterprise = existingEnterprises.find(ent => 
            ent.enterprise_name === row.EnterpriseName?.trim() &&
            ent.pincode === parseInt(row.Pincode) &&
            ent.state_name === row.State?.trim()
          );

          if (matchingEnterprise && row.Activities) {
            // Parse activities JSON
            const activitiesData = JSON.parse(row.Activities);
            
            // Prepare activities for insertion
            const activities = activitiesData.map(activity => ({
              enterprise_id: matchingEnterprise.id,
              nic_5digit_id: activity.NIC5DigitId,
              description: activity.Description
            }));

            // Insert activities
            const { error: insertError } = await supabase
              .from('enterprise_activities')
              .insert(activities);

            if (insertError) {
              console.error(`Error inserting activities for ${row.EnterpriseName}:`, insertError);
            } else {
              console.log(`✅ Added ${activities.length} activities for ${row.EnterpriseName}`);
            }
          }

          count++;
        } catch (error) {
          console.error('Error processing row:', error);
        }
      })
      .on('end', () => {
        console.log('✅ Activities import completed!');
        resolve();
      })
      .on('error', (error) => {
        console.error('❌ File reading error:', error);
        reject(error);
      });
  });
}

// Run the import
importActivitiesData().then(() => {
  console.log('🎉 Activities import finished!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Activities import failed:', error);
  process.exit(1);
});