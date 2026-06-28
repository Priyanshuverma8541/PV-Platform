import { FormEvent, useState } from 'react';
import { login } from '../services/auth';
import { useAuthContext } from '../hooks/useAuthContext';
import FormField from '../components/FormField';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signIn } = useAuthContext();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await login({ email, password });
      signIn(data);
      setMessage(`Welcome ${data.user.name}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed.');
    }
  };

  return (
    <section>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <FormField label="Email">
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Password">
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </FormField>
        <button type="submit" className="primary-button">
          Login
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </section>
  );
}

export default Login;
