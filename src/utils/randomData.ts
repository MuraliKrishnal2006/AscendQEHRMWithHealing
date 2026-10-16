export function generateRandomEmployeeId(): string {
  const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
  return `EMP${randomNumber}`;
}

export function generateRandomFirstName(): string {
  const names = [
    'Ravi',
    'Kiran',
    'Arjun',
    'Suresh',
    'Mahesh',
    'Vijay',
    'Rahul',
    'Anil',
    'Naresh',
    'Tarun'
  ];

  return names[Math.floor(Math.random() * names.length)];
}

export function generateRandomLastName(): string {
  const names = [
    'Kumar',
    'Reddy',
    'Sharma',
    'Rao',
    'Krishna',
    'Verma',
    'Singh',
    'Patel',
    'Naidu',
    'Gowda'
  ];

  return names[Math.floor(Math.random() * names.length)];
}

export function generateRandomUsername(
  firstName: string,
  lastName: string
): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber}`;
}

export function generateRandomPassword(): string {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `Test@${randomNumber}Aa`;
}