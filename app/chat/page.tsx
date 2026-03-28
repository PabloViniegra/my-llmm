import { createConversation } from '@/lib/actions/conversations'

export default async function ChatPage() {
  await createConversation()
}
