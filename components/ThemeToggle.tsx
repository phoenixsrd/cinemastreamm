import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme} style={{ margin: '10px', padding: '10px' }}>
      Mudar Para {theme === 'light' ? 'Escuro' : 'Claro'}
    </button>
  );
};

export default ThemeToggle;
