import { Checkbox, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
    items: string[];
    checked?: string[]; // Checked može biti undefined
    onChange: (items: string[]) => void;
}

export default function CheckboxButtons({ items, checked = [], onChange }: Props) {
    const [checkedItems, setCheckedItems] = useState<string[]>(checked);

    // Sinhronizacija checkedItems sa spoljnim checked
    useEffect(() => {
        setCheckedItems(checked);
    }, [checked]);

    const handleChecked = (value: string) => {
        const currentIndex = checkedItems.indexOf(value);
        let newChecked: string[] = [];

        if (currentIndex === -1) {
            // Dodaj u checkedItems ako nije selektovano
            newChecked = [...checkedItems, value];
        } else {
            // Ukloni iz checkedItems ako je selektovano
            newChecked = checkedItems.filter(item => item !== value);
        }

        setCheckedItems(newChecked);
        onChange(newChecked); // Obaveštava roditeljsku komponentu o promeni
    };

    return (
        <FormGroup>
            <FormLabel>Types</FormLabel>
            {items.map((item) => (
                <FormControlLabel
                    key={item}
                    control={
                        <Checkbox
                            checked={checkedItems.includes(item)} // Proverava da li je selektovano
                            onChange={() => handleChecked(item)} // Menja stanje
                        />
                    }
                    label={item}
                />
            ))}
        </FormGroup>
    );
}
