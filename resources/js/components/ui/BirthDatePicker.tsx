import * as Popover from '@radix-ui/react-popover';
import { CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import 'react-day-picker/style.css';

type BirthDatePickerProps = {
    value: string;
    onChange: (value: string) => void;
    maxDate: Date;
    invalid?: boolean;
};

export function BirthDatePicker({ value, onChange, maxDate, invalid = false }: BirthDatePickerProps) {
    const selectedDate = value ? parseISO(value) : undefined;
    const [open, setOpen] = useState(false);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    className="date-picker-trigger"
                    type="button"
                    aria-invalid={invalid}
                    aria-label="Seleccionar fecha de nacimiento"
                >
                    <span>{selectedDate ? format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es }) : 'Selecciona tu fecha de nacimiento'}</span>
                    <CalendarDays aria-hidden="true" size={17} strokeWidth={1.8}/>
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className="date-picker-popover"
                    sideOffset={8}
                    align="start"
                    onFocusOutside={() => setOpen(false)}
                    onInteractOutside={() => setOpen(false)}
                    onEscapeKeyDown={() => setOpen(false)}
                >
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            if (!date) return;

                            onChange(format(date, 'yyyy-MM-dd'));
                            setOpen(false);
                        }}
                        defaultMonth={selectedDate ?? maxDate}
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={maxDate}
                        disabled={{ before: new Date(1900, 0, 1), after: maxDate }}
                        locale={es}
                        weekStartsOn={1}
                        showOutsideDays
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
