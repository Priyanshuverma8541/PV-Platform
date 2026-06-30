// import { FormEvent, useState } from 'react';
// import { register } from '../services/auth';
// import FormField from '../components/FormField';

// function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     try {
//       const data = await register({ name, email, password });
//       setMessage(`Welcome ${data.user.name}`);
//     } catch (error) {
//       setMessage(error instanceof Error ? error.message : 'Registration failed.');
//     }
//   };

//   return (
//     <section>
//       <h1>Create account</h1>
//       <form onSubmit={handleSubmit} className="form-grid">
//         <FormField label="Name">
//           <input
//             type="text"
//             name="name"
//             autoComplete="name"
//             value={name}
//             onChange={(event) => setName(event.target.value)}
//             required
//           />
//         </FormField>
//         <FormField label="Email">
//           <input
//             type="email"
//             name="email"
//             autoComplete="email"
//             value={email}
//             onChange={(event) => setEmail(event.target.value)}
//             required
//           />
//         </FormField>
//         <FormField label="Password">
//           <input
//             type="password"
//             name="new-password"
//             autoComplete="new-password"
//             value={password}
//             onChange={(event) => setPassword(event.target.value)}
//             required
//           />
//         </FormField>
//         <button type="submit" className="primary-button">
//           Register
//         </button>
//       </form>
//       {message && <p className="message">{message}</p>}
//     </section>
//   );
// }

// export default Register;


import { FormEvent, useState } from "react";
import { register } from "../services/auth";
import FormField from "../components/FormField";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const data = await register({
        name,
        email,
        password,
      });

      setMessage(`Welcome ${data.user.name}`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Registration failed."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-6">

      {/* Glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md">

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-10">

          <div className="text-center mb-10">

            <h1 className="text-4xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-slate-400 mt-3">
              Join the PV Platform ecosystem.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Name
              </label>

              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="Priyanshu Verma"
                required
              />

            </div>

            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Email
              </label>

              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="you@example.com"
                required
              />

            </div>

            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Password
              </label>

              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="••••••••"
                required
              />

            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 text-white font-semibold"
            >
              Create Account
            </button>

          </form>

          {message && (
            <div className="mt-6 text-center text-cyan-300">
              {message}
            </div>
          )}

          <div className="mt-8 text-center">

            <p className="text-slate-400 text-sm">
              Already have an account?
            </p>

            <button className="mt-2 text-cyan-400 hover:text-cyan-300 transition">
              Sign In
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;