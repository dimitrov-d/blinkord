import { Connection, PublicKey } from '@solana/web3.js';
import env from './env';
import { NameAccountAndDomain, TldParser } from '@onsol/tldparser';

/**
 * Get the all the domains owned by a public key in a TLD
 * @param {(PublicKey | string)} address
 * @param {string} tld
 * @returns {Promise<NameAccountAndDomain[]>}
 */
export async function getOwnedDomainsFromTld(
  address: PublicKey | string,
  tld: string,
): Promise<NameAccountAndDomain[]> {
  try {
    const parser = new TldParser(new Connection(env.SOLANA_RPC_URL));
    return parser.getParsedAllUserDomainsFromTld(address, tld);
  } catch (err) {
    return [];
  }
}