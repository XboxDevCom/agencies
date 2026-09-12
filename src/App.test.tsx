import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import App from './App';
const csv = 'agency,url,focus,platforms,status,location,country\nAlpha Agency,https://alpha.example,Gaming,Twitch,unknown,Berlin,DE\nBeta Agency,https://beta.example,Lifestyle,Instagram,unknown,Zürich,CH';
beforeEach(() => {
  localStorage.setItem('creator-agencies-language', 'de');
  window.history.replaceState({}, '', '/?lang=de');
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => csv });
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});
test('loads actual records, combines filters and resets search', async () => {
  render(<App />);
  expect(await screen.findByRole('button', { name: 'Alpha Agency' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Land'), { target: { value: 'CH' } });
  expect(screen.queryByRole('button', { name: 'Alpha Agency' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Beta Agency' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'missing' } });
  expect(screen.getByText('Keine passende Agentur gefunden.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Alle Einträge anzeigen' }));
  expect(screen.getByRole('button', { name: 'Alpha Agency' })).toBeInTheDocument();
  expect(screen.getByRole('searchbox')).toHaveValue('');
});
test('dialog restores focus and search accepts spaces after closing', async () => {
  const user = userEvent.setup();
  render(<App />);
  const trigger = await screen.findByRole('button', { name: 'Alpha Agency' });
  await user.click(trigger);
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByRole('heading', { name: 'Alpha Agency' })).toBeInTheDocument();
  expect(within(dialog).getAllByText('Nicht belegt').length).toBeGreaterThan(0);
  await user.click(within(dialog).getByRole('button', { name: 'Schließen' }));
  expect(trigger).toHaveFocus();
  await user.type(screen.getByRole('searchbox'), 'Alpha Agency');
  expect(screen.getByRole('searchbox')).toHaveValue('Alpha Agency');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
test('rejects an HTML fallback response and retries without reload', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, text: async () => '<html>not csv</html>' });
  render(<App />);
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Erneut|Wiederholen|Versuchen/i }));
  expect(await screen.findByRole('button', { name: 'Alpha Agency' })).toBeInTheDocument();
});
test('switches the complete directory interface without refetching data', async () => {
  render(<App />);
  await screen.findByRole('button', { name: 'Alpha Agency' });
  fireEvent.change(screen.getByRole('combobox', { name: /^Sprache wechseln/ }), { target: { value: 'fr' } });
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Créateurs. Agences. Connexions.');
  expect(fetch).toHaveBeenCalledTimes(1);
});
test('directory semantics pass axe checks after records load', async () => {
  const { container } = render(<App />);
  await screen.findByRole('button', { name: 'Alpha Agency' });
  const results = await axe(container);
  expect(results.violations).toEqual([]);
});
test('historical evidence does not expose an unverified website as an agency link', async () => {
  (fetch as jest.Mock).mockResolvedValue({ ok: true, text: async () => 'agency,url,focus,platforms,status,source_urls,checked_at,verified_fields\nLegacy Agency,https://parked.example,Gaming,Twitch,unknown,https://partner.example/history,2026-09-12,agency\nCurrent Agency,https://current.example,Gaming,Twitch,unknown,https://current.example/about,2026-09-12,"agency, url"' });
  render(<App />);
  fireEvent.click(await screen.findByRole('button', { name: 'Legacy Agency' }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).queryByRole('link', { name: /^Website/ })).not.toBeInTheDocument();
  expect(within(dialog).getByText('Keine bestätigte aktuelle Website hinterlegt.')).toBeInTheDocument();
  expect(within(dialog).getByRole('link', { name: /Quelle 1/ })).toHaveAttribute('href', 'https://partner.example/history');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Schließen' }));
  fireEvent.click(screen.getByRole('button', { name: 'Current Agency' }));
  expect(within(screen.getByRole('dialog')).getByRole('link', { name: /^Website/ })).toHaveAttribute('href', 'https://current.example');
});
