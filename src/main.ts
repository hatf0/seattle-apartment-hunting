import fetch from 'node-fetch';
import fs from 'fs/promises';
import { DISCORD_WEBHOOK, APARTMENT_ENDPOINT } from './constants';

type ApartmentUnit = {
  unit_number: string,
  sqft: number,
  price: number,
  available: string
};

const extractUnitDetails = (input: any): ApartmentUnit => {
  return {
    unit_number: input.unit_number,
    sqft: input.area,
    price: input.price,
    available: input.available_on
  }
}

const formatApartmentUnit = (input: ApartmentUnit): string => {
  return `Unit ${input.unit_number} (${input.sqft} sqft) is available on ${input.available} for \$${input.price} / mo`;
}

const codeBlock = (input: string): string => `\`\`\`\n${input}\n\`\`\``;

const sendWebhook = async (content: string) => {
  await fetch(DISCORD_WEBHOOK, {
    body: JSON.stringify({
      content
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

async function main() {
  let oldUnits : ApartmentUnit[] = [];
  try {
    oldUnits = JSON.parse((await fs.readFile('./apartments.json', 'utf-8'))) as ApartmentUnit[];
  } catch (err) {
    /* could not read, whatever */
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const data = await (await fetch(APARTMENT_ENDPOINT)).json();
  const units = ((data as any).data.units as any[]).map(extractUnitDetails)
                                                   .filter((x) => x.price <= 2300)
                                                   .sort((a, b) => a.sqft - b.sqft);
  const newUnits = units.filter((x) => !oldUnits.some((old) => old.unit_number === x.unit_number));
  const soldUnits = oldUnits.filter((old) => !units.some((x) => old.unit_number === x.unit_number));
  await sendWebhook(`At ${timestamp}, these units are available: ${codeBlock(units.map(formatApartmentUnit).join('\n'))}`);
  if (soldUnits.length !== 0) {
    await sendWebhook(`Units no longer detected: ${codeBlock(soldUnits.map(formatApartmentUnit).join('\n'))}`);
  }
  if (newUnits.length !== 0) { 
    await sendWebhook(`<@130951003100020736> new unit(s) found`);
    await sendWebhook(`${codeBlock(newUnits.map(formatApartmentUnit).join('\n'))}`);
  }
  await fs.writeFile('./apartments.json', JSON.stringify(units, null, 2), 'utf-8');
}

main()
  .catch(async (err) => {
    await sendWebhook(`Caught error: ${err.toString()}`);
  });