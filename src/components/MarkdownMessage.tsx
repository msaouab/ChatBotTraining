import { Streamdown } from 'streamdown'
import { code } from '@streamdown/code'
import 'streamdown/styles.css'

const plugins = { code }

type MarkdownMessageProps = {
  content: string
  isAnimating?: boolean
}

export default function MarkdownMessage({
  content,
  isAnimating = false,
}: MarkdownMessageProps) {
  return (
    <Streamdown
      className="nova-markdown"
      plugins={plugins}
      animated
      isAnimating={isAnimating}
      caret="block"
    >
      {content}
    </Streamdown>
  )
}
