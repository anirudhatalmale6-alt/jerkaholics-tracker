export interface Character {
  id: string;
  name: string;
  voiceActor: string;
  roles: string[];
  description: string;
  type: 'main' | 'recurring' | 'guest';
  firstAppearance: string;
  traits: string[];
  assets: CharacterAsset[];
}

export interface CharacterAsset {
  id: string;
  type: 'reference' | 'model_sheet' | 'expression_sheet' | 'turnaround' | 'color_key' | 'prop';
  name: string;
  version: string;
  status: 'approved' | 'pending' | 'revision';
  uploadDate: string;
  uploadedBy: string;
}

export const CHARACTERS: Character[] = [
  {
    id: 'CHAR-001',
    name: 'Tommy',
    voiceActor: 'Danny Pudi',
    roles: ['Tommy'],
    description: 'The ringleader of the group. A fast-talking, scheming troublemaker with wild ideas and zero impulse control. Wears oversized round glasses and a brown t-shirt. Blonde messy hair.',
    type: 'main',
    firstAppearance: 'JERK-101',
    traits: ['Impulsive', 'Creative', 'Chaotic', 'Fast-talking'],
    assets: [
      { id: 'CA-001', type: 'reference', name: 'Tommy - Main Reference', version: 'v3.2', status: 'approved', uploadDate: '2026-06-10', uploadedBy: 'Art Dept' },
      { id: 'CA-002', type: 'model_sheet', name: 'Tommy - Model Sheet (Full Body)', version: 'v2.1', status: 'approved', uploadDate: '2026-06-08', uploadedBy: 'Art Dept' },
      { id: 'CA-003', type: 'expression_sheet', name: 'Tommy - Expression Sheet', version: 'v1.4', status: 'pending', uploadDate: '2026-06-12', uploadedBy: 'Art Dept' },
      { id: 'CA-004', type: 'turnaround', name: 'Tommy - Turnaround', version: 'v2.0', status: 'approved', uploadDate: '2026-06-05', uploadedBy: 'Art Dept' },
      { id: 'CA-005', type: 'color_key', name: 'Tommy - Color Key', version: 'v1.1', status: 'approved', uploadDate: '2026-06-06', uploadedBy: 'Art Dept' },
    ]
  },
  {
    id: 'CHAR-002',
    name: 'Kevin',
    voiceActor: 'Andy Samberg',
    roles: ['Kevin', 'Jerry', 'Alternate Kevin #2', 'Paper Kevin', 'Older Kevin'],
    description: 'Tommy\'s best friend and reluctant partner in crime. Wears a dark beanie and blue hoodie over a red shirt. Dark spiky hair. Often the voice of reason that nobody listens to.',
    type: 'main',
    firstAppearance: 'JERK-101',
    traits: ['Cautious', 'Loyal', 'Anxious', 'Sarcastic'],
    assets: [
      { id: 'CA-006', type: 'reference', name: 'Kevin - Main Reference', version: 'v3.0', status: 'approved', uploadDate: '2026-06-10', uploadedBy: 'Art Dept' },
      { id: 'CA-007', type: 'model_sheet', name: 'Kevin - Model Sheet (Full Body)', version: 'v2.0', status: 'approved', uploadDate: '2026-06-08', uploadedBy: 'Art Dept' },
      { id: 'CA-008', type: 'expression_sheet', name: 'Kevin - Expression Sheet', version: 'v1.2', status: 'pending', uploadDate: '2026-06-12', uploadedBy: 'Art Dept' },
      { id: 'CA-009', type: 'turnaround', name: 'Kevin - Turnaround', version: 'v2.0', status: 'approved', uploadDate: '2026-06-05', uploadedBy: 'Art Dept' },
    ]
  },
  {
    id: 'CHAR-003',
    name: 'Dante',
    voiceActor: 'Kenan Thompson',
    roles: ['Dante', 'Marvin', 'Lifeguard', 'Alternate Dante #1', 'Panicked Reporter', 'Paper Dante'],
    description: 'The third member of the group. Pale complexion with white/silver hair and distinctive red eyes. Wears a dark jacket over a maroon shirt. Dry wit and deadpan delivery.',
    type: 'main',
    firstAppearance: 'JERK-101',
    traits: ['Deadpan', 'Mysterious', 'Blunt', 'Unpredictable'],
    assets: [
      { id: 'CA-010', type: 'reference', name: 'Dante - Main Reference', version: 'v3.1', status: 'approved', uploadDate: '2026-06-10', uploadedBy: 'Art Dept' },
      { id: 'CA-011', type: 'model_sheet', name: 'Dante - Model Sheet (Full Body)', version: 'v2.0', status: 'approved', uploadDate: '2026-06-08', uploadedBy: 'Art Dept' },
      { id: 'CA-012', type: 'expression_sheet', name: 'Dante - Expression Sheet', version: 'v1.3', status: 'approved', uploadDate: '2026-06-11', uploadedBy: 'Art Dept' },
    ]
  },
  {
    id: 'CHAR-004',
    name: 'Pete',
    voiceActor: 'H. Jon Benjamin',
    roles: ['Pete', 'Narrator', 'Bartender', 'Eddie'],
    description: 'A depressed and melancholic character who tells the story of his life. Central to Episode 103 "The Pete Life of Pete". H. Jon Benjamin also voices the Narrator, Bartender, and Eddie.',
    type: 'recurring',
    firstAppearance: 'JERK-103',
    traits: ['Depressed', 'Introspective', 'Relatable'],
    assets: [
      { id: 'CA-013', type: 'reference', name: 'Pete - Main Reference', version: 'v1.0', status: 'pending', uploadDate: '2026-06-14', uploadedBy: 'Art Dept' },
    ]
  },
  {
    id: 'CHAR-005',
    name: 'Topher',
    voiceActor: 'Jason Schwartzman',
    roles: ['Topher', 'Young Topher'],
    description: 'A recurring character who is a bored accountant. Has multiple storylines across seasons including becoming the King of Bol and switching between modes.',
    type: 'recurring',
    firstAppearance: 'JERK-203',
    traits: ['Bored', 'Adventurous', 'Dual-natured'],
    assets: [
      { id: 'CA-014', type: 'reference', name: 'Topher - Main Reference', version: 'v1.0', status: 'pending', uploadDate: '2026-06-14', uploadedBy: 'Art Dept' },
    ]
  },
  {
    id: 'CHAR-006',
    name: 'Mrs. Harris',
    voiceActor: 'Rhea Perlman',
    roles: ['Mrs. Harris', 'Elderly Lady #1'],
    description: 'An older woman who keeps a watchful eye on the boys. Stern-faced with gray curly hair. Appears notably in Episode 202 chasing the boys.',
    type: 'recurring',
    firstAppearance: 'JERK-101',
    traits: ['Stern', 'Watchful', 'Persistent'],
    assets: [
      { id: 'CA-015', type: 'reference', name: 'Mrs. Harris - Main Reference', version: 'v2.0', status: 'approved', uploadDate: '2026-06-09', uploadedBy: 'Art Dept' },
      { id: 'CA-016', type: 'expression_sheet', name: 'Mrs. Harris - Expression Sheet', version: 'v1.0', status: 'pending', uploadDate: '2026-06-13', uploadedBy: 'Art Dept' },
    ]
  },
  {
    id: 'CHAR-007',
    name: 'Tina',
    voiceActor: 'Wendi McLendon-Covey',
    roles: ['Tina'],
    description: 'Takes the boys on what seems like the ultimate vacation in Episode 306 "Al Dante" - which turns out to be hellish.',
    type: 'recurring',
    firstAppearance: 'JERK-306',
    traits: ['Deceptive', 'Adventurous'],
    assets: []
  },
  {
    id: 'CHAR-008',
    name: 'Mr. Withers',
    voiceActor: 'Jeff Goldblum',
    roles: ['Mr. Withers'],
    description: 'Owner of the teleportation device used in the pilot episode "Departed". An eccentric inventor-type character.',
    type: 'recurring',
    firstAppearance: 'JERK-101',
    traits: ['Eccentric', 'Inventive'],
    assets: [
      { id: 'CA-017', type: 'reference', name: 'Mr. Withers - Main Reference', version: 'v1.0', status: 'revision', uploadDate: '2026-06-12', uploadedBy: 'Art Dept' },
    ]
  },
];

export const ASSET_TYPE_LABELS: Record<string, string> = {
  reference: 'Reference Art',
  model_sheet: 'Model Sheet',
  expression_sheet: 'Expression Sheet',
  turnaround: 'Turnaround',
  color_key: 'Color Key',
  prop: 'Props',
};
