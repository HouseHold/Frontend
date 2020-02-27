import af from './af.json';
import ar from './ar.json';
import cs from './cs.json';
import da from './da.json';
import de from './de.json';
import el from './el.json';
import en from './en.json';
import es from './es.json';
import fi from './fi.json';
import fr from './fr.json';
import hu from './hu.json';
import it from './it.json';
import nl from './nl.json';
import no from './no.json';
import pl from './pl.json';
import ro from './ro.json';
import ru from './ru.json';
import sv from './sv.json';
import tr from './tr.json';

export const defaultLocale = 'en';
export const locales = { af, ar, cs, da, de, el, en, es, fi, fr, hu, it, nl, no, pl, ro, ru, sv, tr };

let _localeFiles: { [ key: string ]: string } = {};
Object.keys(locales).forEach((value: string) => {
    _localeFiles[value] = `./locales/${value}.json`;
});

export const localeFiles: { [ key: string ]: string } = _localeFiles;
