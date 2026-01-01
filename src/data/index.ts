// Import all JSON data files
import breedsData from "./breeds.json";
import breedsPage1Data from "./breeds-page1.json";
import breedsAllData from "./breeds-all.json";
import factsData from "./facts.json";
import groupsPage1Data from "./groups-page1.json";
import groupsAllData from "./groups-all.json";

// Import all individual group files
import group1bbf373b from "./group-1bbf373b-1937-4e73-9863-45385daa4979.json";
import group56081cf0 from "./group-56081cf0-fdf2-4114-9bf7-23a3f5b6af91.json";
import group7f6ea988 from "./group-7f6ea988-366a-4e20-b4ba-4d04274fea61.json";
import group8000793f from "./group-8000793f-a1ae-4ec4-8d55-ef83f1f644e5.json";
import groupab110192 from "./group-ab110192-e41b-43ff-a630-f7aee156b33a.json";
import groupb8e4e89d from "./group-b8e4e89d-057f-432a-9e58-0b85b29b693c.json";
import groupbe0147df from "./group-be0147df-7755-4228-b132-2518c0c6d10d.json";
import groupd4b72541 from "./group-d4b72541-a1c6-46d7-b13c-709e148c7884.json";
import groupf56dc4b1 from "./group-f56dc4b1-ba1a-4454-8ce2-bd5d41404a0c.json";

// Export main data files
export {
  breedsData,
  breedsPage1Data,
  breedsAllData,
  factsData,
  groupsPage1Data,
  groupsAllData,
};

// Create and export group data map
export const groupDataMap: Record<string, unknown> = {
  "1bbf373b-1937-4e73-9863-45385daa4979": group1bbf373b,
  "56081cf0-fdf2-4114-9bf7-23a3f5b6af91": group56081cf0,
  "7f6ea988-366a-4e20-b4ba-4d04274fea61": group7f6ea988,
  "8000793f-a1ae-4ec4-8d55-ef83f1f644e5": group8000793f,
  "ab110192-e41b-43ff-a630-f7aee156b33a": groupab110192,
  "b8e4e89d-057f-432a-9e58-0b85b29b693c": groupb8e4e89d,
  "be0147df-7755-4228-b132-2518c0c6d10d": groupbe0147df,
  "d4b72541-a1c6-46d7-b13c-709e148c7884": groupd4b72541,
  "f56dc4b1-ba1a-4454-8ce2-bd5d41404a0c": groupf56dc4b1,
};

