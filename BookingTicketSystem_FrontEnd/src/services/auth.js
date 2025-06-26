export const fakeUsers = [
  {
    email: "user@gmail.com",
    password: "123456",
    name: "User Demo",
    role: "user",
  },
  {
    email: "admin@gmail.com",
    password: "123456",
    name: "Admin Demo",
    role: "admin",
  },
];

export function loginService({ email, password }) {
  const user = fakeUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    // Không trả về password
    const { password, ...userInfo } = user;
    return userInfo;
  }
  return null;
} 