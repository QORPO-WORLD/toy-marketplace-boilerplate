import { cn } from '../css/utils'

export type BoxProps = React.HTMLAttributes<HTMLDivElement>

const Box = ({ ...props }: BoxProps) => {
  return <div {...props} />
}

export { Box }
