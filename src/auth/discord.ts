export interface DiscordUser {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
}

interface DiscordAuthFragment {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

const DISCORD_API_BASE = 'https://discord.com/api';
const DISCORD_AUTHORIZE_URL = 'https://discord.com/oauth2/authorize';

/** No backend in this app (see README), so login uses the OAuth2 implicit grant: the access token comes back in the redirect URL fragment and is used client-side only. */
export function buildDiscordAuthorizeUrl(clientId: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: 'identify',
  });
  return `${DISCORD_AUTHORIZE_URL}?${params.toString()}`;
}

export function parseDiscordAuthFragment(hash: string): DiscordAuthFragment | null {
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!trimmed) return null;

  const params = new URLSearchParams(trimmed);
  const accessToken = params.get('access_token');
  const tokenType = params.get('token_type');
  const expiresIn = params.get('expires_in');
  if (!accessToken || !tokenType || !expiresIn) return null;

  return { accessToken, tokenType, expiresIn: Number(expiresIn) };
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Discord user lookup failed: ${response.status}`);
  }

  const body = (await response.json()) as {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
  };

  return {
    id: body.id,
    username: body.username,
    globalName: body.global_name,
    avatar: body.avatar,
  };
}

export function discordAvatarUrl(user: DiscordUser): string | null {
  if (!user.avatar) return null;
  const extension = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=64`;
}
