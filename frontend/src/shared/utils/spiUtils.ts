import React from "react";

export default class SpiUtils {

    static maskMatricula(e: React.ChangeEvent<HTMLInputElement>, setMatricula: React.Dispatch<React.SetStateAction<string>>) {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        setMatricula(value);
        e.target.value = value;
    }

}