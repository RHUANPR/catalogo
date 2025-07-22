
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Theme } from '../../types';

export const ThemeEditor: React.FC = () => {
  const { theme, setTheme } = useAppContext();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheme(prevTheme => ({
      ...prevTheme,
      [name]: value,
    }));
  };

  const colorFields: { key: keyof Theme; label: string }[] = [
    { key: 'primary', label: 'Cor Primária (Botões, Títulos)' },
    { key: 'secondary', label: 'Cor Secundária (Textos)' },
    { key: 'accent', label: 'Cor de Destaque (Adicionar ao Carrinho)' },
    { key: 'base100', label: 'Fundo Principal (Claro)' },
    { key: 'base200', label: 'Fundo Secundário (Sutil)' },
    { key: 'base300', label: 'Cor de Bordas' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-secondary mb-6">Personalizar Aparência</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {colorFields.map(({ key, label }) => (
            <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-base-200 rounded-lg">
              <label htmlFor={key} className="font-medium text-secondary">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id={key}
                  name={key}
                  value={theme[key]}
                  onChange={handleColorChange}
                  className="w-10 h-10 p-0 border-none rounded-md cursor-pointer"
                />
                <input
                    type="text"
                    name={key}
                    value={theme[key]}
                    onChange={handleColorChange}
                    className="w-24 px-2 py-1 border border-base-300 rounded-md font-mono text-sm text-slate-500 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
