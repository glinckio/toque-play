export interface StageInput {
  date: string;
  startTime: string;
  maxTeams: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  facilities: string[];
}

export interface CategoryInput {
  type: string;
  modality: string;
  format: string;
  registrationPrice: string;
  registrationDeadline: string;
  bestOfSets: string;
  semifinalBestOfSets: string;
  finalBestOfSets: string;
}

export const FACILITY_OPTIONS = [
  'Estacionamento',
  'Cantina',
  'Churrasqueira',
  'Vestiário',
  'Banheiros',
];

export const MODALITY_FORMATS: Record<string, string[]> = {
  BEACH: ['PAIR', 'QUARTET'],
  COURT: ['SEXTET'],
};

export const FORMAT_LABELS: Record<string, string> = {
  PAIR: 'Dupla',
  QUARTET: 'Quarteto',
  SEXTET: 'Sexteto',
};

export const TYPE_OPTIONS = [
  { key: 'MALE', label: 'Masculino' },
  { key: 'FEMALE', label: 'Feminino' },
  { key: 'MIX', label: 'Misto' },
];

export const MODALITY_OPTIONS = [
  { key: 'BEACH', label: 'Areia' },
  { key: 'COURT', label: 'Quadra' },
];

export const STEP_LABELS = ['Básico', 'Estrutura', 'Categorias', 'Revisão'];

export const DEFAULT_STAGE: StageInput = {
  date: '',
  startTime: '',
  maxTeams: '',
  cep: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  facilities: [],
};

export const DEFAULT_CATEGORY: CategoryInput = {
  type: 'MALE',
  modality: 'BEACH',
  format: 'PAIR',
  registrationPrice: '',
  registrationDeadline: '',
  bestOfSets: '3',
  semifinalBestOfSets: '',
  finalBestOfSets: '',
};
