import { Locator } from "@playwright/test"; 

export interface HealLocatorOptions {
  state?: "attached" | "detached" | "visible" | "hidden";
  timeout?: number;
}
 
export async function healLocator( 
  candidates: Array<() => Locator>,
  options?: HealLocatorOptions
): Promise<Locator> { 
  const state = options?.state ?? "visible";
  const timeout = options?.timeout ?? 5_000;
  let attempt = 0;
  for (const candidate of candidates) { 
    attempt++;
    const locator = candidate().first(); 
 
    try { 
      await locator.waitFor({ 
        state, 
        timeout 
      }); 
 
      if (attempt > 1) {
        console.log(`\x1b[32m[Auto-Healing SUCCESS]\x1b[0m Primary locator failed! Auto-healed using candidate #${attempt}: ${locator}`);
      }
      return locator; 
    } catch { 
      console.log(`\x1b[33m[Auto-Healing]\x1b[0m Candidate #${attempt} timed out. Trying candidate #${attempt + 1}...`);
    } 
  } 
 
  throw new Error( 
    "No matching locator found using healing candidates." 
  ); 
} 