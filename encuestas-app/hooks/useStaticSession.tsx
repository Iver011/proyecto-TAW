import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"

import type { Session } from "next-auth"
export function useStaticSession() {
  const [session, setSession] = useState<Session|null>(null)

  useEffect(() => {
    getSession().then(sess => setSession(sess))
  }, [])

  return session
}
