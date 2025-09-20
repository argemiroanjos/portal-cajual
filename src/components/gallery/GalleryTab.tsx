type GalleryTabsProps = {
  tab: "user" | "all"
  setTab: (tab: "user" | "all") => void
}

export default function GalleryTabs({ tab, setTab }: GalleryTabsProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md rounded-full p-2 flex items-center justify-between max-w-xs mx-auto">
      <button
        onClick={() => setTab("user")}
        aria-pressed={tab === "user"}
        className={`flex-1 px-6 py-3 rounded-full text-sm font-semibold transition ${
          tab === "user" ? "bg-blue-600 text-white" : "text-blue-700"
        }`}
      >
        Suas fotos
      </button>
      <button
        onClick={() => setTab("all")}
        aria-pressed={tab === "all"}
        className={`flex-1 px-6 py-3 rounded-full text-sm font-semibold transition ${
          tab === "all" ? "bg-blue-600 text-white" : "text-blue-700"
        }`}
      >
        Todas
      </button>
    </div>
  )
}
