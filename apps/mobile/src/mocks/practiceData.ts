import type { DocumentType } from '../constants/documents';

type MockDocument = {
    id: string;
    type: DocumentType;
    status: 'active' | 'expired' | 'expiring_soon' | null;
    expiration_date: string | null;
    file_url: string | null;
};

export const mockFarmer = {
    id: 'mock-farmer-123',
    name: 'José (Modo Prática)',
    phone: '(93) 99999-9999',
    municipality: 'Jutaí',
    consentimento_lgpd: 1,
    onboarding_concluido: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

export const mockDocuments: MockDocument[] = [
    { id: 'doc-1', type: 'CAF',   status: 'active',        expiration_date: '2027-05-06', file_url: null },
    { id: 'doc-2', type: 'CAR',   status: 'expired',       expiration_date: '2025-05-06', file_url: null },
    { id: 'doc-3', type: 'CCIR',  status: 'expiring_soon', expiration_date: '2026-05-20', file_url: null },
    { id: 'doc-4', type: 'ITR',   status: null,            expiration_date: null,         file_url: null },
    { id: 'doc-5', type: 'NFA-e', status: 'active',        expiration_date: '2026-11-06', file_url: null },
];
