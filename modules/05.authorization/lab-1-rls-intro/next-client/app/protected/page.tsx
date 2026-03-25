import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profiles, error } = await supabase.from("profiles").select("*")


  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Here is the content of the profiles table you have access to:
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        {error ? <>
          <h2 className="font-bold text-2xl mb-4">Error</h2>
          <pre className="text-xs font-mono p-3 rounded border max-h-74 w-full overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </>
          :
          <>
            <h2 className="font-bold text-2xl mb-4">Profiles</h2>
            <pre className="text-xs font-mono p-3 rounded border max-h-74 w-full overflow-auto">
              {JSON.stringify(profiles, null, 2)}
            </pre>
          </>}
      </div>
      <div>
      </div>
    </div>
  );
}
