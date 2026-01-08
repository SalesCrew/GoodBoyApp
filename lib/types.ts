export interface Mitarbeiter {
  id: string;
  vollstaendigerName: string;
  strasse: string;
  plz: string;
  stadt: string;
  geburtsdatum: string; // "DD.MM.YYYY"
  createdAt: number;
}

export interface MitarbeiterFormData {
  vollstaendigerName: string;
  strasse: string;
  plz: string;
  stadt: string;
  geburtsdatum: string;
}
