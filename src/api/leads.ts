export interface LeadPayload {
  name?: string
  contact?: string
  description?: string
  projectType?: string
  budget?: string
  deadline?: string
  calculatorConfig?: string
  source: 'quiz' | 'form' | 'calculator' | 'similar'
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: payload.source,
      name: payload.name,
      contact: payload.contact,
      description: payload.description,
      project_type: payload.projectType,
      budget: payload.budget,
      deadline: payload.deadline,
      calculator_config: payload.calculatorConfig,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('submitLead error', res.status, text)
    throw new Error(`${res.status}: ${text}`)
  }
}
