import Link from "next/link";
import {Badge} from '@/components/ui/badge'
import { LockOpenIcon, LockIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div>
      This is the home page, accessible by anyone.
      <div>
        Now, try to access these pages:
        <ul className="p-2 list-disc">
          <li>
            <div className="flex items-center gap-1">
            <Link className="underline text-blue-500" href="/sign-in">/sign-in</Link><span><LockOpenIcon className="h-4 w-4 text-green-500"/></span>
            </div>
          </li>
          <li>
            <div className="flex items-center gap-1">
            <Link className="underline text-blue-500" href="/sign-up">/sign-up</Link><span><LockOpenIcon className="h-4 w-4 text-green-500"/></span>
            </div>
          </li>
          <li>
            <div className="flex items-center gap-1">
            <Link className="underline text-blue-500" href="/protected">/protected</Link><span>{!user ? <LockIcon className="h-4 w-4 text-red-500"/> : <LockOpenIcon className="h-4 w-4 text-green-500"/>}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
