// Sample data
const contacts = [
  { name: 'Alex Rivera', phone: '(555) 010-1001', label: 'Work' },
  { name: 'Sam Chen', phone: '(555) 010-1002', label: 'Personal' },
  { name: 'Jordan Patel', phone: '(555) 010-1003', label: 'Family' },
  { name: 'Taylor Brooks', phone: '(555) 010-1004', label: 'Work' },
  { name: 'Morgan Diaz', phone: '(555) 010-1005', label: 'Personal' },
  { name: 'Casey Nguyen', phone: '(555) 010-1006', label: 'Family' },
  { name: 'Riley Foster', phone: '(555) 010-1007', label: 'Work' },
  { name: 'Jamie Okafor', phone: '(555) 010-1008', label: 'Personal' },
  { name: 'Drew Santos', phone: '(555) 010-1009', label: 'Family' },
  { name: 'Avery Kim', phone: '(555) 010-1010', label: 'Work' },
  { name: 'Quinn Murphy', phone: '(555) 010-1011', label: 'Personal' },
  { name: 'Harper Lee', phone: '(555) 010-1012', label: 'Family' },
  { name: 'Rowan Silva', phone: '(555) 010-1013', label: 'Work' },
  { name: 'Skyler Evans', phone: '(555) 010-1014', label: 'Personal' },
  { name: 'Parker Hall', phone: '(555) 010-1015', label: 'Family' },
  { name: 'Reese Ahmed', phone: '(555) 010-1016', label: 'Work' },
  { name: 'Emerson Cole', phone: '(555) 010-1017', label: 'Personal' },
  { name: 'Finley Ward', phone: '(555) 010-1018', label: 'Family' },
  { name: 'Dakota Reed', phone: '(555) 010-1019', label: 'Work' },
  { name: 'Sage Bennett', phone: '(555) 010-1020', label: 'Personal' },
  { name: 'Blake Turner', phone: '(555) 010-1021', label: 'Family' },
  { name: 'Cameron Ortiz', phone: '(555) 010-1022', label: 'Work' },
  { name: 'Devon Price', phone: '(555) 010-1023', label: 'Personal' },
  { name: 'Elliot Grant', phone: '(555) 010-1024', label: 'Family' },
  { name: 'Kendall Ross', phone: '(555) 010-1025', label: 'Work' },
  { name: 'Logan Perry', phone: '(555) 010-1026', label: 'Personal' },
  { name: 'Micah Powell', phone: '(555) 010-1027', label: 'Family' },
  { name: 'Noel Hayes', phone: '(555) 010-1028', label: 'Work' },
  { name: 'Oakley Bryant', phone: '(555) 010-1029', label: 'Personal' },
  { name: 'Peyton Cruz', phone: '(555) 010-1030', label: 'Family' },
  { name: 'Remy Fisher', phone: '(555) 010-1031', label: 'Work' },
  { name: 'Sasha Long', phone: '(555) 010-1032', label: 'Personal' },
  { name: 'Tatum Hughes', phone: '(555) 010-1033', label: 'Family' },
  { name: 'Uma Castillo', phone: '(555) 010-1034', label: 'Work' },
  { name: 'Vale Romero', phone: '(555) 010-1035', label: 'Personal' },
  { name: 'Wren Alvarez', phone: '(555) 010-1036', label: 'Family' },
  { name: 'Xavi Moreno', phone: '(555) 010-1037', label: 'Work' },
  { name: 'Yael Cohen', phone: '(555) 010-1038', label: 'Personal' },
  { name: 'Zion Barker', phone: '(555) 010-1039', label: 'Family' },
  { name: 'Ari Soto', phone: '(555) 010-1040', label: 'Work' }
];

// Fetches contacts from a server
function loadContacts() {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(contacts); }, 1200);
  });
}
