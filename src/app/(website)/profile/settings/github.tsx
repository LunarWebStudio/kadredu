import { GithubIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function GithubConnect(){
  return(
    <div className="w-full  dark:bg-neutral-900 bg-white rounded-2xl">
      <div className="w-full px-6 py-4 border-b-2 text-lg font-bold dark:border-neutral-700 border-gray-300 dark:text-slate-300 text-slate-500">
        GitHub
      </div>
      <div className="w-full p-6">
          <Button 
            className="w-full h-[72px] dark:bg-neutral-800 bg-white flex-row gap-4 text-base font-bold text-slate-900s"
            variant="outline"
          >
            <GithubIcon className=" size-10 "/>
            Войти через GitHub
          </Button>
      </div>
    </div>
  )
}