import { Locator } from "@playwright/test"; 
 
export async function healLocator( 
  candidates: Array<() => Locator> 
): Promise<Locator> { 
  for (const candidate of candidates) { 
    const locator = candidate().first(); 
 
    try { 
      await locator.waitFor({ 
        state: "visible", 
        timeout: 5_000 
      }); 
 
      return locator; 
    } catch { 
      // Current locator failed; try the next candidate 
    } 
  } 
 
  throw new Error( 
    "No matching locator found using healing candidates." 
  ); 
} 