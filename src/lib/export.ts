import type { UserExportPayload } from '../types/journal';

export function downloadJsonExport(payload: UserExportPayload, categoryFilter?: keyof UserExportPayload): void {
  const datePart = payload.exportedAt.slice(0, 10);
  let output: unknown = payload;
  let filename = `ruang-pulang-semua-catatan-${datePart}.json`;

  if (categoryFilter && categoryFilter in payload) {
    output = {
      exportedAt: payload.exportedAt,
      app: payload.app,
      contentVersion: payload.contentVersion,
      uid: payload.uid,
      category: categoryFilter,
      items: payload[categoryFilter],
    };
    filename = `ruang-pulang-${String(categoryFilter)}-${datePart}.json`;
  }

  const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrintExport(): void {
  window.print();
}
