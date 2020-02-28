import cs from './cs.json';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fi from './fi.json';
import fr from './fr.json';
import it from './it.json';
import no from './no.json';
import pl from './pl.json';
import ru from './ru.json';

export const defaultLocale = 'en';
export const locales = { cs, de, en, es, fi, fr, it, no, pl, ru };

const _localeFiles: { [ key: string ]: string } = {};
Object.keys(locales).forEach((value: string) => {
    _localeFiles[value] = `./locales/${value}.json`;
});

export const localeFiles: { [ key: string ]: string } = _localeFiles;
