// API response types based on the Dog API swagger documentation

export interface BreedAttributes {
  name: string;
  description: string;
  life: {
    min: number;
    max: number;
  };
  male_weight: {
    min: number;
    max: number;
  };
  female_weight: {
    min: number;
    max: number;
  };
  hypoallergenic: boolean;
}

export interface Breed {
  id: string;
  type: string;
  attributes: BreedAttributes;
}

export interface BreedsResponse {
  data: Breed[];
  links: {
    self: string;
    current: string;
    next?: string;
    last?: string;
  };
  meta?: {
    pagination: {
      current: number;
      records: number;
    };
  };
}

export interface BreedResponse {
  data: Breed;
  links: {
    self: string;
  };
}

export interface FactAttributes {
  body: string;
}

export interface Fact {
  id: string;
  type: string;
  attributes: FactAttributes;
}

export interface FactsResponse {
  data: Fact[];
}

export interface GroupAttributes {
  name: string;
}

export interface Group {
  id: string;
  type: string;
  attributes: GroupAttributes;
  relationships?: {
    breeds: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

export interface GroupsResponse {
  data: Group[];
  links: {
    self: string;
    current: string;
    next?: string;
    last?: string;
  };
  meta?: {
    pagination: {
      current: number;
      records: number;
    };
  };
}

export interface GroupResponse {
  data: Group;
  links: {
    self: string;
  };
  included?: Breed[];
}

