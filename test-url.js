// Test URL generation
const enterprise = {
  enterprise_name: "Shree Kastbhanjan Motors",
  state_name: "GUJARAT",
  pincode: 382445
};

const createSlug = (enterprise) => {
  const stateName = enterprise.state_name.toLowerCase().replace(/\s+/g, '-')
  const companySlug = enterprise.enterprise_name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
  const pincode = enterprise.pincode || '000000'
  
  return `/${stateName}/${companySlug}-${pincode}`
}

console.log('Generated URL:', createSlug(enterprise));
console.log('State part:', enterprise.state_name.toLowerCase().replace(/\s+/g, '-'));
console.log('Company part:', enterprise.enterprise_name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'));
console.log('Pincode part:', enterprise.pincode);