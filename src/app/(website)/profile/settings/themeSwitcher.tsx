import ThemeSwitch from "~/components/theme-switcher";

export default function ThemeSwitcher(){
  return(
    <div className="w-full max-w-[895px] dark:bg-neutral-900 bg-white rounded-2xl">
      <div className="w-full px-6 py-4 border-b-2 text-lg font-bold dark:border-neutral-700 border-gray-300 dark:text-slate-300 text-slate-500">
        Настройки сайта
      </div>
      <div className="w-full p-6">
          <div className="flex flex-row justify-between items-center">
            <p>Темная тема</p>
            <ThemeSwitch />
          </div>
      </div>
    </div>
  )
}