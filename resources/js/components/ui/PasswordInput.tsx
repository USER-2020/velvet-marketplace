import { useState, type InputHTMLAttributes } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function PasswordInput(props: Props) {
    const [visible, setVisible] = useState(false);
    return <span className="password-field"><input {...props} type={visible ? 'text' : 'password'}/><button type="button" className="password-toggle" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{visible ? <FaEyeSlash/> : <FaEye/>}</button></span>;
}
