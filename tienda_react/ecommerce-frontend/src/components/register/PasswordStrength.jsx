import { getStrengthLevel } from '../../utils/password'

const LABELS = ['VACÍO', 'DÉBIL', 'MEDIO', 'FUERTE', 'MÁXIMO']

export default function PasswordStrength({ value }) {
  const level = getStrengthLevel(value)

  return (
    <div className="strength" data-level={level}>
      <div className="strength-head">
        <span>NIVEL DE CRIPTO-SEGURIDAD</span>
        <b id="strengthLabel">{LABELS[level]}</b>
      </div>
      <div className="strength-bar"><i></i></div>
      <p>Mínimo 8 caracteres, alfanumérico con caracteres especiales.</p>
    </div>
  )
}
