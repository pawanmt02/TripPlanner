import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeText } from '../utils/sanitize';

describe('sanitizeHTML', () => {
  it('strips script tags', () => {
    const dirty = '<script>alert("XSS")</script>Hello';
    expect(sanitizeHTML(dirty)).toBe('Hello');
  });

  it('strips onclick attributes', () => {
    const dirty = '<b onclick="alert(1)">Bold</b>';
    expect(sanitizeHTML(dirty)).toBe('<b>Bold</b>');
  });

  it('allows safe tags', () => {
    expect(sanitizeHTML('<b>Bold</b>')).toBe('<b>Bold</b>');
    expect(sanitizeHTML('<em>Italic</em>')).toBe('<em>Italic</em>');
    expect(sanitizeHTML('<strong>Strong</strong>')).toBe('<strong>Strong</strong>');
  });

  it('strips disallowed tags like div, img', () => {
    expect(sanitizeHTML('<div>Content</div>')).toBe('Content');
    expect(sanitizeHTML('<img src="x" onerror="alert(1)">')).toBe('');
  });

  it('handles non-string input', () => {
    expect(sanitizeHTML(null)).toBe('');
    expect(sanitizeHTML(undefined)).toBe('');
    expect(sanitizeHTML(123)).toBe('');
  });

  it('handles empty string', () => {
    expect(sanitizeHTML('')).toBe('');
  });

  it('strips iframe injection', () => {
    const dirty = '<iframe src="https://evil.com"></iframe>Safe text';
    expect(sanitizeHTML(dirty)).toBe('Safe text');
  });
});

describe('sanitizeText', () => {
  it('strips ALL HTML tags', () => {
    expect(sanitizeText('<b>Bold</b> and <em>italic</em>')).toBe('Bold and italic');
  });

  it('strips script tags completely', () => {
    expect(sanitizeText('<script>alert("xss")</script>Hello')).toBe('Hello');
  });

  it('passes through plain text unchanged', () => {
    expect(sanitizeText('Just a plain note')).toBe('Just a plain note');
  });

  it('handles non-string input', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(42)).toBe('');
  });
});
