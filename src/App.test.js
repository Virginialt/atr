import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders the login form correctly', () => {
  render(<App />);

  // Verificar que los campos de correo y contraseña se renderizan
  expect(screen.getByLabelText(/gmail/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('shows error for invalid email', () => {
  render(<App />);

  // Simular la entrada de un email inválido
  fireEvent.change(screen.getByLabelText(/gmail/i), { target: { value: 'correo-invalido' } });
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

  // Verificar que se muestra el mensaje de error
  expect(screen.getByText(/por favor, ingrese un correo electrónico válido/i)).toBeInTheDocument();
});

test('logs in with valid email', async () => {
  render(<App />);

  // Simular la entrada de un correo válido y contraseña
  fireEvent.change(screen.getByLabelText(/gmail/i), { target: { value: 'usuario@gmail.com' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });

  // Envolver el evento de submit dentro de `act`
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  });

  // Verificar que aparece el mensaje de bienvenida
  expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
});
