import { FormEvent, useState } from 'react';
import { register } from '../services/auth';
import FormField from '../components/FormField';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const data = await register({ name, email, password });
      setMessage(`Welcome ${data.user.name}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed.');
    }
  };

  return (
    <section className="auth-panel">
      <p className="auth-kicker">Join the ecosystem</p>
      <h1>Create account</h1>
      <p className="auth-copy">Create your PV Platform account to enter the collaboration and vision zone.</p>

      <form onSubmit={handleSubmit} className="form-grid">
        <FormField label="Name">
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Priyanshu Verma"
            required
          />
        </FormField>

        <FormField label="Email">
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </FormField>

        <FormField label="Password">
          <input
            type="password"
            name="new-password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            required
          />
        </FormField>

        <button type="submit" className="primary-button">Create Account</button>
      </form>

      {message && <p className="message">{message}</p>}
    </section>
  );
}

export default Register;
