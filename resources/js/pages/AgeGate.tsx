import { Head, useForm } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { type FormEvent } from 'react';
import { BirthDatePicker } from '../components/ui/BirthDatePicker';
import { CountrySelect } from '../components/ui/CountrySelect';

export default function AgeGate() {
    const maxDate = new Date(); maxDate.setFullYear(maxDate.getFullYear() - 18); maxDate.setHours(0, 0, 0, 0);
    const { data, setData, post, processing, errors } = useForm({ birth_date: '', country: '', terms_accepted: false });
    const submit = (event: FormEvent) => { event.preventDefault(); post('/age-gate'); };
    return <><Head title="Acceso restringido"/><main className="age-page"><section className="age-card"><a className="brand" href="/"><span>THE</span>VELVET<small>AI MODELS MARKETPLACE</small></a><div className="age-copy"><p className="eyebrow">ACCESO RESTRINGIDO</p><h1>Confirma tu mayoría de edad</h1><p>Velvet contiene experiencias destinadas exclusivamente a personas adultas. Debes tener al menos 18 años, o la edad mínima exigida en tu país.</p></div><form onSubmit={submit} noValidate><label>Fecha de nacimiento<BirthDatePicker value={data.birth_date} onChange={(value) => setData('birth_date', value)} maxDate={maxDate} invalid={Boolean(errors.birth_date)}/>{errors.birth_date && <small className="field-error">{errors.birth_date}</small>}</label><label>País o territorio de residencia<CountrySelect value={data.country} onChange={(value) => setData('country', value)} invalid={Boolean(errors.country)}/><small>Selecciona tu país de residencia.</small>{errors.country && <small className="field-error">{errors.country}</small>}</label><label className="consent"><input type="checkbox" checked={data.terms_accepted} onChange={(event) => setData('terms_accepted', event.target.checked)}/><span>Confirmo que soy mayor de edad, que la información es correcta y acepto los términos de acceso.</span></label>{errors.terms_accepted && <small className="field-error">{errors.terms_accepted}</small>}<button className="primary age-submit chevron-action" type="submit" disabled={processing}>{processing ? 'Validando…' : <>Continuar al registro <ChevronRight aria-hidden="true"/></>}</button></form><p className="privacy-note">Para esta comprobación no guardamos tu fecha de nacimiento; solo registramos que validaste tu acceso y tu país.</p></section></main></>;
}
