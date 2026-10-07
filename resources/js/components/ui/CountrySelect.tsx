import Select, { type SingleValue, type StylesConfig } from 'react-select';
import { getNames, registerLocale } from 'i18n-iso-countries';
import spanishLocale from 'i18n-iso-countries/langs/es.json';
import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';

registerLocale(spanishLocale);

type CountryOption = { value: string; label: string };

const countryOptions: CountryOption[] = Object.entries(getNames('es'))
    .map(([value, label]) => ({ value, label }))
    .sort((first, second) => first.label.localeCompare(second.label, 'es'));

const styles: StylesConfig<CountryOption, false> = {
    control: (base, state) => ({ ...base, minHeight: 42, borderRadius: 9, borderColor: state.isFocused ? '#b76eff' : '#ffffff1b', backgroundColor: '#ffffff0b', boxShadow: state.isFocused ? '0 0 0 3px #9944e22b' : 'none', '&:hover': { borderColor: '#b76eff' } }),
    singleValue: (base) => ({ ...base, color: '#fff' }),
    input: (base) => ({ ...base, color: '#fff' }),
    placeholder: (base) => ({ ...base, color: '#aaa4b2' }),
    menu: (base) => ({ ...base, zIndex: 30, overflow: 'hidden', border: '1px solid #ffffff22', borderRadius: 9, backgroundColor: '#211629' }),
    menuList: (base) => ({ ...base, maxHeight: 210, padding: 4 }),
    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#7834bd' : state.isFocused ? '#ffffff12' : 'transparent', color: '#f8f5fb', cursor: 'pointer' }),
    dropdownIndicator: (base) => ({ ...base, color: '#bdaacb', '&:hover': { color: '#fff' } }),
    indicatorSeparator: () => ({ display: 'none' }),
};

type CountrySelectProps = { value: string; onChange: (value: string) => void; invalid?: boolean };

export function CountrySelect({ value, onChange, invalid = false }: CountrySelectProps) {
    const selected = countryOptions.find((country) => country.value === value) ?? null;
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    return <Select<CountryOption, false>
        inputId="country"
        name="country"
        options={countryOptions}
        value={selected}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        onBlur={() => setMenuIsOpen(false)}
        onChange={(country: SingleValue<CountryOption>) => {
            onChange(country?.value ?? '');
            setMenuIsOpen(false);
        }}
        closeMenuOnSelect
        blurInputOnSelect
        placeholder="Selecciona tu país"
        noOptionsMessage={() => 'No se encontraron países'}
        formatOptionLabel={(country) => <span className="country-option"><span className="react-tel-input country-flag-sprite" aria-hidden="true"><span className={`flag ${country.value.toLowerCase()}`}/></span><span>{country.label}</span><small>{country.value}</small></span>}
        styles={styles}
        aria-invalid={invalid}
        aria-label="País o territorio de residencia"
    />;
}
