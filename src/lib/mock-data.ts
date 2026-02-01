export interface MockSet {
  name: string;
  setNumber: string;
  theme: string;
  year: number;
  status:
    | "available"
    | "retired"
    | "retiring-soon"
    | "exclusive"
    | "unreleased";
  msrp: number;
  marketValue: number;
  changePercent: number;
}

export const mockSets: MockSet[] = [
  {
    name: "Millennium Falcon",
    setNumber: "75192",
    theme: "Star Wars",
    year: 2017,
    status: "available",
    msrp: 849.99,
    marketValue: 949.99,
    changePercent: 11.8,
  },
  {
    name: "Hogwarts Castle",
    setNumber: "71043",
    theme: "Harry Potter",
    year: 2018,
    status: "retired",
    msrp: 399.99,
    marketValue: 579.99,
    changePercent: 45.0,
  },
  {
    name: "Botanical Garden",
    setNumber: "41757",
    theme: "Friends",
    year: 2023,
    status: "retiring-soon",
    msrp: 99.99,
    marketValue: 89.99,
    changePercent: -10.0,
  },
  {
    name: "Colosseum",
    setNumber: "10276",
    theme: "Creator Expert",
    year: 2020,
    status: "retired",
    msrp: 549.99,
    marketValue: 699.99,
    changePercent: 27.3,
  },
  {
    name: "Land Rover Defender",
    setNumber: "42110",
    theme: "Technic",
    year: 2019,
    status: "retired",
    msrp: 199.99,
    marketValue: 319.99,
    changePercent: 60.0,
  },
  {
    name: "Camp Nou - FC Barcelona",
    setNumber: "10284",
    theme: "Creator Expert",
    year: 2021,
    status: "exclusive",
    msrp: 349.99,
    marketValue: 429.99,
    changePercent: 22.9,
  },
  {
    name: "The Lord of the Rings: Barad-dur",
    setNumber: "10333",
    theme: "Icons",
    year: 2024,
    status: "available",
    msrp: 459.99,
    marketValue: 459.99,
    changePercent: 0.0,
  },
  {
    name: "Orchid",
    setNumber: "10311",
    theme: "Botanical Collection",
    year: 2022,
    status: "available",
    msrp: 49.99,
    marketValue: 47.99,
    changePercent: -4.0,
  },
];
