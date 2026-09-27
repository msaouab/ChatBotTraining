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
    <div className="code-block mt-3 overflow-hidden rounded-md bg-code">
      <div className="flex items-center justify-between border-b border-white/6 px-3.5 py-2 text-xs text-[#9a9aab]">
        <span>{language}</span>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-[#9a9aab] hover:text-white"
          onClick={handleCopy}
        >
          <Copy size={14} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-3.5">
        <code className="font-mono text-[13px] leading-[1.7] text-code-fg">
          {code}
        </code>
      </pre>
    </div>
  )
}
