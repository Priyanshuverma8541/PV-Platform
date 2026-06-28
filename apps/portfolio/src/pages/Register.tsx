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
    <section>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <FormField label="Name">
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
        </FormField>
        <FormField label="Email">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </FormField>
        <FormField label="Password">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </FormField>
        <button type="submit" className="primary-button">
          Register
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </section>
  );
}

export default Register;
