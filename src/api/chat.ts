export async function sendChatMessage(sessionId: string, text: string): Promise<void> {
  await fetch('/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, text }),
  })
}
