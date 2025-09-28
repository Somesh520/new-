const { z } = require('zod');
const { UserRole } = require('../constants/roles');

exports.registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  role: z.enum([
    UserRole.Management,
    UserRole.ServiceHead,
    UserRole.Sales,
    UserRole.CommercialTeam,
    UserRole.Engineer,
    UserRole.Made,
  ]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
