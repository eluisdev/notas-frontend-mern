import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfileLayout from '@/layouts/ProfileLayout';
import { describe, expect, test } from 'vitest';
import { beforeEach } from 'node:test';

// Componente de prueba simulado para el Outlet

// Función para renderizar con rutas anidadas
const renderWithRouter = (initialRoute: string) => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
                <Route path="/profile" element={<ProfileLayout />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('ProfileLayout', () => {

    beforeEach(() => {
        cleanup()
    })

    test('should render', () => {
        renderWithRouter('/profile');
        expect(screen.getAllByText('Cambiar Password')).toHaveLength(2);
    });
});