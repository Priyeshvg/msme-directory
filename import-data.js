// Simple Node.js script to import MSME data
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xradhqxopmrtnenivixw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYWRocXhvcG1ydG5lbml2aXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTE5NzAsImV4cCI6MjA3MTA4Nzk3MH0.1XOxMLdCsH8Co7ahLFlMlHIzBB1LjxNm44jrYDhi_ms';

const supabase = createClient(supabaseUrl, supabaseKey);

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50); // Limit length
}

async function importGujaratData() {
  const filePath = '/Users/priyeshgandhi/Downloads/All_state_data/GUJARAT/GUJARAT_part1.csv';
  const enterprises = [];
  let count = 0;
  const maxRecords = 500; // Import first 500 records for testing

  console.log('Starting import...');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (count >= maxRecords) return;

        try {
          const enterprise = {
            enterprise_name: row.EnterpriseName?.trim() || 'Unknown',
            state_name: row.State?.trim() || 'Gujarat',
            district_name: row.District?.trim() || 'Unknown',
            pincode: row.Pincode ? parseInt(row.Pincode) : null,
            registration_date: row.RegistrationDate || null,
            communication_address: row.CommunicationAddress?.trim() || null,
            slug: createSlug(row.EnterpriseName || `enterprise-${count}`)
          };

          enterprises.push(enterprise);
          count++;

          if (count % 100 === 0) {
            console.log(`Processed ${count} records...`);
          }
        } catch (error) {
          console.error('Error processing row:', error);
        }
      })
      .on('end', async () => {
        console.log(`Parsed ${enterprises.length} enterprises. Inserting into database...`);

        try {
          // Insert in batches of 100
          for (let i = 0; i < enterprises.length; i += 100) {
            const batch = enterprises.slice(i, i + 100);
            
            const { data, error } = await supabase
              .from('enterprises')
              .insert(batch)
              .select();

            if (error) {
              console.error('Error inserting batch:', error);
              continue;
            }

            console.log(`Inserted batch ${Math.floor(i/100) + 1}, ${data.length} records`);
          }

          console.log('✅ Import completed successfully!');
          resolve();
        } catch (error) {
          console.error('❌ Import failed:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ File reading error:', error);
        reject(error);
      });
  });
}

// Run the import
importGujaratData().then(() => {
  console.log('🎉 Data import finished!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Import failed:', error);
  process.exit(1);
});