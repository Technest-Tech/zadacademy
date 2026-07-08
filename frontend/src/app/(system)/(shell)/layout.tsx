import { SystemShell } from '@/components/system/shell/SystemShell'
import { ConfirmProvider } from '@/components/system/primitives/ConfirmDialog'
import { I18nProvider } from '@/lib/system/i18n'

// Browser tab title for the operations console — overrides the marketing root template
export const metadata = {
  title: {
    default: 'Zad Academy',
    template: '%s · Zad Academy',
  },
}

// All authenticated admin pages live under this layout
export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ConfirmProvider>
        <SystemShell>{children}</SystemShell>
      </ConfirmProvider>
    </I18nProvider>
  )
}
