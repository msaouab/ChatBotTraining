import { useState } from 'react'
import type { ReactNode } from 'react'
import { Copy } from 'lucide-react'

type CodeBlockProps = {
  language?: string
  children: ReactNode
}

export default function CodeBlock({
  language = 'jsx',
  children,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const code = typeof children === 'string' ? children : String(children ?? '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="code-block">
      <div className="code-head">
        <span>{language}</span>
        <button type="button" className="copy-btn" onClick={handleCopy}>
          <Copy size={14} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
