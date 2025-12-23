// Aquí defines los correos que tienen superpoderes
export const ADMIN_EMAILS = [
  'tu-correo@gmail.com', // Reemplaza esto con tu correo real
  'admin@pasteleria.com'
];

export const isAdmin = (email: string | null | undefined) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};