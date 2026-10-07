import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type PhoneInputProps = {
    value: string;
    onChange: (value: string) => void;
    defaultCountry?: string;
    invalid?: boolean;
    disabled?: boolean;
    required?: boolean;
    name?: string;
};

/** Reusable international telephone input. Its value is stored in E.164 form, e.g. +573001234567. */
export function PhoneInput({
    value,
    onChange,
    defaultCountry = 'co',
    invalid = false,
    disabled = false,
    required = false,
    name = 'phone',
}: PhoneInputProps) {
    return <ReactPhoneInput
        country={defaultCountry}
        value={value.replace(/^\+/, '')}
        onChange={(phone) => onChange(phone ? `+${phone}` : '')}
        enableSearch
        searchPlaceholder="Buscar país"
        preferredCountries={['co', 'us', 'mx', 'es']}
        disabled={disabled}
        containerClass="velvet-phone-input"
        inputClass={invalid ? 'velvet-phone-number velvet-phone-number-invalid' : 'velvet-phone-number'}
        buttonClass="velvet-phone-country"
        dropdownClass="velvet-phone-menu"
        searchClass="velvet-phone-search"
        inputProps={{ name, required, autoComplete: 'tel', 'aria-invalid': invalid, 'aria-label': 'Número de teléfono' }}
    />;
}
