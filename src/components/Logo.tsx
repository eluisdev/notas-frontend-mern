import APPLogo from "../../public/logo.png"

type Props = {
  className?: string
}
export default function Logo({ className }: Props) {
  return (
    <img src={APPLogo} alt="Logotipo AppNotes" className={`${className}`} />
  )
}
