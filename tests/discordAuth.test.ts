import { describe, expect, it } from 'vitest';
import {
  buildDiscordAuthorizeUrl,
  discordAvatarUrl,
  parseDiscordAuthFragment,
} from '../src/auth/discord';

describe('buildDiscordAuthorizeUrl', () => {
  it('requests an implicit-grant token with the identify scope', () => {
    const url = new URL(buildDiscordAuthorizeUrl('client-123', 'https://example.com/'));
    expect(url.origin + url.pathname).toBe('https://discord.com/oauth2/authorize');
    expect(url.searchParams.get('client_id')).toBe('client-123');
    expect(url.searchParams.get('redirect_uri')).toBe('https://example.com/');
    expect(url.searchParams.get('response_type')).toBe('token');
    expect(url.searchParams.get('scope')).toBe('identify');
  });
});

describe('parseDiscordAuthFragment', () => {
  it('parses a valid redirect fragment', () => {
    const fragment = parseDiscordAuthFragment(
      '#access_token=abc123&token_type=Bearer&expires_in=604800&scope=identify',
    );
    expect(fragment).toEqual({ accessToken: 'abc123', tokenType: 'Bearer', expiresIn: 604800 });
  });

  it('works without a leading #', () => {
    const fragment = parseDiscordAuthFragment('access_token=abc123&token_type=Bearer&expires_in=60');
    expect(fragment?.accessToken).toBe('abc123');
  });

  it('returns null for an empty hash', () => {
    expect(parseDiscordAuthFragment('')).toBeNull();
    expect(parseDiscordAuthFragment('#')).toBeNull();
  });

  it('returns null when required fields are missing', () => {
    expect(parseDiscordAuthFragment('#error=access_denied')).toBeNull();
  });
});

describe('discordAvatarUrl', () => {
  it('returns null when the user has no avatar', () => {
    expect(discordAvatarUrl({ id: '1', username: 'a', globalName: null, avatar: null })).toBeNull();
  });

  it('builds a png URL for a static avatar', () => {
    const url = discordAvatarUrl({ id: '1', username: 'a', globalName: null, avatar: 'deadbeef' });
    expect(url).toBe('https://cdn.discordapp.com/avatars/1/deadbeef.png?size=64');
  });

  it('builds a gif URL for an animated avatar', () => {
    const url = discordAvatarUrl({ id: '1', username: 'a', globalName: null, avatar: 'a_deadbeef' });
    expect(url).toBe('https://cdn.discordapp.com/avatars/1/a_deadbeef.gif?size=64');
  });
});
