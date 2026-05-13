import { Outlet } from 'react-router-dom'
import { useIsMobile } from '../../hooks/useIsMobile'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const isMobile = useIsMobile()

  return (
    <div className="flex min-h-screen">
      {!isMobile && <Sidebar />}
      <div className={`flex-1 flex flex-col min-w-0 ${!isMobile ? 'ml-16' : ''}`}>
        <main className={`flex-1 ${isMobile ? 'pb-16' : ''}`}>
          <Outlet />
        </main>
      </div>
      {isMobile && <BottomNav />}
    </div>
  )
}
